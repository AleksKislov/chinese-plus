const { apiDecorator } = require("../../api-decorator");

const { createOrUpdate } = require("./create-or-update");

module.exports = { createOrUpdate: apiDecorator(createOrUpdate) };
