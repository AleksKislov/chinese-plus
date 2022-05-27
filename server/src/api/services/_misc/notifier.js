const axios = require("axios");

const url = process.env.TELEGRAM_NOTICE_URL;
const testChatId = process.env.TEST_CHAT_ID;
const tgChannelId = process.env.TGCHANNEL_ID;
const isDevMode = process.env.NODE_ENV === "development";

class Notifier {
  static toAdmin(txt) {
    return axios.get(encodeURI(`${url}&text=<pre>${txt}</pre>&chat_id=${testChatId}`));
  }

  static telegramPublic(contenType, title, author) {
    const txt = `Новое <pre>${contenType}</pre>\nНазвание: ${title}`;
    return axios.get(
      encodeURI(`${url}&text=${txt}&chat_id=${isDevMode ? testChatId : tgChannelId}`)
    );
  }
}

module.exports = { Notifier };
