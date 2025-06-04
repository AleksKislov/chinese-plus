const { getBookChineseArr } = require('../_misc');
const BookPage = require('../../../models/BookPage');

async function updateBookPage(req, res) {
  const { origintext, translation } = req.body;

  const pageId = req.params.page_id;

  let newFields = {};
  if (origintext) {
    const origTxtStr = origintext.join('\n');

    newFields.origintext = origintext;
    newFields.chinese_arr = getBookChineseArr(origTxtStr);
  }
  if (translation) newFields.translation = translation;

  await BookPage.findByIdAndUpdate(pageId, { $set: newFields }, { new: true });

  return res.json({ status: 'done' });
}

module.exports = { updateBookPage };
