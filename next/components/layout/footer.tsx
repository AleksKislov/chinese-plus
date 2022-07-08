import { useEffect, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTelegram, faVk, faYoutube } from "@fortawesome/free-brands-svg-icons";
import Script from "next/script";

const Footer = ({}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
      <Script
        src='https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.slim.min.js'
        integrity='sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj'
        crossOrigin='anonymous'
      ></Script>

      {isMounted && (
        <Script
          src='https://cdn.jsdelivr.net/npm/bootstrap@4.6.1/dist/js/bootstrap.bundle.min.js'
          integrity='sha384-fQybjgWLrvvRgtW6bFlB7jaZrFsaBXjsOMm/tB9LTS58ONXgqbR9W8oWht/amnpF'
          crossOrigin='anonymous'
        ></Script>
      )}
    </footer>
  );
};

export default Footer;
