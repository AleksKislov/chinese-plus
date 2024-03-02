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
  const id = content._id;
  const base = "https://www.chineseplus.club/";
  if (content.cnSubs) {
    obj.type = `🎬 Новое <a href='${`${base}watch/videos/${id}`}'>видео</a> от пользователя ${
      content.user.name
    }`;
    obj.desc = content.desc;
    obj.lvl = content.lvl;
  } else if (content.origintext) {
    obj.type = `📚 Новый <a href='${`${base}read/texts/${id}`}'>текст</a> от пользователя ${
      content.user.name
    }`;
    obj.desc = content.description;
    obj.lvl = content.level;
  } else {
    obj.type = `🚀 <a href='${`${base}feedback/${id}`}'>Новости</a> от админа`;
    obj.desc = content.text.replace(/\<br \/>/g, "\n");
  }

  obj.title = content.title;

  return writeMsg(obj);
}

function writeMsg({ type, title, desc, lvl }) {
  return `${type}! ${lvl ? `Уровень: ${getStars(lvl)}` : ""}

💡 ${title}

🔎 ${desc}`;
}

function getStars(lvl) {
  let s = "";
  for (let i = 0; i < lvl; i++) {
    s += "⭐";
  }
  return s;
}

module.exports = { Notify };
