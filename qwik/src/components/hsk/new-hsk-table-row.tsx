import { component$, type Signal } from '@builder.io/qwik';
import CONST_URLS from '~/misc/consts/urls';
import { type NewHskWordType } from '~/routes/hsk/3/table';
import { parseRussian } from '~/misc/helpers/translation';
import { moreInfoSvg, playSvg } from '../common/media/svg';
import { HideBtnsEnum } from './hide-buttons';
import { moreInfoModalId } from '../common/tooltips/word-tooltip';

type NewHskTableRowType = {
  word: NewHskWordType;
  hideBtnsSig: Signal<string[]>;
  currentWord: Signal<NewHskWordType | undefined>;
  isLegacyBand?: boolean;
};

// old (2021) list: mp3 named by lvl/id; 2025 list: explicit path, absent if there is no audio yet
export const getHskAudioPath = (word: NewHskWordType, isLegacyBand = false) =>
  isLegacyBand ? `newhsk/band${word.lvl}/${word.id}.mp3` : word.audio;

export const pronounce = (audioPath: string) => {
  new Audio(`${CONST_URLS.myAudioURL}${audioPath}`).play();
};

export const NewHskTableRow = component$(
  ({ word, hideBtnsSig, currentWord, isLegacyBand }: NewHskTableRowType) => {
    const { cn, py, ru, id } = word;
    const audioPath = getHskAudioPath(word, isLegacyBand);

    return (
      <>
        <tr class={'hover'}>
          <td>{id}</td>
          {!hideBtnsSig.value.includes(HideBtnsEnum.cn) && (
            <td class={'prose'}>
              <h2 class="w-24">{cn}</h2>
            </td>
          )}
          {!hideBtnsSig.value.includes(HideBtnsEnum.py) && (
            <td class={'text-lg'}>
              <div style={{ wordWrap: 'break-word', whiteSpace: 'normal' }}>{py}</div>
            </td>
          )}
          {!hideBtnsSig.value.includes(HideBtnsEnum.ru) && (
            <td>
              <div
                style={{ wordWrap: 'break-word', whiteSpace: 'normal' }}
                dangerouslySetInnerHTML={parseRussian(ru, false)}
              ></div>
            </td>
          )}
          <td>
            {audioPath && (
              <button class="btn btn-sm btn-info" onClick$={() => pronounce(audioPath)}>
                {playSvg}
              </button>
            )}
          </td>
          <td>
            <label
              for={moreInfoModalId}
              class={'btn btn-sm btn-info'}
              onClick$={() => (currentWord.value = word)}
            >
              {moreInfoSvg}
            </label>
          </td>
        </tr>
      </>
    );
  },
);
