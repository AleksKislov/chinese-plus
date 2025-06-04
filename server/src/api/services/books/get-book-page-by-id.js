const BookPage = require('../../../models/BookPage');

const getBookPageById = async (req, res) => {
  const { page_id: pageId } = req.params;

  const page = await BookPage.findById(pageId).select('chinese_arr translation origintext');
  res.json(page);
};

module.exports = { getBookPageById };
