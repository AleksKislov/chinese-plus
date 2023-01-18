import { useState } from "react";
import NewHskTableRow from "./new-hsk-table-row";
import HideButtons from "./hide-buttons";
import OldHskTableRow from "./old-hsk-table-row";
import TableOrCardsBtns from "./table-or-cards-btns";
import FlipCards from "./flip-cards";

type HskTable = {
  isOldHsk: boolean;
  hskWords: NewHskWordType[] | OldHskWordType[] | null;
};
export default function HskTable({ isOldHsk, hskWords }: HskTable) {
  const [hideChinese, setHideChinese] = useState(false);
  const [hidePinyin, setHidePinyin] = useState(false);
  const [hideRussian, setHideRussian] = useState(false);
  const [displayCards, setDisplayCards] = useState(false);

  return (
    <>
      <div className=''>
        {isOldHsk && !displayCards && (
          <HideButtons
            hideChinese={hideChinese}
            hideRussian={hideRussian}
            hidePinyin={hidePinyin}
            setHideChinese={setHideChinese}
            setHideRussian={setHideRussian}
            setHidePinyin={setHidePinyin}
          />
        )}
        {isOldHsk && (
          <TableOrCardsBtns setDisplayCards={setDisplayCards} displayCards={displayCards} />
        )}
      </div>
      {isOldHsk && displayCards ? (
        <FlipCards words={hskWords as OldHskWordType[]} />
      ) : (
        <table className='table table-hover table-responsive'>
          <thead style={{ visibility: "collapse" }}>
            <tr>
              <th></th>
              {!hideChinese && <th style={{ width: "15%" }}></th>}
              {!hidePinyin && <th></th>}
              {!hideRussian && <th></th>}
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {hskWords &&
              hskWords.map((word) =>
                isOldHsk ? (
                  <OldHskTableRow
                    key={word._id}
                    word={word as OldHskWordType}
                    hideChinese={hideChinese}
                    hideRussian={hideRussian}
                    hidePinyin={hidePinyin}
                  />
                ) : (
                  <NewHskTableRow
                    key={word._id}
                    word={word as NewHskWordType}
                    hideChinese={hideChinese}
                    hideRussian={hideRussian}
                    hidePinyin={hidePinyin}
                  />
                )
              )}
          </tbody>
        </table>
      )}
    </>
  );
}
