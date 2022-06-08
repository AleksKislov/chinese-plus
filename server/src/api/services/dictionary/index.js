const { apiDecorator } = require("../../api-decorator");

const { updateWord } = require("./update-word");

module.exports = {
  updateWord: apiDecorator(updateWord),
};
