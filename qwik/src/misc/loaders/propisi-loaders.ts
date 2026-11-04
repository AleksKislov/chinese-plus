import { type RequestHandler, routeLoader$ } from '@builder.io/qwik-city';
import { ApiService } from '~/misc/actions/request';
import {
  type SheetChar,
  type SheetData,
  PART_SIZE,
  parseHskParams,
  parseSource,
} from '~/components/propisi/types';

// shared by /propisi/ and /propisi/[version]/[level]/ - each route re-exports it
// eslint-disable-next-line qwik/loader-location
export const useSheetData = routeLoader$(async ({ url, params }): Promise<SheetData> => {
  const source = parseSource(url.searchParams, params);
  if (source.kind === 'hsk') {
    const all: SheetChar[] = await ApiService.get(
      `/api/writing-sheets/hsk?version=${source.version}&level=${source.level}`,
      undefined,
      [],
    );
    const start = (source.part - 1) * PART_SIZE;
    const parts = Array.from({ length: Math.ceil(all.length / PART_SIZE) }, (_, i) =>
      all
        .slice(i * PART_SIZE, i * PART_SIZE + PART_SIZE)
        .map((x) => x.ch)
        .join(''),
    );
    return { chars: all.slice(start, start + PART_SIZE), total: all.length, parts };
  }

  const chars: SheetChar[] = await ApiService.get(
    `/api/writing-sheets/chars?chars=${encodeURIComponent(source.chars)}`,
    undefined,
    [],
  );
  return { chars, total: chars.length, parts: [] };
});

export const hskSheetOnGet: RequestHandler = ({ params, error }) => {
  if (!parseHskParams(params)) throw error(404, 'Not found');
};
