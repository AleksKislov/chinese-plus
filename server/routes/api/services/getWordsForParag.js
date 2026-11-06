const Dictionary = require('../../../src/models/Dictionary');
const User = require('../../../src/models/User');
const { attachSenses } = require('../../../src/api/services/dictionary/translations/attach-senses');

const getWordsForParag = async ({ words: arr, textId, paragInd, userId }) => {
  const promises = [
    Dictionary.find({ chinese: { $in: arr } })
      .select('-date -edited -russian')
      .lean()
      .then(attachSenses),
  ];
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
