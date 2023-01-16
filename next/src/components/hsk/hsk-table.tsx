import { useState } from "react";
import NewHskTableRow from "./new-hsk-table-row";
import HideButtons from "./hide-buttons";

type HskTable = {
  isOldHsk: boolean;
  hskWords: NewHskWordType[] | null;
};
export default function HskTable({ isOldHsk, hskWords }: HskTable) {
  const [hideChinese, setHideChinese] = useState(false);
  const [hidePinyin, setHidePinyin] = useState(false);
  const [hideRussian, setHideRussian] = useState(false);

  return (
    <>
      <HideButtons
        hideChinese={hideChinese}
        hideRussian={hideRussian}
        hidePinyin={hidePinyin}
        setHideChinese={setHideChinese}
        setHideRussian={setHideRussian}
        setHidePinyin={setHidePinyin}
      />
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
            hskWords.map((word) => (
              <NewHskTableRow
                key={word._id}
                word={word}
                hideChinese={hideChinese}
                hideRussian={hideRussian}
                hidePinyin={hidePinyin}
              />
            ))}
        </tbody>
      </table>
    </>
  );
}
