const Text = require('../../../models/Text');
const { shortUserInfoFields } = require('../../consts');
const { countZnChars, countUniqChars } = require('../_misc');

async function getById(req, res) {
  const withoutOriginTxt = req.query.no_origin === 'true';
  const text = await Text.findByIdAndUpdate(req.params.id, { $inc: { hits: 1 } }, { new: true })
    .populate('user', shortUserInfoFields)
    .select('-name' + (withoutOriginTxt ? ' -origintext' : ''));

  if (!text) return res.status(404).json({ msg: 'Text not found' });

  if (text.pages?.length) {
    const pages = text.pages.map((page) => {
      const origTxt = page.chinese_arr.join('');
      const origParagsLen = origTxt.split('\n').map((parag) => countZnChars(parag));
      const uniqCharsTotal = countUniqChars(origTxt);

      const pageContent = {
        translation: page.translation,
        chinese_arr: page.chinese_arr,
        origParagsLen,
        uniqCharsTotal,
      };

      return withoutOriginTxt ? pageContent : { ...pageContent, origintext: page.origintext };
    });

    return res.json({ ...text.toObject(), pages, origParagsLen: [0], uniqCharsTotal: 0 });
  }

  const origTxt = text.chinese_arr.join('');
  const origParagsLen = origTxt.split('\n').map((parag) => countZnChars(parag));
  const uniqCharsTotal = countUniqChars(origTxt);

  return res.json({ ...text.toObject(), origParagsLen, uniqCharsTotal });
}

module.exports = { getById };
