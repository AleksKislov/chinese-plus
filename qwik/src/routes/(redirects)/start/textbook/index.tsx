import type { RequestEvent } from '@builder.io/qwik-city';
import { GRAMMAR_LEVELS, grammarHubUrl, grammarLevelUrl } from '~/components/grammar/types';

// grammar moved to /hsk/grammar; old ?lvl= links go straight to the level's own page
export const onGet = async ({ redirect, query }: RequestEvent) => {
  const lvl = query.get('lvl');
  throw redirect(301, lvl && GRAMMAR_LEVELS.includes(lvl) ? grammarLevelUrl(lvl) : grammarHubUrl);
};
