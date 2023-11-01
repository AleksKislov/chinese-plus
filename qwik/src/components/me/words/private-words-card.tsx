import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import CONSTANTS from "~/misc/consts/consts";

type TabelCardProps = {
  wordsTotal: number;
};

export const PrivateWordsCard = component$(({ wordsTotal }: TabelCardProps) => {
  return (
    <div class='card bg-primary text-primary-content'>
      <div class='card-body'>
        <p class='card-title'>Лексика для повторения</p>
        <p>
          Добавляйте сюда любые слова из{" "}
          <Link class='link link-hover bg-secondary' href='/read/texts'>
            текстов
          </Link>{" "}
          или{" "}
          <Link class='link link-hover bg-secondary' href='/search'>
            словаря
          </Link>
          , чтобы повторить их отдельно.
        </p>
      </div>

      <div class='overflow-x-auto mb-3'>
        <table class='table w-full overflow-hidden !rounded-t-none'>
          <tbody>
            <tr class=''>
              <td class='pl-8'>Всего слов</td>
              <td class='float-right pr-8'>
                <span class='badge bg-warning text-warning-content'>
                  {`${wordsTotal} / ${CONSTANTS.users.vocabSize}`}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
});
