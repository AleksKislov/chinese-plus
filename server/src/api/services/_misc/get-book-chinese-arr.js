const { jieba } = require('./jieba');

const getBookChineseArr = (txt) => {
  return jieba.cut(txt, true).filter((word) => word !== ' ');
};

module.exports = { getBookChineseArr };
