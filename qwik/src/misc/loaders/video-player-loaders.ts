import { routeLoader$ } from '@builder.io/qwik-city';
import { VIDEO_PLAYER_COOKIE, type VideoPlayerType } from '~/components/watch/video-players';

// The viewer's last choice between YouTube and Rutube (cookie, so SSR renders the right player).
// Re-exported from the video and video lesson routes, which registers it there.
// eslint-disable-next-line qwik/loader-location
export const useVideoPlayerChoice = routeLoader$(({ cookie }): VideoPlayerType | null => {
  const choice = cookie.get(VIDEO_PLAYER_COOKIE)?.value;
  return choice === 'youtube' || choice === 'rutube' ? choice : null;
});
