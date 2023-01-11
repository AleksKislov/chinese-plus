import Link from "next/link";
import { faTelegram, faVk, faYoutube } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Contacts() {
  return (
    <div>
      <h2>Пойти на Контакт</h2>
      <p>
        Telegram: <code>@sinokislov</code>
        <br />
        Email: <code>sinokislov@gmail.com</code>
      </p>
      <p>
        Вы также можете просто писать здесь в <Link href='/posts'>Гостевой</Link> или в любом месте
        на сайте.
        <br />
        Любой комментарий с сайта сразу поступает в мой телеграм.
      </p>
      <p>
        Если хотите показать скриншот с багом, то лучше сразу в почту или телеграм писать. Спасибо!
      </p>

      <h4>О Нас</h4>

      <p className=''>
        <span className=''>
          Проект делают 2 человека. С нами можно связаться и в соцсетях (быстрее в Телеграме):{" "}
          <Link href='https://t.me/chineseplusnew' target={"_blank"}>
            <FontAwesomeIcon icon={faTelegram} className='iconSize mx-1' />
          </Link>{" "}
          <Link href='https://vk.com/buyilehu' target={"_blank"}>
            <FontAwesomeIcon icon={faVk} className='iconSize mx-1' />
          </Link>{" "}
          <Link href='https://www.youtube.com/c/Buyilehuorg' target={"_blank"}>
            <FontAwesomeIcon icon={faYoutube} className='iconSize mx-1' />
          </Link>
        </span>
        <br /> У нас также еще жив{" "}
        <Link href='https://www.chineseplus.ru/' target={"_blank"}>
          наш старый сайт.
        </Link>
      </p>
    </div>
  );
}
