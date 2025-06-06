const BookPage = require('../../../models/BookPage');
const { countZnChars } = require('../_misc');

const getPage = async (req, res) => {
  const withoutOriginTxt = req.query.no_origin === 'true';

  const { id: bookId, chapter_id: belongsTo, page_ind: pageInd = 0 } = req.params;

  const page = await BookPage.find({ book: bookId, belongsTo, ind: pageInd }).select(
    'chinese_arr translation length' + (withoutOriginTxt ? '' : ' origintext'),
  );

  const origTxt = page[0].chinese_arr.join('');
  const origParagsLen = origTxt.split('\n').map((parag) => countZnChars(parag));

  return res.json({ ...page[0].toObject(), origParagsLen });
};

module.exports = { getPage };
