import { useState, useEffect } from "react";
import NewHskTableRow from "./new-hsk-table-row";
import HideButtons from "./hide-buttons";
import OldHskTableRow from "./old-hsk-table-row";
import TableOrCardsBtns from "./table-or-cards-btns";
import FlipCards from "./flip-cards";
import { useAuthCtx } from "../../context/auth/store";
import { loadUserHsk2Words } from "../../context/hsk/actions";
import { useHskCtx } from "../../context/hsk/store";

type HskTable = {
  isOldHsk: boolean;
  hskWords: NewHskWordType[] | OldHskWordType[] | null;
};
export default function HskTable({ isOldHsk, hskWords }: HskTable) {
  const [hideChinese, setHideChinese] = useState(false);
  const [hidePinyin, setHidePinyin] = useState(false);
  const [hideRussian, setHideRussian] = useState(false);
  const [displayCards, setDisplayCards] = useState(false);

  const { loggedIn } = useAuthCtx();
  const { setUserHsk2Words, userHsk2Words } = useHskCtx();

  useEffect(() => {
    if (!(loggedIn && isOldHsk)) return;
    setTimeout(async () => {
      try {
        const userWords = await loadUserHsk2Words(localStorage.token);
        if (!userWords) throw new Error("not authorized");
        setUserHsk2Words(userWords);
      } catch (err) {
        console.log(err);
      }
    });
  }, [loggedIn]);

  return (
    <>
      <div>
        {!displayCards && (
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
        <table className='table table-hover table-responsive table-sm'>
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
                    userSelected={userHsk2Words?.some(
                      (x) => x.word_id === (word as OldHskWordType).word_id
                    )}
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
