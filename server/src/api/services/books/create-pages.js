const BookPage = require('../../../models/BookPage');
const { countZnChars, CHARS_PER_PAGE, getBookChineseArr } = require('../_misc');

const createPages = async (req, res) => {
  // origintext is array of paragraphs
  const { belongsTo, origintext, bookId } = req.body;

  // save later for the corresponding book content id in belongsTo
  const origTxtStr = origintext.join('\n');
  const chapterLength = countZnChars(origTxtStr);

  if (chapterLength <= CHARS_PER_PAGE) {
    const page = new BookPage({
      belongsTo,
      ind: 0,
      book: bookId,
      length: chapterLength,
      origintext,
      translation: [],
      chinese_arr: getBookChineseArr(origTxtStr),
    });

    await page.save();
    res.json([page]);
  } else {
    // split into pages
    const pages = await BookPage.insertMany(getPages(origintext, belongsTo, bookId));
    res.json(pages);
  }
};

/**
 * same as getPagesForLngTxt
 * @param {string[]} origintext
 * @returns {Object[]}
 */
function getPages(origintext, belongsTo, bookId) {
  const pages = [];

  let pageText = '';
  let pageOriginTxt = [];

  const origTxtLeng = origintext.length;
  for (let i = 0; i < origTxtLeng; i++) {
    const paragTxt = origintext[i];

    if (pageText.length >= CHARS_PER_PAGE) {
      pages.push(getPage(belongsTo, pages.length, pageText, bookId));

      pageText = '';
      pageOriginTxt = [];
    }

    pageText += paragTxt + '\n';
    pageOriginTxt.push(paragTxt);
  }

  pages.push(getPage(belongsTo, pages.length, pageText, bookId));
  return pages;
}

const getPage = (belongsTo, ind, paragTxt, bookId) => {
  const length = countZnChars(paragTxt);

  const chineseArr = getBookChineseArr(paragTxt);
  if (chineseArr.at(-1) === '\n') {
    chineseArr.pop(); // remove last newline character if it exists
  }

  return {
    belongsTo,
    ind,
    book: bookId,
    length,
    origintext: paragTxt.split('\n').filter(Boolean),
    translation: [],
    chinese_arr: chineseArr,
  };
};

module.exports = { createPages };
