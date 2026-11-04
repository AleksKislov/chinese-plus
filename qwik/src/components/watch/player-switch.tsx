import { component$, type Signal } from '@builder.io/qwik';
import Cookies from 'js-cookie';
import { VIDEO_PLAYER_COOKIE, type VideoPlayerType } from './video-players';

type PlayerSwitchProps = {
  playerType: Signal<VideoPlayerType>;
};

// Rutube | YouTube toggle; the choice is remembered for all videos and lessons
export const PlayerSwitch = component$(({ playerType }: PlayerSwitchProps) => {
  return (
    <div class="join mb-2">
      {(['rutube', 'youtube'] as const).map((type) => (
        <button
          key={type}
          class={`btn btn-sm join-item ${playerType.value === type ? 'btn-primary' : ''}`}
          onClick$={() => {
            playerType.value = type;
            Cookies.set(VIDEO_PLAYER_COOKIE, type, { expires: 365 });
          }}
        >
          {type === 'rutube' ? 'Rutube' : 'YouTube'}
        </button>
      ))}
    </div>
  );
});
