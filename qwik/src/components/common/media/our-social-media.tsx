import { component$ } from "@builder.io/qwik";
import { telegramSvg, vkSvg, youtubeSvg } from "./svg";
import { Link } from "@builder.io/qwik-city";

export const OurSocialMedia = component$(() => {
  const socMedia = [
    { href: "https://t.me/chineseplusnew", svg: telegramSvg },
    { href: "https://www.youtube.com/c/Buyilehuorg", svg: youtubeSvg },
    { href: "https://vk.com/buyilehu", svg: vkSvg },
  ];

  return (
    <>
      {socMedia.map(({ href, svg }, ind) => (
        <Link href={href} target={"_blank"} class={"pl-2 hover:text-info"} key={ind}>
          {svg}
        </Link>
      ))}
    </>
  );
});
