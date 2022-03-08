import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { setModalWord } from "../../actions/userWords";
import { parseRussian } from "../../actions/helpers";
import { sanitizer } from "../../utils/sanitizer";
import { myAudioURL } from "../../constants/urls.json";
import { setAlert } from "../../actions/alert";

const WordsItem = ({
  lexicon,
  hideFlag,
  setModalWord,
  setAlert,
  // removeWord,
  // loadUserWordsLen,
  // loadUserWords,
  // addWord,
  // isAuthenticated,
  // userWords,
}) => {
  // const [clicked, setClicked] = useState(false);
  const { chinese, pinyin, translation, id, lvl } = lexicon;
  const russian = parseRussian(translation);

  // useEffect(() => {
  //   if (isAuthenticated) loadUserWords();
  // }, [isAuthenticated]);

  // useEffect(() => {
  //   if (fromSearch && userWordsInclude(lexicon)) setClicked(true);
  // }, [userWords]);

  // function userWordsInclude({ chinese }) {
  //   return userWords.some((x) => x.chinese === chinese);
  // }

  // const trashWord = () => {
  //   if (fromSearch) return;

  //   removeWord(chinese);
  //   setTimeout(() => {
  //     loadUserWordsLen();
  //   }, 100);
  // };

  const showModal = (e) => {
    lexicon.russian = lexicon.translation;
    setModalWord(lexicon);
  };

  // const updateVocabulary = async (word) => {
  //   if (!word) return;

  //   if (clicked) {
  //     setClicked(false);
  //     await removeWord(word.chinese);
  //   } else {
  //     setClicked(true);
  //     await addWord({
  //       pinyin: lexicon.pinyin,
  //       russian: lexicon.translation,
  //       chinese: lexicon.chinese,
  //     });
  //   }
  //   setTimeout(() => {
  //     loadUserWords();
  //     loadUserWordsLen();
  //   }, 100);
  // };

  const moreButton = (
    <button
      className='btn btn-sm btn-info'
      onClick={(e) => showModal(e)}
      data-toggle='modal'
      data-target='#exampleModal'
    >
      Больше
    </button>
  );

  const playIt = (word) => {
    const { id, lvl } = word;
    new Audio(`${myAudioURL}newhsk/band${lvl}/${id}.mp3`).play();
    return false;
  };

  return (
    <tr>
      <td>
        <small>{id}</small>
      </td>
      <td>
        <h4>{!hideFlag.chinese && chinese}</h4>
      </td>
      <td>{!hideFlag.pinyin && pinyin}</td>
      <td
        dangerouslySetInnerHTML={{ __html: sanitizer(!hideFlag.translation ? russian : "") }}
      ></td>
      <td>{moreButton}</td>
      <td>
        <button className='btn btn-sm btn-info' onClick={() => playIt(lexicon)}>
          <i className='fas fa-play'></i>
        </button>
      </td>
    </tr>
  );
};

// const mapStateToProps = (state) => ({
//   isAuthenticated: state.auth.isAuthenticated,
//   userWords: state.userwords.userwords,
// });

export default connect(null, {
  setModalWord,
  setAlert,
})(WordsItem);
