const axios = require("axios");

const notifyMe = async text => {
  const url = process.env.TELEGRAM_NOTICE_URL;
  const chat_id = process.env.NOTIFICATION_CHAT_ID;
  const encodedURL = encodeURI(`${url}&text=<pre>${text}</pre>&chat_id=${chat_id}`);
  await axios.get(encodedURL);
};

module.exports = { notifyMe };
