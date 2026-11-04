import { component$, useContext, useSignal } from '@builder.io/qwik';
import { userContext } from '~/root';
import { useSetLessonRutube } from '~/misc/actions/videos/set-lesson-rutube';
import {
  getRutubeEmbedUrl,
  getRutubeId,
  getRutubeVideoUrl,
} from '~/misc/helpers/content/rutube';
import { PlayerSwitch } from './player-switch';
import { type VideoPlayerType } from './video-players';

type LessonVideoPlayerProps = {
  lessonId: ObjectId;
  source: string; // youtube id
  rutubeSource?: string;
  playerChoice: VideoPlayerType | null;
};

// Video lessons have no subtitles, so the player is a plain embed (no player API needed)
export const LessonVideoPlayer = component$(
  ({ lessonId, source, rutubeSource, playerChoice }: LessonVideoPlayerProps) => {
    const { isAdmin } = useContext(userContext);
    const rutubeId = useSignal(rutubeSource || '');
    const playerType = useSignal<VideoPlayerType>(
      rutubeSource && playerChoice !== 'youtube' ? 'rutube' : 'youtube',
    );

    const setRutube = useSetLessonRutube();
    const rutubeUrl = useSignal(rutubeSource ? getRutubeVideoUrl(rutubeSource) : '');
    const isRutubeUrlInvalid = !!rutubeUrl.value.trim() && !getRutubeId(rutubeUrl.value);
    const showRutube = !!rutubeId.value && playerType.value === 'rutube';

    return (
      <>
        {rutubeId.value && <PlayerSwitch playerType={playerType} />}

        <div class="aspect-w-16 aspect-h-9 mb-3">
          {showRutube ? (
            <iframe
              key="rutube"
              class="rounded-lg shadow-lg"
              width="560"
              height="315"
              src={getRutubeEmbedUrl(rutubeId.value)}
              title="Rutube video player"
              allow="clipboard-write; autoplay; fullscreen; encrypted-media; picture-in-picture"
              allowFullscreen
            ></iframe>
          ) : (
            <iframe
              key="youtube"
              class="rounded-lg shadow-lg"
              width="560"
              height="315"
              src={`https://www.youtube.com/embed/${source}?controls=0`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            ></iframe>
          )}
        </div>

        {isAdmin && (
          <div class="form-control w-full mb-4">
            <label class="label">
              <span class="label-text">Для админа: ссылка на этот же урок на Rutube</span>
            </label>
            <div class="join w-full">
              <input
                type="text"
                placeholder="https://rutube.ru/video/... (пусто — без Rutube)"
                class={`input input-bordered input-sm join-item w-full ${
                  isRutubeUrlInvalid ? 'input-error' : ''
                }`}
                value={rutubeUrl.value}
                onInput$={(e) => (rutubeUrl.value = (e.target as HTMLInputElement).value)}
              />
              <button
                class="btn btn-sm btn-primary join-item"
                disabled={isRutubeUrlInvalid || setRutube.isRunning}
                onClick$={async () => {
                  const { value } = await setRutube.submit({ lessonId, rutubeUrl: rutubeUrl.value });
                  if (value && 'rutubeSource' in value && value.rutubeSource !== undefined) {
                    rutubeId.value = value.rutubeSource;
                  }
                }}
              >
                Сохранить
              </button>
            </div>
            {setRutube.value === null && (
              <label class="label">
                <span class="label-text-alt text-error">Не удалось сохранить</span>
              </label>
            )}
          </div>
        )}
      </>
    );
  },
);
