import React, { useState, useEffect } from "react";
// import { sanitizer } from "../../utils/sanitizer";
// import { markUpRussianText } from "../../actions/helpers";
import axios from "axios";
import { connect } from "react-redux";

const WordEditModal = ({ word }) => {
  const { chinese, pinyin, russian, _id } = word;

  useEffect(() => {
    if (pinyin) setNewPinyin(pinyin.trim());
  }, [pinyin]);

  const [okToEdit, setOkToEdit] = useState(false);
  const [newPinyin, setNewPinyin] = useState("");

  // const translation = markUpRussianText(russian, true);

  const editPinyin = (e) => {
    setNewPinyin(e.target.value);
    if (!e.target.value) return setOkToEdit(false);
    setOkToEdit(true);
  };

  const editWord = () => {
    console.log("here");

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const body = JSON.stringify({
      id: _id,
      pinyin: newPinyin,
      russian,
    });
    axios.put("/api/dictionary/updateWord", body, config).catch(console.log);
  };

  return (
    <div
      className='modal fade'
      id='editWordModal'
      tabIndex='-1'
      role='dialog'
      aria-labelledby='editWordModalLabel'
      aria-hidden='true'
    >
      <div className='modal-dialog modal-lg' role='document'>
        <div className='modal-content'>
          <div className='modal-header'>
            <h5 className='modal-title' id='exampleModalLabel'>
              Редактировать слово: {chinese}
            </h5>

            <button type='button' className='close' data-dismiss='modal' aria-label='Close'>
              <span aria-hidden='true'>&times;</span>
            </button>
          </div>

          <div className='modal-body'>
            <small>Пока можно редактировать только пиньинь</small>
            <div className='form-group row'>
              <label htmlFor='pinyinInput' className='col-sm-2 col-form-label'>
                Пиньинь
              </label>
              <div className='col-sm-4'>
                <input
                  type='text'
                  className='form-control'
                  id='pinyinInput'
                  value={newPinyin || ""}
                  onChange={editPinyin}
                />
              </div>
            </div>
          </div>

          <div className='modal-footer'>
            <button
              data-dismiss='modal'
              className='btn btn-info btn-sm'
              disabled={!okToEdit}
              onClick={() => {
                editWord();
              }}
            >
              Отредактировать
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  word: state.userwords.modalWordToEdit,
});

export default connect(mapStateToProps, {})(WordEditModal);
