const { apiDecorator } = require("../../api-decorator");

const { updateWord } = require("./update-word");
const { rollbackUpdate } = require("./rollback-update");

module.exports = {
  updateWord: apiDecorator(updateWord),
  rollbackUpdate: apiDecorator(rollbackUpdate),
};
