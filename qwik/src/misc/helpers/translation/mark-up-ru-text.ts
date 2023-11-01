// import { sanitizer } from "./sanitizer";

export const markUpRuText = (text: string, showExamples: boolean = false): string => {
  if (!text) return " ";
  text = text
    .replace(/\[b\]\\\[o\\\]\d\[\/b\]/g, "")
    .replace(/\[b\]/g, "<span class='font-bold text-success'>")
    .replace(/\[\/b\]/g, "</span>")
    .replace(/\[c\]/g, "<span class='text-success'>")
    .replace(/\[\/c\]/g, "</span>")
    .replace(/\[p\]/g, "<span class='text-success italic text-xs'>")
    .replace(/\[\/p\]/g, "</span>")
    .replace(/\[i\]/g, "<span class='italic'>")
    .replace(/\[\/i\]/g, "</span>")
    .replace(/\[m1\]/g, "<span class='block'>")
    .replace(/\[m\d\]/g, "<span class='tippyExample block'>")
    .replace(/\[\/m\]/g, "</span>")
    .replace(/\[\*\]\[ex\]/g, `<div class='text-sky-300 indent-5 ${showExamples ? "" : "hidden"}'>`)
    .replace(/\[\/ex\]\[\/\*\]/g, "</div>")
    .replace(/\\\[(.+?)\\\]/g, "($1)");

  const regex = /\[ref\](.+?)\[\/ref\]/;
  for (let i = 0; i < 12; i++) {
    text = text.replace(regex, `<a href="/search/?q=$1" target="_blank">$1</a>`);
  }
  return text;
};
