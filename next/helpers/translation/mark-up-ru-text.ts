import { sanitizer } from "./sanitizer";

export const markUpRuText = (text: string, showExamples: boolean = false): string => {
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
  return sanitizer(text);
};
