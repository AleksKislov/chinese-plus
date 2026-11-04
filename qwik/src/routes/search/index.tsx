import { type RequestHandler } from '@builder.io/qwik-city';

// Legacy URL shim: the dictionary now lives at /dictionary (landing) and /dictionary/{word}
// (individual entries). Old bookmarked/indexed /search and /search?q= links land here and
// get permanently redirected so no inbound link or search-engine index entry breaks.
export const onGet: RequestHandler = ({ query, redirect }) => {
  const q = query.get('q');
  throw redirect(301, q ? '/dictionary/' + encodeURIComponent(q) : '/dictionary');
};
