import { type Signal, component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import CONSTANTS from "~/misc/consts/consts";

type TabelCardProps = {
  lvlSignal: Signal<string>;
  lvlWordsNumMap: { [key: string]: number };
};

export const PrivateHskCard = component$(({ lvlSignal, lvlWordsNumMap }: TabelCardProps) => {
  const hskLevels = Object.keys(lvlWordsNumMap);

  return (
    <div class='card bg-primary text-primary-content'>
      <div class='card-body'>
        <p class='card-title'>Лексика для повторения</p>
        <p>
          Добавляйте сюда любые слова из списков{" "}
          <Link class='link link-hover bg-secondary' href='/hsk/2/table'>
            HSK 2.0
          </Link>
          , чтобы повторить их отдельно.
        </p>
      </div>

      <div class='overflow-x-auto'>
        <table class='table w-full overflow-hidden !rounded-t-none'>
          <tbody>
            {hskLevels.map((lvl) => (
              <tr
                key={lvl}
                class={`hover hover:text-primary-focus cursor-pointer ${
                  lvlSignal.value === lvl ? "bg-base-200 text-primary-focus" : ""
                }`}
                onClick$={() => {
                  lvlSignal.value = lvl;
                }}
              >
                <td class='pl-8'>{lvl === "total" ? "Всего слов" : `HSK ${lvl}`}</td>
                <td class='float-right pr-8'>
                  <span class='badge bg-warning text-warning-content'>
                    {lvlWordsNumMap[lvl]}
                    {lvl === "total" ? ` / ${CONSTANTS.users.vocabSize}` : ""}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});
