import { component$, useVisibleTask$, $, useStore } from '@builder.io/qwik';
import { playSvg, rewindSvg } from '~/components/common/media/svg';
import { allPinyinSounds } from '~/misc/consts/pinyin';
import CONST_URLS from '~/misc/consts/urls';
import { getRandElem } from '~/misc/helpers/tools';

type AnswersObj = {
  [key: string]: string;
};

type StoreAns = {
  sounds: string[];
  inputs: AnswersObj;
};

const separator = '_';
export const columns = [1, 2, 3];
export const answers = [1, 2, 3, 4]; // 4 per column
const answersNum = columns.length * answers.length;

function getRandAnswers(tones?: string[]): string[] {
  const sounds: string[] = [];
  while (sounds.length < answersNum) {
    const randSound = getRandElem(allPinyinSounds);
    if (typeof randSound !== 'string' || sounds.includes(randSound)) continue;
    if (Array.isArray(tones) && !tones.includes(randSound?.charAt(randSound?.length - 1))) {
      continue;
    }

    sounds.push(randSound);
  }
  return sounds;
}

export const playAudio = (target: string) => {
  new Audio(`${CONST_URLS.myAudioURL}pinyin/${target}.mp3`).play();
};

export function init(store: StoreAns, tones?: string[]) {
  const randSounds = getRandAnswers(tones);
  store.sounds = randSounds;
  store.inputs = setEmptyAnswers(randSounds);
  setTimeout(() => {
    for (let i = 0; i < randSounds.length; i++) {
      const ansBtn = document.getElementById(randSounds[i]);
      ansBtn?.classList.remove('bg-success', 'bg-error', 'bg-warning');
      const userInput = document.getElementById(getInputId(randSounds[i])) as HTMLInputElement;
      if (userInput) userInput.value = '';
    }
  }, 300);
}

export function getInputId(sound: string): string {
  return `${separator}${sound}`;
}

export function setEmptyAnswers(answers: string[]): AnswersObj {
  const ansObj: AnswersObj = {};
  answers.forEach((sound) => {
    ansObj[getInputId(sound)] = '';
  });
  return ansObj;
}

export const PinyinTests = component$(({ tones }: { tones?: string[] }) => {
  const store = useStore<StoreAns>({ sounds: [''], inputs: {} });

  useVisibleTask$(() => {
    init(store, tones);
  });

  const checkAnswers = $(() => {
    for (let i = 0; i < store.sounds.length; i++) {
      const answer = store.sounds[i];
      const userInput = store.inputs[getInputId(answer)].toLowerCase().trim();
      const ansBtn = document.getElementById(answer);
      ansBtn?.classList.add(userInput === answer ? 'bg-success' : 'bg-error');
    }
  });

  const showAnswers = $(() => {
    for (let i = 0; i < store.sounds.length; i++) {
      const ans = store.sounds[i];
      const ansBtn = document.getElementById(ans);
      ansBtn?.classList.remove('bg-success', 'bg-error');
      ansBtn?.classList.add('bg-warning');
      const userInput = document.getElementById(getInputId(ans)) as HTMLInputElement;
      if (userInput) userInput.value = ans;
    }
  });

  const receiveAnswer = $((e: Event) => {
    const target = e.target as HTMLTextAreaElement;
    store.inputs = { ...store.inputs, [target!.id]: target!.value };
  });

  const buttons = [
    {
      func: checkAnswers,
      txt: 'Проверить',
    },
    {
      func: showAnswers,
      txt: 'Показать Ответы',
    },
    {
      func: $(() => init(store, tones)),
      txt: rewindSvg,
    },
  ];

  return (
    <>
      <div class="prose mb-1 mt-3">
        <h4>{tones ? `Только ${tones.join(' и ')}` : 'Все'} тоны</h4>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {columns.map((col, k) => (
          <div class="w-full" key={col}>
            {answers.map((_quest, i) => (
              <div class="form-control my-2 pr-2" key={i}>
                <label class="input-group">
                  <button
                    class="btn btn-info"
                    id={store.sounds[i + answers.length * k]}
                    type="button"
                    onClick$={() => playAudio(store.sounds[i + answers.length * k])}
                  >
                    {playSvg}
                  </button>
                  <input
                    type="text"
                    placeholder="..."
                    class="input input-bordered w-full"
                    id={getInputId(store.sounds[i + answers.length * k])}
                    onInput$={receiveAnswer}
                  />
                </label>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div class="flex">
        {buttons.map(({ func, txt }, ind) => (
          <button type="button" class="btn btn-primary btn-sm mr-1" key={ind} onClick$={func}>
            {txt}
          </button>
        ))}
      </div>
    </>
  );
});
