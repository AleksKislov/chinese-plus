import { component$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import {
  academicCapExtraBigSvg,
  bookExtraBigSvg,
  listExtraBigSvg,
  extraBigSearchSvg,
} from '~/components/common/media/svg';

const steps = [
  {
    href: '/dictionary',
    title: 'Словарь',
    desc: 'Поис: иероглифы, пиньинь, ручной ввод — с анимацией написания черт.',
    icon: extraBigSearchSvg,
  },
  {
    href: '/hsk/2/table',
    title: 'Лексика HSK',
    desc: 'Базовые слова HSK с переводом и озвучкой — от простого к сложному.',
    icon: listExtraBigSvg,
  },
  {
    href: '/read/texts',
    title: 'Тексты с переводом',
    desc: 'Читайте тексты на китайском с переводом и разбором каждого слова.',
    icon: bookExtraBigSvg,
  },
  {
    href: '/start/how-to-start',
    title: 'С чего начать',
    desc: 'Пошаговый план для тех, кто только начинает учить китайский.',
    icon: academicCapExtraBigSvg,
  },
];

// Onward links for standalone reference pages (pinyin chart, radicals, etc.) that draw a lot of
// first-time search traffic with no other context about the rest of the site.
export const NextStepsCards = component$(() => {
  return (
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 my-4">
      {steps.map((step, ind) => (
        <Link
          key={ind}
          href={step.href}
          class="card bg-base-300 hover:bg-base-200 transition-colors"
        >
          <div class="card-body items-center text-center p-4">
            <div class="text-secondary">{step.icon}</div>
            <h2 class="card-title text-base">{step.title}</h2>
            <p class="text-sm opacity-80">{step.desc}</p>
          </div>
        </Link>
      ))}
    </div>
  );
});
