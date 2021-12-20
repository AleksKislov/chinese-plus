const Text = require("../../src/models/Text");

const plagiatChecker = async textChunks => {
  let allTexts;
  try {
    allTexts = await Text.find().select("title _id origintext");
  } catch (err) {
    console.log(err);
  }

  const textToCheck = getOnlyChars(textChunks);
  const textToCheckLen = textToCheck.length;
  const minLength = 4;

  const susTexts = allTexts.map(dbText => {
    const susText = getOnlyChars(dbText.origintext);
    const susTextLen = susText.length;

    // choose the shortest of the two texts
    const testingLength = susTextLen >= textToCheckLen ? textToCheckLen : susTextLen;
  });
};

/**
 * @param {array} textChunks - array of strings with Chinese chars
 * @returns {string} - text with Chinese chars only
 */
const getOnlyChars = textChunks => {
  return textChunks.reduce((acc, chunk) => {
    return chunk
      .split("")
      .filter(char => /\p{Script=Han}/u.test(char))
      .join("");
  }, "");
};

module.exports = { plagiatChecker };
