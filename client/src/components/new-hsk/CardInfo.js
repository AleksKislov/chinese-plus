import React from "react";

const CardInfo = ({ isForTests, isOldHsk }) => {
  let text, title, subtitle;

  const isNewHskTable = !isOldHsk && !isForTests;
  const isOldHskTable = isOldHsk && !isForTests;
  const isNewHskTests = !isOldHsk && isForTests;

  if (isOldHskTable) {
    text = "Все 5000 слов HSK, отсортированные по уровням сложности: от 1 до 6";
    title = "Слова HSK 2.0";
    subtitle = "Вся лексика";
  } else if (isNewHskTable) {
    text =
      "Все слова нового HSK v3.0, отсортированные по уровням сложности (aka band): от 1 до 7-8-9 (последние 3 уровня не разделяют)";
    title = "Слова HSK 3.0";
    subtitle = "Вся лексика";
  } else if (isNewHskTests) {
    text =
      "Проверьте насколько хорошо вы знаете лексику нового HSK 3.0 для разных уровней сложности.";
    title = "HSK 3.0 тесты";
    subtitle = "Короткие тесты";
  }

  return (
    <div className='card-body'>
      <h4 className='card-title'>{title}</h4>
      <h6 className='card-subtitle mb-2 text-muted'>{subtitle}</h6>
      <p className='card-text'>{text}</p>
    </div>
  );
};

export default CardInfo;
