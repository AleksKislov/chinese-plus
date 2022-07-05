import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTelegram, faVk, faYoutube } from "@fortawesome/free-brands-svg-icons";

const Footer = ({}) => {
  return (
    <footer className='footer' id='myFooter'>
      <div className='container text-center'>
        <span className='text-muted'>
          Связь с <Link href='/contacts'>админом</Link>
        </span>
      </div>
      <div className='container text-center'>
        <span className='text-muted'>
          Следите за проектом:{" "}
          <a href='https://t.me/chineseplusnew' target='_blank' rel='noreferrer'>
            <FontAwesomeIcon icon={faTelegram} />
          </a>{" "}
          <a href='https://vk.com/buyilehu' target='_blank' rel='noreferrer'>
            <FontAwesomeIcon icon={faVk} />
          </a>{" "}
          <a href='https://www.youtube.com/c/Buyilehuorg' target='_blank' rel='noreferrer'>
            <FontAwesomeIcon icon={faYoutube} />
          </a>
        </span>
      </div>
    </footer>
  );
};

export default Footer;
