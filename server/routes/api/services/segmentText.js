const hanzi = require("../dict/dictionary");

const segmentText = text => hanzi.segment(text);

module.exports = { segmentText };
