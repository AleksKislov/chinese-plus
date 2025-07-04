import { component$ } from '@builder.io/qwik';
import { FeatureCard } from './feature-card';
import { Link } from '@builder.io/qwik-city';
import {
  academicCapExtraBigSvg,
  bookExtraBigSvg,
  graphExtraBigSvg,
  listExtraBigSvg,
} from '../common/media/svg';
import { WordTooltip, moreInfoModalId } from '../common/tooltips/word-tooltip';
import { MoreInfoModal } from '../common/modals/more-info-modal';

export const featuresArr = [
  {
    title: 'Всплывающий перевод',
    pic: (
      <span class="text-4xl">
        <WordTooltip
          currentWord={{ value: null }}
          word={{
            chinese: '我',
            _id: '5f04819868566a15a9ff0227',
            pinyin: ' wǒ',
            // previous: [],
            russian:
              ' [m1]1) я; мой[/m][m2][*][ex]我是学生 я ― учащийся[/ex][/*][/m][m2][*][ex]我父亲 мой отец[/ex][/*][/m][m1]2) мы; наш ([i]о коллективе, стране[/i])[/m][m2][*][ex]我方 наша сторона, наши[/ex][/*][/m][m2][*][ex]我军 наша армия[/ex][/*][/m][m2][*][ex]敌我 противник и мы[/ex][/*][/m][m1]3) сам; самоличный, частный, личный[/m][m2][*][ex]自我 сам; собственный[/ex][/*][/m][m2][*][ex]大公无我 всё общественное, нет ничего личного (собственного)[/ex][/*][/m]',
          }}
        />
      </span>
    ),
    desc: (
      <p>
        Все{' '}
        <Link href="/read/texts" class="link link-secondary">
          тексты
        </Link>
        ,{' '}
        <Link href="/read/books" class="link link-secondary">
          книги
        </Link>{' '}
        и{' '}
        <Link href="/watch/videos" class="link link-secondary">
          видео
        </Link>{' '}
        с параллельным переводом и переводом каждого слова. Кликните на{' '}
        <span class="text-secondary">我</span>
      </p>
    ),
  },
  {
    title: 'Делимся текстами и видео',
    pic: bookExtraBigSvg,
    desc: (
      <p>
        Пользователи регулярно добавляют новые{' '}
        <Link href="/read/texts" class="link link-secondary">
          тексты
        </Link>{' '}
        и{' '}
        <Link href="/watch/videos" class="link link-secondary">
          видео
        </Link>
        . Поделитесь и Вы своими переводами
      </p>
    ),
  },
  {
    title: 'Личный вокабуляр',
    pic: listExtraBigSvg,
    desc: (
      <p>
        Любые слова из лексики{' '}
        <Link href="/hsk/2/table" class="link link-secondary">
          HSK
        </Link>
        ,{' '}
        <Link href="/read/texts" class="link link-secondary">
          текстов
        </Link>{' '}
        или{' '}
        <Link href="/search" class="link link-secondary">
          словаря
        </Link>{' '}
        можно добавить в личный вокабуляр и повторять отдельно
      </p>
    ),
  },
  {
    title: 'Ценное для начинающих',
    pic: academicCapExtraBigSvg,
    desc: (
      <p>
        Рекомендации{' '}
        <Link href="/start/how-to-start" class="link link-secondary">
          с чего начать
        </Link>
        , озвучка{' '}
        <Link href="/hsk/2/table" class="link link-secondary">
          HSK
        </Link>
        -лексики и{' '}
        <Link href="/start/pinyin-chart" class="link link-secondary">
          пиньиня
        </Link>{' '}
        (плюс{' '}
        <Link href="/start/pinyin-tests" class="link link-secondary">
          тесты
        </Link>
        ), уроки по{' '}
        <Link href="/watch/phonetics-lessons" class="link link-secondary">
          фонетике
        </Link>{' '}
        и{' '}
        <Link href="/watch/characters-lessons" class="link link-secondary">
          иероглифике
        </Link>
      </p>
    ),
  },
  {
    title: 'Словарь с анимацией',
    pic: <div id="showCharDiv"></div>,

    desc: (
      <p>
        Каждый иероглиф в{' '}
        <Link href="/search" class="link link-secondary">
          словаре
        </Link>{' '}
        снабжен анимированным порядком написания черт иероглифа
      </p>
    ),
  },
  {
    title: 'Дневник чтения',
    pic: graphExtraBigSvg,
    desc: (
      <p>
        Ставьте себе суточные цели, отмечайте сколько иероглифов прочитано, следите за графиком
        "успеваемости"
      </p>
    ),
  },
];

export const Features = component$(() => {
  return (
    <>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        {featuresArr.map((feat, ind) => (
          <FeatureCard key={ind} title={feat.title} ind={ind} />
        ))}
      </div>
      <MoreInfoModal
        word={{
          cn: '我',
          id: 0,
          lvl: '1',
          _id: '5f04819868566a15a9ff0227',
          py: ' wǒ',
          ru: ' [m1]1) я; мой[/m][m2][*][ex]我是学生 я ― учащийся[/ex][/*][/m][m2][*][ex]我父亲 мой отец[/ex][/*][/m][m1]2) мы; наш ([i]о коллективе, стране[/i])[/m][m2][*][ex]我方 наша сторона, наши[/ex][/*][/m][m2][*][ex]我军 наша армия[/ex][/*][/m][m2][*][ex]敌我 противник и мы[/ex][/*][/m][m1]3) сам; самоличный, частный, личный[/m][m2][*][ex]自我 сам; собственный[/ex][/*][/m][m2][*][ex]大公无我 всё общественное, нет ничего личного (собственного)[/ex][/*][/m]',
        }}
        modalId={moreInfoModalId}
      />
    </>
  );
});
