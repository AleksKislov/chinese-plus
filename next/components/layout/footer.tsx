import Link from "next/link";

import { faTelegram, faVk, faYoutube } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Footer() {
  return (
    <footer className='text-center text-muted myFooter'>
      <div className='container'>
        <div>
          <span>
            Связь с <Link href='/contacts'>админом</Link>
          </span>
        </div>
        <div>
          <span>
            Следите за проектом:{" "}
            {media.map((x, ind) => (
              <Link href={x.href} target='_blank' key={ind}>
                <FontAwesomeIcon icon={x.icon} className='iconSize mx-1' />
              </Link>
            ))}
          </span>
        </div>
      </div>
    </footer>
  );
}

const media = [
  {
    href: "https://www.youtube.com/c/Buyilehuorg",
    icon: faYoutube,
  },
  {
    href: "https://t.me/chineseplusnew",
    icon: faTelegram,
  },
  {
    href: "https://vk.com/buyilehu",
    icon: faVk,
  },
];
