import { $, component$, useContext, useSignal } from '@builder.io/qwik';
import { Link, useLocation } from '@builder.io/qwik-city';

import { alertsContext, userContext } from '~/root';
import { loginUrl } from '~/misc/helpers/login-next';
import { useAddUserWord } from './own-word-btn';
import CONSTANTS from '~/misc/consts/consts';

/**
 * `?add=1` on a dictionary page: "add to my words" from the browser extension (or any link).
 * Asks before adding, so a link on another site can't fill the user's words unnoticed.
 * Not logged in: the route's onGet already sent the user to /login?next=<this page>.
 */
export const ADD_WORD_PARAM = 'add';

export const OwnWordRequest = component$(({ words }: { words: (string | DictWord)[] }) => {
  const loc = useLocation();
  const userState = useContext(userContext);
  const alertsState = useContext(alertsContext);
  const addUserWord = useAddUserWord();
  const done = useSignal(false);

  if (done.value || loc.url.searchParams.get(ADD_WORD_PARAM) !== '1') return null;

  // this page, without ?add=1 (a reload or a shared link doesn't ask again)
  const close = $(() => {
    done.value = true;
    const url = new URL(location.href);
    url.searchParams.delete(ADD_WORD_PARAM);
    history.replaceState(history.state, '', url.pathname + url.search + url.hash);
  });

  const word = words.length === 1 ? words[0] : null;
  if (!word || typeof word === 'string') {
    return (
      <div class="alert mt-3 not-prose">
        <span>
          {words.some((w) => typeof w !== 'string')
            ? 'Чтобы добавить слово в словарик, нажмите «+» у нужного слова в списке ниже.'
            : 'Этого слова нет в словаре сайта.'}
        </span>
      </div>
    );
  }

  // an expired token: onGet saw the cookie, the user loader didn't accept it
  if (!userState.loggedIn) {
    return (
      <div class="alert mt-3 not-prose">
        <span>Чтобы добавить {word.chinese} в ваш словарик, войдите на сайт.</span>
        <Link href={loginUrl(loc.url.pathname + loc.url.search)} class="btn btn-sm btn-info">
          Войти
        </Link>
      </div>
    );
  }

  if (userState.wordsMap[word.chinese]) {
    return (
      <div class="alert alert-success mt-3 not-prose">
        <span>{word.chinese} уже в вашем словарике.</span>
        <button type="button" class="btn btn-sm btn-ghost" onClick$={close}>
          ✕
        </button>
      </div>
    );
  }

  // the list is full: the backend would refuse it (POST api/userwords)
  if (userState.wordsCount >= CONSTANTS.users.vocabSize) {
    return (
      <div class="alert alert-warning mt-3 not-prose">
        <span>
          В словарике уже {CONSTANTS.users.vocabSize} слов — это максимум. Чтобы добавить{' '}
          {word.chinese}, удалите лишние в{' '}
          <Link prefetch="js" href="/me/words" class="link">
            «Мой словарик»
          </Link>
          .
        </span>
        <button type="button" class="btn btn-sm btn-ghost" onClick$={close}>
          ✕
        </button>
      </div>
    );
  }

  return (
    <div class="alert alert-info mt-3 not-prose">
      <span>
        Добавить <b>{word.chinese}</b> в ваш словарик?
      </span>
      <div class="flex gap-2">
        <button
          type="button"
          class="btn btn-sm btn-primary"
          onClick$={() => {
            // a server action (globalAction$), never a request from the browser
            addUserWord.submit({ wordId: word._id });
            userState.wordsMap[word.chinese] = true;
            userState.wordsCount += 1;
            alertsState.push({ bg: 'alert-success', text: 'Слово добавлено в ваш словарик' });
            close();
          }}
        >
          Добавить
        </button>
        <button type="button" class="btn btn-sm btn-ghost" onClick$={close}>
          Не нужно
        </button>
      </div>
    </div>
  );
});
