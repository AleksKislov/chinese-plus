const axios = require("axios");
const qs = require("qs");
const { isDevelopment } = require("../../../../server");

const tgUrl = process.env.TELEGRAM_NOTICE_URL;
const testChatId = process.env.TEST_CHAT_ID;
const tgChannelId = isDevelopment ? testChatId : process.env.TGCHANNEL_ID;
const vkChannelId = process.env.VKCHANNEL_ID;
const vkToken = process.env.VKCHANNEL_TOKEN;

class Notify {
  static admin(txt) {
    return axios
      .get(encodeURI(`${tgUrl}&text=${txt.replace(/<[^>]*>?/gm, "")}&chat_id=${testChatId}`))
      .catch(console.log);
  }

  static telegramPublic(txt) {
    axios.get(encodeURI(`${tgUrl}&text=${txt}&chat_id=${tgChannelId}`)).catch(console.log);
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

    axios(config).catch(console.log);
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
    obj.type = `📺 Опубликовано новое видео от пользователя ${content.user.name}`;
    obj.link = `https://www.chineseplus.club/watch/videos/${content._id}`;
    obj.desc = content.desc;
  } else if (content.origintext) {
    obj.type = `📚 Опубликован новый текст от пользователя ${content.user.name}`;
    obj.link = `https://www.chineseplus.club/read/texts/${content._id}`;
    obj.desc = content.description;
  } else {
    obj.type = `🚀 Новости от админа`;
    obj.desc = content.text.replace(/\<br \/>/g, "\n");
    obj.link = `https://www.chineseplus.club/feedback/${content._id}`;
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
