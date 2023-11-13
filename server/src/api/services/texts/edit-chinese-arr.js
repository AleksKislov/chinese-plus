const Text = require("../../../models/Text");

async function editChineseArr(req, res) {
  const { textId, chineseArr, isLongText, pageToEdit } = req.body;
  if (!chineseArr || !Array.isArray(chineseArr)) throw new Error("No chinese arr to update");

  const isLngTxtEdit = isLongText && Number.isInteger(pageToEdit);

  let newFields = {};
  if (isLngTxtEdit) {
    newFields = { [`pages.${pageToEdit}`]: { chinese_arr: chineseArr } };
  } else {
    newFields.chinese_arr = chineseArr;
  }

  await Text.findByIdAndUpdate(textId, { $set: newFields }, { new: true });
  return res.json({ status: "done" });
}

module.exports = { editChineseArr };
