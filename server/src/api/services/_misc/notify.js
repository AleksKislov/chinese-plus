const axios = require("axios");
const qs = require("qs");

const isDevMode = process.env.NODE_ENV === "development";

const tgUrl = process.env.TELEGRAM_NOTICE_URL;
const tgChannelId = isDevMode ? process.env.TEST_CHAT_ID : process.env.TGCHANNEL_ID;
const vkChannelId = process.env.VKCHANNEL_ID;
const vkToken = process.env.VKCHANNEL_TOKEN;

class Notify {
  static admin(txt) {
    return axios.get(encodeURI(`${tgUrl}&text=<pre>${txt}</pre>&chat_id=${testChatId}`));
  }

  static telegramPublic(txt) {
    try {
      axios.get(encodeURI(`${tgUrl}&text=${txt})}&chat_id=${tgChannelId}`));
    } catch (e) {
      console.log(e);
    }
  }

  static vkPublic(message) {
    const data = qs.stringify({
      v: "5.131",
      owner_id: vkChannelId,
      access_token: vkToken,
      message,
    });

    const config = {
      method: "post",
      url: "https://api.vk.com/method/wall.post",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      data,
    };

    try {
      axios(config);
    } catch (e) {
      console.log(e);
    }
  }

  static socialMedia(content) {
    const msg = getTxt(content);

    this.telegramPublic(msg);
    this.vkPublic(msg);
  }
}

function getTxt(content) {
  const obj = {};
  if (content.cnSubs) {
    obj.type = `📺 <strong>Опубликовано новое видео от пользователя</strong> ${content.userName}`;
    obj.link = `https://www.chineseplus.club/videos/${content._id}`;
    obj.desc = content.desc;
  } else if (content.origintext) {
    obj.type = `📚 <strong>Опубликован новый текст от пользователя</strong> ${content.name}`;
    obj.link = `https://www.chineseplus.club/texts/${content._id}`;
    obj.desc = content.description;
  } else {
    obj.type = `🚀 <strong>Новости от админа</strong>`;
    obj.desc = content.text.replace(/\<br \/>/g, "\n");
    obj.link = `https://www.chineseplus.club/posts/${content._id}`;
  }

  obj.title = content.title;

  return writeMsg(obj);
}

function writeMsg({ type, link, title, desc }) {
  return `${type}!

👀 ${title}

📝 ${desc}

🔗 ${link}`;
}

module.exports = { Notify };
