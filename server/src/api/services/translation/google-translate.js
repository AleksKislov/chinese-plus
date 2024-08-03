const { Translate } = require('@google-cloud/translate').v2;
const translate = new Translate();

/**
 * @param {string|array} text - text can be a string for translating
 * a single piece of text, or an array of strings for translating
 * multiple texts.
 */
const googleTranslate = async (text) => {
  let [translations] = await translate
    .translate(text, 'ru')
    .catch((err) => console.log('ОШИБКА GCLOUD TRANSLATE', err));
  translations = Array.isArray(translations) ? translations : [translations];

  return translations;
};

module.exports = { googleTranslate };
