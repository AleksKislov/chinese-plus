import React, { Fragment, useState } from "react";
import TableItem from "./TableItem";
import HideButtons from "./HideButtons";

const TablePlate = ({ lexicons, userWords }) => {
  const [hideFlag, setHideFlag] = useState({
    chinese: false,
    pinyin: false,
    translation: false,
  });

  const onClick = (e) => {
    const id = e.target.id;

    if (id === "ru") {
      setHideFlag({
        translation: !hideFlag.translation,
        chinese: hideFlag.chinese,
        pinyin: hideFlag.pinyin,
      });
    }
    if (id === "py") {
      setHideFlag({
        pinyin: !hideFlag.pinyin,
        translation: hideFlag.translation,
        chinese: hideFlag.chinese,
      });
    }
    if (id === "cn") {
      setHideFlag({
        chinese: !hideFlag.chinese,
        translation: hideFlag.translation,
        pinyin: hideFlag.pinyin,
      });
    }
  };

  return (
    <Fragment>
      <HideButtons hideFlag={hideFlag} onClick={onClick} />
      <table className='table table-hover table-responsive'>
        <tbody>
          {lexicons.map((lexicon) => (
            <TableItem
              key={lexicon._id}
              lexicon={lexicon}
              selected={userWords.some((word) => word.word_id === lexicon.word_id)}
              hideFlag={hideFlag}
            />
          ))}
        </tbody>
      </table>
    </Fragment>
  );
};

export default TablePlate;
