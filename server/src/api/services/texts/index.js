const { apiDecorator } = require("../../api-decorator");

const { updateTxt } = require("./update");
const { createTxt } = require("./create");

module.exports = { createTxt: apiDecorator(createTxt), updateTxt: apiDecorator(updateTxt) };
