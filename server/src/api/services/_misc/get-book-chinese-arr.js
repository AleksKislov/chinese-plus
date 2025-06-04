const nodejieba = require('nodejieba');

const getBookChineseArr = (txt) => {
  return nodejieba.cut(txt).filter((word) => word !== ' ');
};

module.exports = { getBookChineseArr };
