import { component$ } from '@builder.io/qwik';
import { useNavigate } from '@builder.io/qwik-city';

import CONSTANTS from '~/misc/consts/consts';
import { type ShortTextbookType } from '~/routes/start/textbook';
export const hskInfo = CONSTANTS.hskInfo;

type TextbookCardProps = {
  val: ShortTextbookType;
  curLevel: string;
};

export const TextbookCard = component$(({ val, curLevel }: TextbookCardProps) => {
  const nav = useNavigate();

  const levels = Object.keys(val);

  const rmHyphen = (str: string): string => str.replaceAll('-', '');
  return (
    <div class="card bg-primary text-primary-content">
      <div class="card-body">
        <p class="card-title">По уровням HSK v3.0</p>
        <p>
          Грамматика разбита по уровням сложности HSK v3.0, все темы снабжены примерами с переводом
          и озвучкой носителем языка
        </p>
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
                    curLevel === lvl ? 'bg-base-200 text-primary-focus' : ''
                  }`}
                  onClick$={() => nav(href)}
                >
                  <td class="pl-8">Band {lvl}</td>
                  <td class={`float-right pr-8`}>
                    <span class={`badge bg-warning text-warning-content`}>{val[lvl]}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
});
