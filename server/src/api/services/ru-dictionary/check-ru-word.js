const axios = require('axios');
const RussianWord = require('../../../models/RussianWord');

/**
 * @desc when an exact match isn't found, ask the spellcheck API for
 * suggestions and flag which of those suggestions exist in our dictionary
 */
async function checkRuWord(text) {
  const form = new URLSearchParams();
  form.append('text', text);
  form.append('language', 'ru-RU');

  let replacements = [];
  try {
    const { data } = await axios.post(process.env.CHECK_WORD_API, form);
    replacements = (data.matches?.[0]?.replacements || []).slice(0, 10);
  } catch (err) {
    console.log('[ru-dictionary] spellcheck API failed', err.message);
    return [];
  }

  const values = replacements.map((r) => r.value);
  const foundDocs = await RussianWord.find({ ru: { $in: values } }, 'ru');
  const foundValues = new Set(foundDocs.map((d) => d.ru));

  return values.map((value) => ({ value, canBeFound: foundValues.has(value) }));
}

module.exports = { checkRuWord };
