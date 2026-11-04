const mongoose = require('mongoose');
const DeprecatedDictionaryRussian = require('../../src/models/DeprecatedDictionaryRussian');

// the DSL markup (`russian`) of dictionary entries is in deprecated_dictionary_russian once
// scripts/move-russian-to-deprecated.js has run, before that still in `dictionaries`
const sources = () => [
  DeprecatedDictionaryRussian.collection,
  mongoose.connection.collection('dictionaries'),
];

/** `{ _id, chinese, russian }` of the entries matching a filter on _id / chinese / russian. */
async function findRussian(filter) {
  const byId = new Map();
  for (const source of sources()) {
    const docs = await source
      .find({ russian: { $exists: true }, ...filter }, { projection: { chinese: 1, russian: 1 } })
      .toArray();
    docs.forEach((d) => byId.has(String(d._id)) || byId.set(String(d._id), d));
  }
  return [...byId.values()];
}

/** Adds `russian` to plain dictionary docs. */
async function withRussian(docs) {
  const found = await findRussian({ _id: { $in: docs.map((d) => d._id) } });
  const russianById = new Map(found.map((d) => [String(d._id), d.russian]));
  docs.forEach((d) => {
    d.russian = russianById.get(String(d._id)) ?? d.russian;
  });
  return docs;
}

module.exports = { findRussian, withRussian };
