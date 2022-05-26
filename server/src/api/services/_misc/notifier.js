const axios = require("axios");

const url = process.env.TELEGRAM_NOTICE_URL;
const testChatId = process.env.TEST_CHAT_ID;
const tgChannelId = process.env.TGCHANNEL_ID;

const notifier = (who) => {
  if (who === "me") {
    return (txt) => axios.get(encodeURI(`${url}&text=<pre>${txt}</pre>&chat_id=${testChatId}`));
  }

  return (txt) => axios.get(encodeURI(`${url}&text=<pre>${txt}</pre>&chat_id=${tgChannelId}`));
};

module.exports = { notifyMe: notifier("me"), notifyTgChannel: notifier() };
