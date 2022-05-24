const axios = require("axios");

const notifyMe = (text) => {
  const url = process.env.TELEGRAM_NOTICE_URL;
  const chatId = process.env.NOTIFICATION_CHAT_ID;
  const encodedURL = encodeURI(`${url}&text=<pre>${text}</pre>&chat_id=${chatId}`);
  axios.get(encodedURL);
};

module.exports = { notifyMe };
