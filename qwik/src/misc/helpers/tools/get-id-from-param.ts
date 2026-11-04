// Route params for content pages may be "some-seo-slug-<id>" or a bare "<id>"; the real id is always the last segment.
export const getIdFromParam = (param: string): string => param.split('-').at(-1) as string;
