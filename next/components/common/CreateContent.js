import React from "react";
import { Link } from "react-router-dom";

const CreateContent = () => {
  const btns = [
    { ru: "Текст", en: "text" },
    { ru: "Видео", en: "video" },
  ];

  return (
    <div>
      <h2>
        Поделитесь текстом или видео <small className='text-muted'>и станьте героем 💪</small>
      </h2>
      <p>Каким именно материалом Вы хотели бы поделиться?</p>
      {btns.map(({ ru, en }, ind) => (
        <Link key={ind} className='btn btn-sm btn-info mr-2' to={`/create-${en}`}>
          {ru}
        </Link>
      ))}
    </div>
  );
};

export default CreateContent;
