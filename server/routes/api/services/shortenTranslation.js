function shortenTranslation(txt) {
  if (!txt) return '';
  txt = txt.replace(/\[\*\]\[ex\].*?\[\/ex\]\[\/\*\]/g, '').replaceAll('[m3][/m]', '');
  if (txt.length > 400) {
    const ind = txt.slice(200, txt.length).indexOf('[m2]');
    txt = txt.slice(0, ind + 200);
  }
  return txt;
}

module.exports = { shortenTranslation };
