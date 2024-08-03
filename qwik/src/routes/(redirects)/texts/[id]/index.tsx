import type { RequestEvent } from '@builder.io/qwik-city';

export const onGet = async ({ redirect, params }: RequestEvent) => {
  throw redirect(301, '/read/texts/' + params.id);
};
