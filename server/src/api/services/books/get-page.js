const BookPage = require('../../../models/BookPage');

const getPage = async (req, res) => {
  const { id: bookId, chapter_id: belongsTo, page_ind: pageInd = 0 } = req.params;

  const page = await BookPage.find({ book: bookId, belongsTo, ind: pageInd }).select(
    'chinese_arr translation length origintext',
  );
  res.json(page[0]);
};

module.exports = { getPage };
