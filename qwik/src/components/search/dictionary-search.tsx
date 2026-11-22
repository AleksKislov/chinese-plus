import { $, component$, Slot, useContext, useSignal, useTask$ } from '@builder.io/qwik';
import { useLocation, useNavigate } from '@builder.io/qwik-city';
import { searchSvg } from '~/components/common/media/svg';
import { Loader } from '~/components/common/ui/loader';
import { HandwritingInput } from '~/components/search/handwriting-input';
import { alertsContext } from '~/root';
import {
  isChinese,
  isPinyin,
  isRussian,
  isValidWildcardPattern,
  isWildcardPattern,
  WILDCARD_CHAR,
  WILDCARD_MAX_LENGTH,
} from './dictionary-query';

type Props = {
  // pre-filled query, e.g. the current word on /dictionary/{word}
  value?: string;
  placeholder?: string;
  class?: string;
};

// Dictionary search box: input + wildcard hint + handwriting input.
// Submitting goes to /dictionary/{query}. Extra links can be passed as children.
export const DictionarySearch = component$((props: Props) => {
  const loc = useLocation();
  const nav = useNavigate();
  const alertsState = useContext(alertsContext);
  const input = useSignal(props.value || '');
  const showHandwriting = useSignal(false);

  useTask$(({ track }) => {
    input.value = track(() => props.value) || '';
  });

  const goToWord = $(() => {
    let inputStr = input.value.trim();
    if (!inputStr) return (input.value = '');

    if (isRussian(inputStr)) {
      inputStr = inputStr.toLowerCase();
      input.value = inputStr;
    }

    if (isWildcardPattern(inputStr) && !isValidWildcardPattern(inputStr)) {
      alertsState.push({
        bg: 'alert-error',
        text: `Шаблон должен содержать от 1 до ${WILDCARD_MAX_LENGTH} китайских иероглифов, "${WILDCARD_CHAR}" заменяет один неизвестный символ`,
      });
      return;
    }

    if (
      isWildcardPattern(inputStr) ||
      isChinese(inputStr) ||
      isRussian(inputStr) ||
      isPinyin(inputStr)
    ) {
      nav('/dictionary/' + encodeURIComponent(inputStr));
    } else {
      alertsState.push({
        bg: 'alert-error',
        text: 'Поиск только по китайским, русским словам или пиньинь',
      });
    }
  });

  return (
    <div class={['form-control', props.class]}>
      <form class="input-group w-full" preventdefault:submit onSubmit$={goToWord}>
        <input
          type="text"
          placeholder={props.placeholder || 'Поиск: 汉字 | 漢字 | hanzi | *字 | слово'}
          aria-label="Поиск в китайско-русском словаре"
          class="input input-bordered w-full"
          value={input.value}
          onInput$={(e) => (input.value = (e.target as HTMLInputElement)?.value || '')}
        />
        <button type="submit" class="btn btn-square" disabled={loc.isNavigating}>
          {loc.isNavigating ? <Loader size="sm" /> : searchSvg}
        </button>
      </form>
      <span class="text-sm opacity-60 mt-1 text-left">
        Звездочка вместо неизвестного иероглифа, например "爱{WILDCARD_CHAR}"
      </span>

      <button
        type="button"
        class="link link-hover link-secondary text-sm my-2 text-left w-fit"
        onClick$={() => (showHandwriting.value = !showHandwriting.value)}
      >
        {showHandwriting.value ? 'Скрыть ручной ввод' : 'Ручной ввод иероглифов'}
      </button>

      {showHandwriting.value && <HandwritingInput />}

      <Slot />
    </div>
  );
});
