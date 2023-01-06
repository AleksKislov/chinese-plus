import Link from "next/link";
import { faTelegram, faVk, faYoutube } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import UndecLink from "./undec-link";

export default function Footer() {
  return (
    <footer className='text-center text-muted mt-auto bg-primary py-3'>
      <div className='container'>
        <div>
          <span>
            Связь с <UndecLink href='/contacts' txt='админом' />
          </span>
        </div>
        <div>
          Следите за проектом:{" "}
          {media.map((x, ind) => (
            <Link href={x.href} target='_blank' key={ind}>
              <FontAwesomeIcon icon={x.icon} className='iconSize mx-1' />
            </Link>
          ))}
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
