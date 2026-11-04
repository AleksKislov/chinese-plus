import type { RequestEvent } from '@builder.io/qwik-city';

// grammar moved to /hsk/grammar
export const onGet = async ({ redirect, params }: RequestEvent) => {
  throw redirect(301, `/hsk/grammar/${params.slug}/`);
};
