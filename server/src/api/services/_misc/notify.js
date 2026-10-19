const fs = require('fs');
const https = require('https');
const path = require('path');
const axios = require('axios');
const qs = require('qs');
const { logger } = require('../../../logger');

const isDevelopment = process.env.NODE_ENV === 'development';

const tgUrl = process.env.TELEGRAM_NOTICE_URL;
const testChatId = process.env.TEST_CHAT_ID;
const tgChannelId = isDevelopment ? testChatId : process.env.TGCHANNEL_ID;
const vkChannelId = isDevelopment ? '' : process.env.VKCHANNEL_ID;
const vkToken = process.env.VKCHANNEL_TOKEN;
const maxChannelId = isDevelopment ? '' : process.env.MAXCHANNEL_ID;
const maxToken = process.env.MAXCHANNEL_TOKEN;
// platform-api2.max.ru uses a certificate issued by the Russian Trusted Root CA (Минцифры),
// which is not in Node's default CA list
const maxCaPath = path.join(__dirname, '../../../../certs/russian_trusted_root_ca.pem');
const maxHttpsAgent = fs.existsSync(maxCaPath)
  ? new https.Agent({ ca: fs.readFileSync(maxCaPath) })
  : null;

// tgUrl already has a query (?parse_mode=HTML); axios appends params to it, encoding each
// value fully - unlike encodeURI, which left & and # in the text and cut the message there
function sendTelegram(text, chatId) {
  return axios.get(tgUrl, { params: { text, chat_id: chatId } });
}

// for user-written text in parse_mode=HTML messages: a stray < or & makes Telegram reject them
function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

class Notify {
  static admin(txt) {
    return sendTelegram(escapeHtml(txt.replace(/<[^>]*>?/gm, '')), testChatId).catch((err) =>
      logger.error({ err: err.response?.data || err.message }, 'Notify.admin failed'),
    );
  }

  static telegramPublic(txt) {
    sendTelegram(txt, tgChannelId).catch((err) =>
      logger.error({ err: err.response?.data || err.message }, 'Notify.telegramPublic failed'),
    );
  }

  static vkPublic(message, link) {
    const post = (attachments) =>
      axios({
        method: 'post',
        url: 'https://api.vk.com/method/wall.post',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        data: qs.stringify({
          v: '5.131',
          owner_id: vkChannelId,
          access_token: vkToken,
          message,
          attachments,
        }),
      });

    // wall.post adds a link preview (og:image, title) only for a URL passed in attachments,
    // but VK rejects the whole post when it doesn't like the page's image (error 100,
    // "link_photo_sizing_rule. No photo given") - then post again without the preview.
    // An error in the body means nothing was posted, so the retry can't duplicate the post.
    post(link)
      .then((res) => {
        // VK API returns HTTP 200 even on failure, with the error in the response body
        if (!res.data?.error) return;
        if (!link) return logger.error({ err: res.data.error }, 'Notify.vkPublic failed');

        logger.warn({ err: res.data.error }, 'Notify.vkPublic: link preview rejected, retrying');
        return post(undefined).then((retryRes) => {
          if (retryRes.data?.error) {
            logger.error({ err: retryRes.data.error }, 'Notify.vkPublic failed');
          }
        });
      })
      .catch((err) =>
        logger.error({ err: err.response?.data || err.message }, 'Notify.vkPublic failed'),
      );
  }

  static maxPublic(text) {
    if (!maxChannelId || !maxToken) return;
    if (!maxHttpsAgent) {
      logger.error({ maxCaPath }, 'Notify.maxPublic failed: CA certificate not found');
      return;
    }

    axios
      .post(
        'https://platform-api2.max.ru/messages',
        { text },
        {
          params: { chat_id: maxChannelId },
          headers: { Authorization: maxToken },
          httpsAgent: maxHttpsAgent,
        },
      )
      .catch((err) =>
        logger.error({ err: err.response?.data || err.message }, 'Notify.maxPublic failed'),
      );
  }

  static socialMedia(content) {
    this.telegramPublic(getTxt(content));
    this.vkPublic(getTxt(content, true), getLink(content));
    // plain-text variant (with the link at the end), same as VK
    this.maxPublic(getTxt(content, true, MAX_DESC_MAX_LEN));
  }
}

// MAX rejects messages longer than 4000 chars; leave room for header, title and link
const MAX_DESC_MAX_LEN = 3000;

function getLink(content) {
  const base = 'https://www.chineseplus.club/';
  const id = content._id;

  if (content.cnSubs) return `${base}watch/videos/${id}`;
  if (content.origintext) return `${base}read/texts/${id}`;
  return `${base}read/blog/${id}`;
}

function getTxt(content, isVk, descMaxLen) {
  const obj = {};
  // the Telegram (non-VK) text is HTML, so user-written parts are escaped
  const safe = (str) => (isVk ? str : escapeHtml(str));
  const userName = safe(content.user.name);
  const link = getLink(content);

  if (content.cnSubs) {
    obj.head = getMsgHeader('video', link, content.lvl, userName, isVk);
    obj.desc = content.desc;
  } else if (content.origintext) {
    obj.head = getMsgHeader('text', link, content.level, userName, isVk, content.audioSrc);
    obj.desc = content.description;
  } else {
    obj.head = getMsgHeader('blog', link, null, userName, isVk);
    obj.desc = getBlogDesc(content.content);
  }

  obj.link = link;

  obj.title = safe(content.title);
  if (descMaxLen) obj.desc = truncate(obj.desc || '', descMaxLen);
  obj.desc = safe(obj.desc);

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
  }
}

const BLOG_DESC_MAX_LEN = 300;

function getBlogDesc(blocks) {
  if (!Array.isArray(blocks)) return '';
  const textBlock = blocks.find((block) => block?.type === 'text' && (block.text || '').trim());
  if (!textBlock) return '';

  const firstParagraph = textBlock.text.trim().split('\n')[0].trim();

  return truncate(firstParagraph, BLOG_DESC_MAX_LEN);
}

function truncate(str, maxLen) {
  return str.length > maxLen ? str.slice(0, maxLen).trimEnd() + '…' : str;
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
