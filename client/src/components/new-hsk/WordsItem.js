import React from "react";
import { connect } from "react-redux";
import { setModalWord } from "../../actions/userWords";
import { parseRussian } from "../../actions/helpers";
import { sanitizer } from "../../utils/sanitizer";

const WordsItem = ({
  lexicon,
  hideFlag,
  setModalWord,
  // removeWord,
  // loadUserWordsLen,
  // loadUserWords,
  // addWord,
  // isAuthenticated,
  // userWords,
}) => {
  // const [clicked, setClicked] = useState(false);
  const { chinese, pinyin, translation } = lexicon;
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

  return (
    <tr>
      <td>
        <h4>{!hideFlag.chinese && chinese}</h4>
      </td>
      <td>{!hideFlag.pinyin && pinyin}</td>
      <td
        dangerouslySetInnerHTML={{ __html: sanitizer(!hideFlag.translation ? russian : "") }}
      ></td>
      <td>{moreButton}</td>
    </tr>
  );
};

// const mapStateToProps = (state) => ({
//   isAuthenticated: state.auth.isAuthenticated,
//   userWords: state.userwords.userwords,
// });

export default connect(null, {
  setModalWord,
})(WordsItem);
