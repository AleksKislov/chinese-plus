import { component$ } from '@builder.io/qwik';
import { useNavigate } from '@builder.io/qwik-city';

import { CardInfo } from './card-info';
import CONSTANTS from '~/misc/consts/consts';
import type { HskLvlSizeMap } from '~/misc/consts/consts';
export const hskInfo = CONSTANTS.hskInfo;

type TabelCardProps = {
  level: string;
  isOldHsk: boolean;
  isForTests: boolean;
};

export const TableCard = component$(({ level, isOldHsk, isForTests }: TabelCardProps) => {
  const nav = useNavigate();
  const infoToUse: HskLvlSizeMap = isOldHsk ? hskInfo.oldLevelSize : hskInfo.bandSize;

  const levels = Object.keys(infoToUse);
  const allWordsNum = levels.map((lvl) => infoToUse[lvl]).reduce((prev, cur) => prev + cur);

  const rmHyphen = (str: string): string => str.replaceAll('-', '');

  return (
    <div class="card bg-primary text-primary-content">
      <div class="card-body">
        <CardInfo isForTests={isForTests} isOldHsk={isOldHsk} />
      </div>

      <div class="overflow-x-auto">
        <table class="table w-full overflow-hidden !rounded-t-none">
          <tbody>
            {levels.map((lvl) => {
              const href = `?lvl=${rmHyphen(lvl)}&pg=0`;
              return (
                <tr
                  key={lvl}
                  class={`hover hover:text-primary-focus cursor-pointer ${
                    level === lvl ? 'bg-base-200 text-primary-focus' : ''
                  }`}
                  onClick$={() => nav(href)}
                >
                  <td class="pl-8">
                    {isOldHsk ? 'HSK ' : 'Band '} {lvl}
                  </td>
                  <td class={`float-right pr-8`}>
                    <span class={`badge bg-warning text-warning-content`}>{infoToUse[lvl]}</span>
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
});
