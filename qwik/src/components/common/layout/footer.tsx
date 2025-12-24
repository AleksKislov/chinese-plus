import { component$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import { OurSocialMedia } from '../media/our-social-media';
import { desktopSvg, serverStackSvg } from '../media/svg';

export const Footer = component$(({ beVersion }: { beVersion: string }) => {
  return (
    <footer class="footer footer-center gap-6 p-10 rounded bg-base-300 mt-4">
      <div class="flex">
        <Link class="link link-hover" href="/contacts">
          Контакты
        </Link>

        {/* <Link class="link link-hover" href="/donate">
          Донат и цели
        </Link> */}

        <Link class="link link-hover" href="/feedback">
          Форум
        </Link>
      </div>
      <div>
        <div class="grid grid-flow-col gap-2">
          <OurSocialMedia />
        </div>
      </div>
      <div>
        <div>
          <span class="font-bold">Chinese</span>
          <span class={`text-secondary font-extrabold text-lg`}>+</span> ©{' '}
          {new Date().getFullYear()}
        </div>
        <div class="flex">
          <div class="flex flex-row mr-2">
            <div class="mr-1">{desktopSvg}</div>
            <div>v{import.meta.env.PUBLIC_VERSION}</div>
          </div>
          <div class="flex flex-row">
            <div class="mr-1">{serverStackSvg}</div>
            <div>v{beVersion}</div>
          </div>
        </div>
      </div>
    </footer>
  );
});
