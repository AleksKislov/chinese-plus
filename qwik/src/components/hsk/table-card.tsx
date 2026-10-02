import { component$ } from '@builder.io/qwik';
import { Link, useLocation } from '@builder.io/qwik-city';
import { wordsLevelHref } from './words-seo';

import { CardInfo } from './card-info';
import CONSTANTS from '~/misc/consts/consts';
import type { HskLvlSizeMap } from '~/misc/consts/consts';
export const hskInfo = CONSTANTS.hskInfo;

type TabelCardProps = {
  level: string;
  isOldHsk: boolean;
  isForTests: boolean;
  isLegacyBand?: boolean; // previous (2021) HSK 3.0 list
};

export const TableCard = component$(
  ({ level, isOldHsk, isForTests, isLegacyBand }: TabelCardProps) => {
    const loc = useLocation();
    const infoToUse: HskLvlSizeMap = isOldHsk
      ? hskInfo.oldLevelSize
      : isLegacyBand
      ? hskInfo.bandSizeOld
      : hskInfo.bandSize;

    const levels = Object.keys(infoToUse);
    const allWordsNum = levels.map((lvl) => infoToUse[lvl]).reduce((prev, cur) => prev + cur);

    const rmHyphen = (str: string): string => str.replaceAll('-', '');

    return (
      <div class="card bg-primary text-primary-content">
        <div class="card-body">
          <CardInfo isForTests={isForTests} isOldHsk={isOldHsk} isLegacyBand={isLegacyBand} />
        </div>

        <div class="overflow-x-auto">
          <table class="table w-full overflow-hidden !rounded-t-none">
            <tbody>
              {levels.map((lvl) => {
                // Real links (crawlable) to the level's canonical URL.
                const href = wordsLevelHref(loc.url.pathname, rmHyphen(lvl));
                return (
                  <tr
                    key={lvl}
                    class={`hover hover:text-primary-focus ${
                      level === rmHyphen(lvl) ? 'bg-base-200 text-primary-focus' : ''
                    }`}
                  >
                    <td class="pl-8">
                      <Link prefetch="js" href={href} class="block">
                        {isOldHsk ? 'HSK ' : isLegacyBand ? 'Band ' : 'Уровень '} {lvl}
                      </Link>
                    </td>
                    <td class={`float-right pr-8`}>
                      <Link prefetch="js" href={href} tabIndex={-1} aria-hidden="true">
                        <span class={`badge bg-warning text-warning-content`}>
                          {infoToUse[lvl]}
                        </span>
                      </Link>
                    </td>
                  </tr>
                );
              })}
              <tr>
                <td class="pl-8">Всего слов</td>
                <td class="float-right pr-8">
                  <span class="badge bg-warning text-warning-content">{allWordsNum}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  },
);
