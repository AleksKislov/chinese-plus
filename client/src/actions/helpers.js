import axios from "axios";
import React from "react";
import { symbolsToIgnore } from "../constants/consts.json";

/**
 * @param {string} text
 * @returns {Array<string>}
 */
export const parseTags = (text) => {
  let tags = text.replaceAll("，", ",");
  tags = tags.replaceAll("、", ",");
  return tags.split(",").map((tag) => tag.trim().toLowerCase()); // array of words
};

/**
 * @param {string} txt
 * @returns {Array<string>}
 */
export const textToCleanArr = (txt) => {
  return txt
    .trim()
    .split("\n")
    .map((chunk) => chunk.trim())
    .filter(Boolean);
};

/**
 *
 * @param {array} allwords
 * @param {array} wordsFromDB
 */
export const itirateWordsFromDB = (allwords, wordsFromDB) => {
  return allwords.map((word) => {
    for (let i = 0; i < wordsFromDB.length; i++) {
      if (word === wordsFromDB[i].chinese) {
        return wordsFromDB[i];
      }
    }
    return word;
  });
};

export const chunkArrayFunc = (arr) => {
  // get indexes for \n in the array of words
  let inds = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === "\n") {
      inds.push(i);
    }
  }
  // console.log(inds);

  let chunkedArr = [];

  for (let i = 0; i < inds.length; i++) {
    if (i === 0) {
      chunkedArr.push(arr.slice(0, inds[i]));
    } else {
      chunkedArr.push(arr.slice(inds[i - 1] + 1, inds[i]));
    }
  }
  chunkedArr.push(arr.slice(inds[inds.length - 1] + 1));

  return chunkedArr;
};

export const getWords = async (words) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const { data } = await axios.post("/api/dictionary/allwords", words, config);
    return data;
  } catch (err) {
    console.log(err);
  }
};

/**
 * @param {Array<[string]>} wordsArr
 * @returns
 */
export const getWordsForVideo = async (wordsArr) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const { data } = await axios.post("/api/dictionary/allWordsForVideo", wordsArr, config);
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const getTranslation = async (text) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const body = JSON.stringify({ text });

  try {
    const { data } = await axios.post("/api/translation", body, config);
    return data;
  } catch (err) {
    console.log(err);
    return { translation: [""] };
  }
};

/**
 * @param {Object} obj - text from texts or page in books
 */
export const parseChineseWords = async (obj) => {
  const wordsFromDB = await getWords(obj.chinese_arr);
  const newArr = itirateWordsFromDB(obj.chinese_arr, wordsFromDB);
  return chunkArrayFunc(newArr); // array of object arrays
};

export async function parseWordsForVideo(wordsArr) {
  const wordsArrFromDB = await getWordsForVideo(wordsArr);
  let readyArr = [];
  for (let i = 0; i < wordsArr.length; i++) {
    readyArr.push(itirateWordsFromDB(wordsArr[i], wordsArrFromDB[i]));
  }
  return readyArr;
}

export const segmenter = async (text) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const { data } = await axios.post("/api/dictionary/segmenter", { text }, config);
    return data;
  } catch (err) {
    console.log(err);
  }
};

/**
 *
 * @param {string} picTheme - theme word, e.g. "forest"
 * @returns {boolean}
 */
export const getPhotos = async (picTheme) => {
  const photosDiv = document.getElementById("photosDiv");
  photosDiv.innerHTML = "";

  try {
    const { data } = await axios.get("/api/translation/unsplash/" + picTheme);

    data.forEach((el) => {
      const img = document.createElement("img");
      img.src = el.small;
      photosDiv.appendChild(img);
      img.classList.add("imgToChoose");
    });

    return data.length > 0;
  } catch (err) {
    console.log(err);
  }
};

export const numberToStr = (num) => {
  let arr = num.toString().split("");
  const length = arr.length;
  if (length < 4) {
    return arr.join("");
  } else {
    arr.splice(length - 3, 0, " ");
    return arr.join("");
  }
};

/**
 * for counting Chinese characters in Paragraph component
 * @param {string} str  - Chinese text
 * @returns {number}    - number of Chinese chars in str w/o spaces
 */
export const countZnChars = (str) => {
  if (!str) return 0;

  symbolsToIgnore.forEach((char) => {
    str = str.replaceAll(char, "");
  });
  return str.length;
};

/**
 *
 * @param {string} href - window.location.href
 */
export const checkBaseUrl = (href) =>
  href.includes("localhost") ? "http://localhost:5000" : "https://www.chineseplus.club";

/**
 * @param {number} lvl -
 */
export const levelStars = (lvl) => {
  if (lvl === 3)
    return (
      <span className='text-stars'>
        <i className='fas fa-star text-warning'></i>
        <i className='fas fa-star text-warning'></i>
        <i className='fas fa-star text-warning'></i>
      </span>
    );
  if (lvl === 2)
    return (
      <span className='text-stars'>
        <i className='fas fa-star text-warning'></i>
        <i className='fas fa-star text-warning'></i>
        <i className='fas fa-star text-muted'></i>
      </span>
    );
  if (lvl === 1)
    return (
      <span className='text-stars'>
        <i className='fas fa-star text-warning'></i>
        <i className='fas fa-star text-muted'></i>
        <i className='fas fa-star text-muted'></i>
      </span>
    );
};

/**
 * for Analytics, Post, TextCard, Comment
 * @param {string} date
 * @param {boolean} onlyDate
 */
export const dateToStr = (date, onlyDate) => {
  const str = new Date(date);
  const options = { year: "numeric", month: "short", day: "numeric" };
  const rusDate = str.toLocaleDateString("ru-RU", options); // 22 авг. 2020 г.
  if (onlyDate) return rusDate;
  return `${rusDate}, ${date.slice(11, 16)}`;
};

/**
 * @param {string} id - user id
 * @param {string} name - user name
 */
export const addressToUser = (id, name) => {
  document.getElementById("textForm").value += ` @@[${id}]{${name}}@@, `;
};

export const fromNow = (date) => {
  const timestampNow = Date.now();
  const commentTimestamp = Date.parse(date);
  const seconds = parseInt((timestampNow - commentTimestamp) / 1000);
  const day = 3600 * 24; // seconds in a day
  // const month = 3600 * 24 * 30; // seconds in a month
  if (seconds < 60) {
    return seconds + " сек.";
  } else if (seconds >= 60 && seconds < 3600) {
    const minutes = parseInt(seconds / 60);
    return minutes + " мин.";
  } else if (seconds >= 3600 && seconds < day) {
    const hours = parseInt(seconds / 3600);
    return hours + " ч.";
  } else {
    // if(seconds >= day && seconds < month)
    const days = parseInt(seconds / day);
    return days + " дн.";
  }
};

/**
 * @param {string} translation
 * @param {boolean} showExamples
 * @returns {string}
 */
export const markUpRussianText = (text, showExamples = false) => {
  if (!text) return " ";
  text = text
    .replace(/\[b\]\\\[o\\\]\d\[\/b\]/g, "")
    .replace(/\[b\]/g, "<span class='tippyBold'>")
    .replace(/\[\/b\]/g, "</span>")
    .replace(/\[c\]/g, "<span class='tippyColor'>")
    .replace(/\[\/c\]/g, "</span>")
    .replace(/\[p\]/g, "<span class='tippyColor tippyItalic'>")
    .replace(/\[\/p\]/g, "</span>")
    .replace(/\[i\]/g, "<span class='tippyItalic'>")
    .replace(/\[\/i\]/g, "</span>")
    .replace(/\[m1\]/g, "<span class='tippyParagraph'>")
    .replace(/\[m\d\]/g, "<span class='tippyExample'>")
    .replace(/\[\/m\]/g, "</span>")
    .replace(/\[\*\]\[ex\]/g, `<div class='tippyExs${showExamples ? "Show" : ""}'>`)
    .replace(/\[\/ex\]\[\/\*\]/g, "</div>")
    .replace(/\\\[(.+?)\\\]/g, "($1)");

  const regex = /\[ref\](.+?)\[\/ref\]/;
  for (let i = 0; i < 12; i++) {
    text = text.replace(regex, `<a href="/search/$1" target="_blank">$1</a>`);
  }
  return text;
};

/**
 * @param {string} translation
 * @param {boolean} showExamples
 * @returns {string}
 */
export const parseRussian = (translation, showExamples) => {
  if (!translation) return " ";
  let russian = markUpRussianText(translation, showExamples);

  if (russian.length > 2000) {
    const ind = russian.slice(800, russian.length).indexOf("<span class='tippyExample'>");
    russian = russian.slice(0, ind + 800);
  }

  return russian;
};

export const shuffleArr = (arr) => {
  if (!arr) return [];
  let newArr = [...arr];
  const len = arr.length;
  for (let i = 0; i < len; i++) {
    const randInd = Math.floor(Math.random() * len);
    [newArr[i], newArr[randInd]] = [newArr[randInd], newArr[i]];
  }
  return newArr;
};

export function validURL(str) {
  const pattern = new RegExp(
    "^(https?:\\/\\/)?" +
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // protocol // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator
  // console.log(pattern.test(str));
  return !!pattern.test(str);
}

function addProtocolIfNeeded(str) {
  if (str.includes("http://") || str.includes("https://")) {
    return str;
  } else {
    return "http://" + str;
  }
}

/**
 * @description - checks if given string is url, if true - return URL object
 * @param {string} str
 * @returns {object | string}
 */
export const parseURL = (str) => {
  try {
    return new URL(addProtocolIfNeeded(str));
  } catch (err) {
    // TODO add notifications
    console.log(err);
  }
};
