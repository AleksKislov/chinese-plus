import { component$, type Signal, useContext, useSignal } from '@builder.io/qwik';
import { playSvg } from '../common/media/svg';
import { WordTooltip } from '../common/tooltips/word-tooltip';
import CONST_URLS from '~/misc/consts/urls';
import { userContext } from '~/root';
import { useDeleteGrammarAudio } from '~/misc/actions/grammar/delete-audio';
import { type GrammarExample as GrammarExampleType } from './types';

export const playGrammarAudio = (audio: string) => {
  new Audio(`${CONST_URLS.myAudioURL}${audio}`).play();
};

type GrammarExampleProps = {
  example: GrammarExampleType;
  currentWord: Signal<DictWord | null>;
};

export const GrammarExample = component$(({ example, currentWord }: GrammarExampleProps) => {
  const { segments, cn, py, ru, audio } = example;
  const { isAdmin } = useContext(userContext);
  const deleteAudio = useDeleteGrammarAudio();
  const deleted = useSignal(false);

  return (
    <div class="flex flex-row gap-3 py-2">
      <div class="flex-1">
        <div class="text-xl mb-1">
          {(segments?.length ? segments : [cn]).map((word, i) => (
            <WordTooltip key={i} word={word} currentWord={currentWord} hasReddened={undefined} />
          ))}
        </div>
        <p class="text-lg italic opacity-80">{py}</p>
        <p class="text-base">{ru}</p>
      </div>
      {audio && !deleted.value && (
        <div class="flex flex-col gap-1">
          <button
            type="button"
            class="btn btn-info btn-outline btn-sm"
            aria-label="Прослушать"
            onClick$={() => playGrammarAudio(audio)}
          >
            {playSvg}
          </button>
          {isAdmin && (
            // removes the mp3 from the bucket and the DB; the audio script records it again
            <button
              type="button"
              class="btn btn-error btn-outline btn-xs"
              disabled={deleteAudio.isRunning}
              onClick$={async () => {
                if (!confirm(`Удалить аудио «${cn}»?`)) return;
                const { value } = await deleteAudio.submit({ file: audio.split('/').pop()! });
                if (value?.status === 'done') deleted.value = true;
              }}
            >
              DEL
            </button>
          )}
        </div>
      )}
    </div>
  );
});
