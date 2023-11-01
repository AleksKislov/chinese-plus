import CONSTANTS from "~/misc/consts/consts";
import { academicCapBigSvg, archiveBigSvg, bookBigSvg } from "../common/media/svg";
import { component$ } from "@builder.io/qwik";

type PersonalStatsType = {
  finishedTextsTotal: number;
  approvedTextsNum: number;
  userWordsTotal: number;
  hsk2Total: number;
};

export const PersonalStats = component$(
  ({ finishedTextsTotal, approvedTextsNum, userWordsTotal, hsk2Total }: PersonalStatsType) => {
    return (
      <div class='card'>
        <div class='stats shadow'>
          <div class='stat'>
            <div class='stat-figure text-secondary'>{academicCapBigSvg}</div>
            <div class='stat-title'>Выбрано слов HSK</div>
            <div class='stat-value'>
              {hsk2Total} / {CONSTANTS.users.vocabSize}
            </div>
            <div class='stat-desc'>HSK 2.0</div>
          </div>

          <div class='stat'>
            <div class='stat-figure text-secondary'>{archiveBigSvg}</div>
            <div class='stat-title'>Выбрано лексики</div>
            <div class='stat-value'>
              {userWordsTotal} / {CONSTANTS.users.vocabSize}
            </div>
            <div class='stat-desc'>из словаря или текстов</div>
          </div>

          <div class='stat'>
            <div class='stat-figure text-secondary'>{bookBigSvg}</div>
            <div class='stat-title'>Прочитано текстов</div>
            <div class='stat-value'>
              {finishedTextsTotal} / {approvedTextsNum}
            </div>
            <div class='stat-desc'>в Читалке</div>
          </div>
        </div>
      </div>
    );
  }
);
