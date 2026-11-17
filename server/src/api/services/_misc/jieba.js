const { Jieba } = require('@node-rs/jieba');
const { dict } = require('@node-rs/jieba/dict');

const jieba = Jieba.withDict(dict);

module.exports = { jieba };
