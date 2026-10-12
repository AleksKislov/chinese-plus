import { globalAction$, z, zod$ } from '@builder.io/qwik-city';
import { ApiService } from '../request';
import { type GrammarTopicResponse } from '~/components/grammar/types';

// full topic for a collapsed card on the level page; runs on the FE server, since in
// production PUBLIC_BASE_URL (http://chin_plus_be:…) is not reachable from the browser
export const useGetGrammarTopic = globalAction$(
  async ({ slug }): Promise<GrammarTopicResponse | null> =>
    ApiService.get(`/api/grammar/topic/${slug}`, undefined, null),
  zod$({ slug: z.string().regex(/^[a-z0-9-]+$/) }),
);
