const axios = require("axios");

const url = process.env.TELEGRAM_NOTICE_URL;
const testChatId = process.env.TEST_CHAT_ID;
const tgChannelId = process.env.TGCHANNEL_ID;
const isDevMode = process.env.NODE_ENV === "development";

class Notify {
  static admin(txt) {
    return axios.get(encodeURI(`${url}&text=<pre>${txt}</pre>&chat_id=${testChatId}`));
  }

  static telegramPublic(content) {
    try {
      axios.get(
        encodeURI(`${url}&text=${getTxt(content)}&chat_id=${isDevMode ? testChatId : tgChannelId}`)
      );
    } catch (e) {
      console.log(e);
    }
  }
}

function getTxt(content) {
  const obj = {};
  if (content.cnSubs) {
    obj.type = `📺 Опубликовано новое <strong>видео</strong> от пользователя ${content.userName}`;
    obj.link = `https://www.chineseplus.club/videos/${content._id}`;
    obj.desc = content.desc;
  } else {
    obj.type = `📚 Опубликован новый <strong>текст</strong> от пользователя ${content.name}`;
    obj.link = `https://www.chineseplus.club/texts/${content._id}`;
    obj.desc = content.description;
  }

  obj.title = content.title;

  return writeMsg(obj);
}

function writeMsg({ type, link, title }) {
  return `${type}!

Название: ${title}
${link}`;
  // Описание: ${desc}
}

module.exports = { Notify };
