const axios = require('axios');
const qs = require('qs');
const { isDevelopment } = require('../../../../server');
const { logger } = require('../../../logger');

const tgUrl = process.env.TELEGRAM_NOTICE_URL;
const testChatId = process.env.TEST_CHAT_ID;
const tgChannelId = isDevelopment ? testChatId : process.env.TGCHANNEL_ID;
const vkChannelId = isDevelopment ? '' : process.env.VKCHANNEL_ID;
const vkToken = process.env.VKCHANNEL_TOKEN;

class Notify {
  static admin(txt) {
    return axios
      .get(encodeURI(`${tgUrl}&text=${txt.replace(/<[^>]*>?/gm, '')}&chat_id=${testChatId}`))
      .catch((err) =>
        logger.error({ err: err.response?.data || err.message }, 'Notify.admin failed'),
      );
  }

  static telegramPublic(txt) {
    axios
      .get(encodeURI(`${tgUrl}&text=${txt}&chat_id=${tgChannelId}`))
      .catch((err) =>
        logger.error({ err: err.response?.data || err.message }, 'Notify.telegramPublic failed'),
      );
  }

  static vkPublic(message) {
    const data = qs.stringify({
      v: '5.131',
      owner_id: vkChannelId,
      access_token: vkToken,
      message,
    });

    const config = {
      method: 'post',
      url: 'https://api.vk.com/method/wall.post',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data,
    };

    axios(config)
      .then((res) => {
        // VK API returns HTTP 200 even on failure, with the error in the response body
        if (res.data?.error) {
          logger.error({ err: res.data.error }, 'Notify.vkPublic failed');
        }
      })
      .catch((err) =>
        logger.error({ err: err.response?.data || err.message }, 'Notify.vkPublic failed'),
      );
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
  const base = 'https://www.chineseplus.club/';

  if (content.cnSubs) {
    const link = `${base}watch/videos/${id}`;
    obj.head = getMsgHeader('video', link, content.lvl, userName, isVk);
    obj.desc = content.desc;
    obj.link = link;
  } else if (content.origintext) {
    const link = `${base}read/texts/${id}`;
    obj.head = getMsgHeader('text', link, content.level, userName, isVk, content.audioSrc);
    obj.desc = content.description;
    obj.link = link;
  } else if (content.postType) {
    const link = `${base}read/blog/${id}`;
    obj.head = getMsgHeader('blog', link, null, userName, isVk);
    obj.desc = getBlogDesc(content.content);
    obj.link = link;
  } else {
    const link = `${base}feedback/${id}`;
    obj.head = getMsgHeader('post', link, null, null, isVk);
    obj.desc = content.text.replace(/\<br \/>/g, '\n');
    obj.link = link;
  }

  obj.title = content.title;

  return writeMsg(obj, isVk);
}

function getMsgHeader(contentType, link, lvl, userName, isVk, hasAudio) {
  const audioSuffix = hasAudio ? ' 🎧 с озвучкой' : '';

  if (isVk) {
    switch (contentType) {
      case 'video':
        return `🎬 Новое видео от пользователя ${userName}! ${
          lvl ? `Уровень: ${getStars(lvl)}` : ''
        }`;
      case 'text':
        return `📚 Новый текст от пользователя ${userName}! ${
          lvl ? `Уровень: ${getStars(lvl)}${audioSuffix}` : ''
        }`;
      case 'blog':
        return `📝 Новый пост в блоге от пользователя ${userName}!`;
      case 'post':
        return `🚀 Новости от админа!`;
    }
  }

  switch (contentType) {
    case 'video':
      return `🎬 Новое <a href='${link}'>видео</a> от пользователя ${userName}! ${
        lvl ? `Уровень: ${getStars(lvl)}` : ''
      }`;
    case 'text':
      return `📚 Новый <a href='${link}'>текст</a> от пользователя ${userName}! ${
        lvl ? `Уровень: ${getStars(lvl)}${audioSuffix}` : ''
      }`;
    case 'blog':
      return `📝 Новый <a href='${link}'>пост в блоге</a> от пользователя ${userName}!`;
    case 'post':
      return `🚀 <a href='${link}'>Новости</a> от админа!`;
  }
}

const BLOG_DESC_MAX_LEN = 300;

function getBlogDesc(blocks) {
  if (!Array.isArray(blocks)) return '';
  const textBlock = blocks.find((block) => block?.type === 'text' && (block.text || '').trim());
  if (!textBlock) return '';

  const firstParagraph = textBlock.text.trim().split('\n')[0].trim();

  return firstParagraph.length > BLOG_DESC_MAX_LEN
    ? firstParagraph.slice(0, BLOG_DESC_MAX_LEN).trimEnd() + '…'
    : firstParagraph;
}

function writeMsg({ head, title, desc, link }, isVk) {
  return `${head}

💡 ${title}

🔎 ${desc} ${
    isVk
      ? `

🔗 ${link}`
      : ''
  }`;
}

function getStars(lvl) {
  let s = '';
  for (let i = 0; i < lvl; i++) {
    s += '⭐';
  }
  return s;
}

module.exports = { Notify };
