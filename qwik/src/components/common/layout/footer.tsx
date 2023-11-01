import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { OurSocialMedia } from "../media/our-social-media";

export const Footer = component$(() => {
  return (
    <footer class='footer footer-center p-10 text-neutral-content rounded bg-neutral mt-4'>
      <div>
        <Link class='link link-hover' href='/contacts'>
          Контакты
        </Link>
      </div>
      <div>
        <div class='grid grid-flow-col gap-2'>
          <OurSocialMedia />
        </div>
      </div>
      <div>
        <p>
          <span class='font-bold'>Chinese</span>
          <span class={`text-success font-extrabold text-lg`}>+</span> © {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
});
