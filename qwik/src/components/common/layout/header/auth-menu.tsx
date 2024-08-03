import { component$ } from '@builder.io/qwik';
import MenuLink from './menu-link';
import { exitSvg } from '../../media/svg';
import { logout } from '~/misc/actions/auth';

type AuthMenuProps = {
  hskWordsTotal: number;
  wordsTotal: number;
};

export const AuthMenu = component$(({ hskWordsTotal, wordsTotal }: AuthMenuProps) => {
  return (
    <>
      <MenuLink href="/me" text="Личный кабинет" />
      <MenuLink href="/me/avatar" text={`Сменить аватар`} />
      <MenuLink href="/me/hsk/2" text={`Мой словарик HSK`} curVocabSize={hskWordsTotal} />
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
});
