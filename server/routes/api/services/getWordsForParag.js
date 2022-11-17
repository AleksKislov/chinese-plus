const Dictionary = require("../../../src/models/Dictionary");
const User = require("../../../src/models/User");

const getWordsForParag = async ({ words: arr, textId, paragInd, userId }) => {
  const promises = [Dictionary.find({ chinese: { $in: arr } }).select("-date -edited")];
  if (userId) promises.push(User.findById(userId));
  const [words, user] = await Promise.all(promises);

  let isAlreadyRead = false;
  if (user) {
    console.log(user);
    const readArr = user.read_today_arr && user.read_today_arr[textId];
    isAlreadyRead = readArr ? readArr.includes(paragInd) : false;
  }

  return {
    isAlreadyRead,
    words,
  };
};

module.exports = { getWordsForParag };
