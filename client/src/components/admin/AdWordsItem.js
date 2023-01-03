import React from "react";
import { connect } from "react-redux";
import { setModalWord } from "../../actions/userWords";
import { parseRussian } from "../../actions/helpers";
import { sanitizer } from "../../utils/sanitizer";
import TippyTooltip from "../translation/TippyTooltip";

const AdWordsItem = ({ lexicon, setModalWord }) => {
  const { pinyin, russian } = lexicon;
  const parsedRussian = parseRussian(russian);

  const moreButton = (
    <button
      className='btn btn-sm btn-info'
      onClick={() => setModalWord(lexicon)}
      data-toggle='modal'
      data-target='#exampleModal'
    >
      Больше
    </button>
  );

  return (
    <tr>
      <td>
        <TippyTooltip word={lexicon} />
      </td>
      <td>{pinyin}</td>
      <td>
        <small dangerouslySetInnerHTML={{ __html: sanitizer(parsedRussian) }}></small>
      </td>
      <td>{moreButton}</td>
    </tr>
  );
};

export default connect(null, {
  setModalWord,
})(AdWordsItem);
