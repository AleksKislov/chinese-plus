const mongoose = require('mongoose');
const Text = require('../../../models/Text');
const { shortUserInfoFields } = require('../../consts');
const { countZnChars, countUniqChars } = require('../_misc');
const { shouldCountHit } = require('../../../hits');

async function getById(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).json({ msg: 'Text not found' });
  }

  const withoutOriginTxt = req.query.no_origin === 'true';
  const selectFields = '-name' + (withoutOriginTxt ? ' -origintext' : '');
  const countHit = shouldCountHit('text', req.params.id, req.query.vid);

  const text = countHit
    ? await Text.findByIdAndUpdate(req.params.id, { $inc: { hits: 1 } }, { new: true })
        .populate('user', shortUserInfoFields)
        .select(selectFields)
    : await Text.findById(req.params.id)
        .populate('user', shortUserInfoFields)
        .select(selectFields);

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
