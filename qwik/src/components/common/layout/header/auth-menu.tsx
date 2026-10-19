import { component$ } from '@builder.io/qwik';
import MenuLink from './menu-link';
import { exitSvg } from '../../media/svg';
import { logout } from '~/misc/actions/auth';

type AuthMenuProps = {
  hskWordsTotal: number;
  hsk3WordsTotal: number;
  wordsTotal: number;
};

export const AuthMenu = component$(
  ({ hskWordsTotal, hsk3WordsTotal, wordsTotal }: AuthMenuProps) => {
    return (
      <>
        <MenuLink href="/me" text="Личный кабинет" />
        <MenuLink href="/me/hsk/3" text={`Мой словарик HSK 3.0`} curVocabSize={hsk3WordsTotal} />
        <MenuLink href="/me/hsk/2" text={`Мой словарик HSK 2.0`} curVocabSize={hskWordsTotal} />
        <MenuLink href="/me/words" text={`Мой словарик`} curVocabSize={wordsTotal} />
        <MenuLink href="/me/marked" text={`Закладки`} />
        <MenuLink href="/create" text="Поделиться контентом" />

        <hr class="h-px my-1 bg-primary border-0" />
        <li>
          <a
            onClick$={() => {
              logout();
              location.reload();
            }}
          >
            Выйти {exitSvg}
          </a>
        </li>
      </>
    );
  },
);
