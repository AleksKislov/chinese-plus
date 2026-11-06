import { server$ } from '@builder.io/qwik-city';
import { ApiService } from '../request';
import { type DictTranslationResponse } from '~/components/common/translation/types';

const OBJECT_ID = /^[a-f0-9]{24}$/;

// full parsed translation + examples of a dictionary word, for the "more info" modal; runs on
// the FE server, since in production PUBLIC_BASE_URL (http://chin_plus_be:…) is not reachable
// from the browser. server$, not an action: a submitted action re-runs every route loader of
// the page, and that re-render closes the modal (and costs several backend requests)
export const getWordTranslation = server$(
  async (wordId: string): Promise<DictTranslationResponse | null> => {
    if (!OBJECT_ID.test(wordId)) return null;
    return ApiService.get(`/api/dictionary/translation/${wordId}?examples=true`, undefined, null);
  },
);
