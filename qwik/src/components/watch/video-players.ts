import CONST_URLS from '~/misc/consts/urls';
import { getRutubeEmbedUrl } from '~/misc/helpers/content/rutube';

// same numbers as YouTube's YT.PlayerState
export enum PlayerState {
  ended = 0,
  playing = 1,
  paused = 2,
  buffering = 3,
  videoCued = 5,
}

export type VideoPlayerType = 'youtube' | 'rutube';
export const VIDEO_PLAYER_COOKIE = 'videoPlayer';

// what the video page needs from a player to sync subtitles
export type VideoPlayerApi = {
  getCurrentTime: () => number;
  getPlayerState: () => PlayerState;
  play: () => void;
  pause: () => void;
  destroy: () => void;
};

// Players are mounted into an element Qwik doesn't render children for: YouTube replaces
// its target node with an iframe, which Qwik's vdom must not know about.
// Each player gets its own wrapper and removes only that, so a late cleanup of one player
// (e.g. YouTube finishing loading after the user switched) can't wipe the other.
const createPlayerWrapper = (container: HTMLElement) => {
  const wrapper = document.createElement('div');
  wrapper.style.width = '100%';
  wrapper.style.height = '100%';
  container.appendChild(wrapper);
  return wrapper;
};

export const mountYoutubePlayer = async (container: HTMLElement, videoId: string) => {
  // youtube-iframe touches `window` on import, so it must never be loaded during SSR
  // (this module is also imported by SSR code for PlayerState and the cookie name)
  const ytModule = await import('youtube-iframe');
  const YTframeLoader = (ytModule as any).default ?? ytModule;

  return new Promise<VideoPlayerApi>((resolve) => {
    YTframeLoader.load((YT: any) => {
      const wrapper = createPlayerWrapper(container);
      const target = document.createElement('div');
      wrapper.appendChild(target);
      const player = new YT.Player(target, {
        videoId,
        width: '100%',
        height: '100%',
        playerVars: { origin: CONST_URLS.siteUrl },
      });

      // methods appear only once the player is ready, hence the optional calls
      resolve({
        getCurrentTime: () => player.getCurrentTime?.() || 0,
        getPlayerState: () => player.getPlayerState?.() ?? PlayerState.ended,
        play: () => player.playVideo?.(),
        pause: () => player.pauseVideo?.(),
        destroy: () => {
          player.destroy?.();
          wrapper.remove();
        },
      });
    });
  });
};

const RUTUBE_ORIGIN = 'https://rutube.ru';

const RUTUBE_STATES: Record<string, PlayerState> = {
  playing: PlayerState.playing,
  pause: PlayerState.paused,
  buffering: PlayerState.buffering,
  completed: PlayerState.ended,
};

// Rutube reports time through postMessage events, not on request, and not every frame;
// between events the time is extrapolated so word highlighting stays smooth
const MAX_EXTRAPOLATION_SEC = 1.5;

// Rutube embed API (postMessage, JSON strings): https://github.com/evikza/Rutube-Player-JS-API-Doc
export const mountRutubePlayer = (container: HTMLElement, videoId: string): VideoPlayerApi => {
  const iframe = document.createElement('iframe');
  iframe.src = getRutubeEmbedUrl(videoId);
  iframe.width = '100%';
  iframe.height = '100%';
  iframe.style.border = '0';
  iframe.allow = 'clipboard-write; autoplay; fullscreen; encrypted-media; picture-in-picture';
  iframe.allowFullscreen = true;
  const wrapper = createPlayerWrapper(container);
  wrapper.appendChild(iframe);

  let state = PlayerState.ended;
  let lastTime = 0;
  let lastTimeAt = performance.now();

  const onMessage = (event: MessageEvent) => {
    if (event.source !== iframe.contentWindow || event.origin !== RUTUBE_ORIGIN) return;

    let message: { type?: string; data?: Record<string, any> };
    try {
      message = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
    } catch {
      return;
    }

    if (message?.type === 'player:currentTime') {
      const time = Number(message.data?.time ?? message.data?.currentTime);
      if (Number.isFinite(time)) {
        lastTime = time;
        lastTimeAt = performance.now();
      }
    }

    if (message?.type === 'player:changeState') {
      const newState = RUTUBE_STATES[message.data?.state];
      if (newState !== undefined) {
        lastTime = getCurrentTime();
        lastTimeAt = performance.now();
        state = newState;
      }
    }
  };

  const getCurrentTime = () => {
    if (state !== PlayerState.playing) return lastTime;
    const elapsed = (performance.now() - lastTimeAt) / 1000;
    return lastTime + Math.min(elapsed, MAX_EXTRAPOLATION_SEC);
  };

  const send = (type: string, data: Record<string, unknown> = {}) => {
    iframe.contentWindow?.postMessage(JSON.stringify({ type, data }), RUTUBE_ORIGIN);
  };

  window.addEventListener('message', onMessage);

  return {
    getCurrentTime,
    getPlayerState: () => state,
    play: () => send('player:play'),
    pause: () => send('player:pause'),
    destroy: () => {
      window.removeEventListener('message', onMessage);
      wrapper.remove();
    },
  };
};
