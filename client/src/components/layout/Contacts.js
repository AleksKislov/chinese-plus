import React from "react";
import { Helmet } from "react-helmet";

const Contacts = () => {
  return (
    <div>
      <Helmet>
        <meta charSet='utf-8' />
        <title>Связь с Chinese+</title>
      </Helmet>
      <h2>Пойти на Контакт</h2>
      <p>
        Личный Телеграм админа: @sinokislov <br />
        Личная почта: sinokislov@gmail.com
      </p>
      <p>
        Вы также можете просто писать здесь в Гостевой или в любом месте, где есть комментарии.
        <br />
        Любое сообщение с сайта сразу поступает в мой телеграм.
      </p>
      <p>
        Если хотите показать скриншот с багом, то лучше сразу в почту или телеграм писать. Спасибо!
      </p>

      <h4>О Нас</h4>

      <p className=''>
        <span className=''>
          Проект делают 2 человека. С нами можно связаться и в соцсетях (быстрее в Телеграме):{" "}
          <a href='https://t.me/chineseplusnew' target='_blank'>
            <i className='fab fa-telegram'></i>
          </a>{" "}
          <a href='https://vk.com/buyilehu' target='_blank'>
            <i className='fab fa-vk'></i>
          </a>{" "}
          <a href='https://www.youtube.com/c/Buyilehuorg' target='_blank'>
            <i className='fab fa-youtube'></i>
          </a>{" "}
          <a href='https://www.facebook.com/buyilehu/' target='_blank'>
            <i className='fab fa-facebook-square'></i>
          </a>
        </span>
        <br /> У нас также еще жив{" "}
        <a href='https://www.chineseplus.ru/' target='_blank'>
          наш старый сайт.
        </a>
      </p>
    </div>
  );
};

export default Contacts;
