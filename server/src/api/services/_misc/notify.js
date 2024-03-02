const axios = require("axios");
const qs = require("qs");
const { isDevelopment } = require("../../../../server");

const tgUrl = process.env.TELEGRAM_NOTICE_URL;
const testChatId = process.env.TEST_CHAT_ID;
const tgChannelId = isDevelopment ? testChatId : process.env.TGCHANNEL_ID;
const vkChannelId = isDevelopment ? "" : process.env.VKCHANNEL_ID;
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
    this.telegramPublic(getTxt(content));
    this.vkPublic(getTxt(content, true));
  }
}

function getTxt(content, isVk) {
  const obj = {};
  const id = content._id;
  const userName = content.user.name;
  const base = "https://www.chineseplus.club/";

  if (content.cnSubs) {
    const link = `${base}watch/videos/${id}`;
    obj.head = getMsgHeader("video", link, content.lvl, userName, isVk);
    obj.desc = content.desc;
    obj.link = link;
  } else if (content.origintext) {
    const link = `${base}read/texts/${id}`;
    obj.head = getMsgHeader("text", link, content.level, userName, isVk);
    obj.desc = content.description;
    obj.link = link;
  } else {
    const link = `${base}feedback/${id}`;
    obj.head = getMsgHeader("post", link, null, null, isVk);
    obj.desc = content.text.replace(/\<br \/>/g, "\n");
    obj.link = link;
  }

  obj.title = content.title;

  return writeMsg(obj, isVk);
}

function getMsgHeader(contentType, link, lvl, userName, isVk) {
  if (isVk) {
    switch (contentType) {
      case "video":
        return `🎬 Новое видео от пользователя ${userName}! ${
          lvl ? `Уровень: ${getStars(lvl)}` : ""
        }`;
      case "text":
        return `📚 Новый текст от пользователя ${userName}! ${
          lvl ? `Уровень: ${getStars(lvl)}` : ""
        }`;
      case "post":
        return `🚀 Новости от админа!`;
    }
  }

  switch (contentType) {
    case "video":
      return `🎬 Новое <a href='${link}'>видео</a> от пользователя ${userName}! ${
        lvl ? `Уровень: ${getStars(lvl)}` : ""
      }`;
    case "text":
      return `📚 Новый <a href='${link}'>текст</a> от пользователя ${userName}! ${
        lvl ? `Уровень: ${getStars(lvl)}` : ""
      }`;
    case "post":
      return `🚀 <a href='${link}'>Новости</a> от админа!`;
  }
}

function writeMsg({ head, title, desc, link }, isVk) {
  return `${head}

💡 ${title}

🔎 ${desc} ${
    isVk
      ? `

🔗 ${link}`
      : ""
  }`;
}

function getStars(lvl) {
  let s = "";
  for (let i = 0; i < lvl; i++) {
    s += "⭐";
  }
  return s;
}

module.exports = { Notify };
