import { $, component$, useContext, useSignal, type Signal } from '@builder.io/qwik';
import CONST_URLS from '~/misc/consts/urls';
import CONSTANTS from '~/misc/consts/consts';
import { type NewHskWordType } from '~/routes/hsk/3/table/[...lvl]';
import { parseRussian } from '~/misc/helpers/translation';
import { AlertColorEnum, alertsContext, userContext } from '~/root';
import { useAddUserHsk3Word } from '~/misc/actions/user-hsk3-words/add-word';
import { useRemoveUserHsk3Word } from '~/misc/actions/user-hsk3-words/remove-word';
import { minusSvg, moreInfoSvg, plusSvg, playSvg } from '../common/media/svg';
import { HideBtnsEnum } from './hide-buttons';
import { moreInfoModalId } from '../common/tooltips/word-tooltip';

type NewHskTableRowType = {
  word: NewHskWordType;
  hideBtnsSig: Signal<string[]>;
  currentWord: Signal<NewHskWordType | undefined>;
  isLegacyBand?: boolean;
  // undefined -> no add/remove button (old 2021 list: it isn't in the user's HSK 3.0 list)
  userSelected?: boolean;
  isPrivate?: boolean;
};

// old (2021) list: mp3 named by lvl/id; 2026 list: explicit path, absent if there is no audio yet
export const getHskAudioPath = (word: NewHskWordType, isLegacyBand = false) =>
  isLegacyBand ? `newhsk/band${word.lvl}/${word.id}.mp3` : word.audio;

export const pronounce = (audioPath: string) => {
  new Audio(`${CONST_URLS.myAudioURL}${audioPath}`).play();
};

export const NewHskTableRow = component$(
  ({
    word,
    hideBtnsSig,
    currentWord,
    isLegacyBand,
    userSelected: userClicked,
    isPrivate,
  }: NewHskTableRowType) => {
    const { cn, py, ru, id } = word;
    const audioPath = getHskAudioPath(word, isLegacyBand);
    const hasUserBtn = userClicked !== undefined;

    const userState = useContext(userContext);
    const alertsState = useContext(alertsContext);
    const addUserHsk3Word = useAddUserHsk3Word();
    const removeUserHsk3Word = useRemoveUserHsk3Word();
    const userSelectedSignal = useSignal(!!userClicked);
    const isBusy = useSignal(false);
    const rowBg = userSelectedSignal.value && !isPrivate ? 'bg-base-300' : '';

    // the request runs on the FE server (globalAction$); the header count comes back with
    // the re-run layout loaders
    const addOrRemoveHsk3Word = $(async () => {
      if (!userState.loggedIn) {
        return alertsState.push({ bg: AlertColorEnum.error, text: 'Нужно войти' });
      }
      if (isBusy.value) return;

      const isRemoving = userSelectedSignal.value;
      if (!isRemoving && userState.hsk3WordsTotal >= CONSTANTS.users.vocabSize) {
        return alertsState.push({
          bg: AlertColorEnum.error,
          text: `Лимит ${CONSTANTS.users.vocabSize} слов!`,
        });
      }

      isBusy.value = true;
      userSelectedSignal.value = !isRemoving;
      const action = isRemoving ? removeUserHsk3Word : addUserHsk3Word;
      const { value } = await action.submit({ wordId: word._id });
      isBusy.value = false;

      if (!value) {
        userSelectedSignal.value = isRemoving;
        return alertsState.push({
          bg: AlertColorEnum.error,
          text: 'Не удалось сохранить. Попробуйте снова.',
        });
      }

      alertsState.push(
        isRemoving
          ? { bg: AlertColorEnum.info, text: 'Слово удалено из вашего словарика HSK 3.0' }
          : { bg: AlertColorEnum.success, text: 'Слово добавлено в ваш словарик HSK 3.0' },
      );
    });

    return (
      <>
        <tr class={'hover'}>
          <td class={rowBg}>{id}</td>
          {!hideBtnsSig.value.includes(HideBtnsEnum.cn) && (
            <td class={`prose ${rowBg}`}>
              <h2 class="w-24">{cn}</h2>
            </td>
          )}
          {!hideBtnsSig.value.includes(HideBtnsEnum.py) && (
            <td class={`text-lg ${rowBg}`}>
              <div style={{ wordWrap: 'break-word', whiteSpace: 'normal' }}>{py}</div>
            </td>
          )}
          {!hideBtnsSig.value.includes(HideBtnsEnum.ru) && (
            <td class={rowBg}>
              <div
                style={{ wordWrap: 'break-word', whiteSpace: 'normal' }}
                dangerouslySetInnerHTML={parseRussian(ru, false)}
              ></div>
            </td>
          )}
          <td class={rowBg}>
            {audioPath && (
              <button class="btn btn-sm btn-info" onClick$={() => pronounce(audioPath)}>
                {playSvg}
              </button>
            )}
          </td>
          <td class={rowBg}>
            <label
              for={moreInfoModalId}
              class={'btn btn-sm btn-info'}
              onClick$={() => (currentWord.value = word)}
            >
              {moreInfoSvg}
            </label>
          </td>
          {hasUserBtn && (
            <td class={rowBg}>
              {userSelectedSignal.value ? (
                <button
                  class="btn btn-sm btn-warning"
                  disabled={isBusy.value}
                  onClick$={addOrRemoveHsk3Word}
                >
                  {minusSvg}
                </button>
              ) : (
                <button
                  class="btn btn-sm btn-info"
                  disabled={isBusy.value}
                  onClick$={addOrRemoveHsk3Word}
                >
                  {plusSvg}
                </button>
              )}
            </td>
          )}
        </tr>
      </>
    );
  },
);
