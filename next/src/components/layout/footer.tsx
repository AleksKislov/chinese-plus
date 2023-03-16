"use client";
import Link from "next/link";
import { faTelegram, faVk, faYoutube } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;

export default function Footer() {
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

  return (
    <footer className='text-center text-muted mt-auto bg-primary py-3'>
      <div className='container'>
        <div>
          Связь с{" "}
          <Link href='/contacts' className='text-decoration-none'>
            админом
          </Link>
        </div>
        <div>
          Следите за проектом:{" "}
          {media.map((x, ind) => (
            <Link href={x.href} target='_blank' key={ind}>
              <FontAwesomeIcon icon={x.icon} className='mx-1' />
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
