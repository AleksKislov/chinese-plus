import React, { useState } from "react";
import { connect } from "react-redux";
import { markAsRead } from "../../actions/auth";

const ReadSwitch = ({ user, id, markAsRead }) => {
  const isRead = textid => (user ? user.finished_texts.includes(textid) : false);

  const [alreadyRead, setAlreadyRead] = useState(isRead(id));

  const onChange = () => {
    markAsRead(id, alreadyRead);
    setAlreadyRead(!alreadyRead);
  };

  return (
    user && (
      <div className='mb-2 form-group'>
        <h6 className='text-muted d-inline card-subtitle'>Прочитано: </h6>
        <div className='custom-control custom-switch d-inline'>
          <input
            type='checkbox'
            className='custom-control-input'
            id='alreadyReadInput'
            checked={alreadyRead}
            onChange={onChange}
          />
          <label className='custom-control-label' htmlFor='alreadyReadInput'>
            {alreadyRead ? "Да" : "Нет"}
          </label>
        </div>
      </div>
    )
  );
};

const mapStateToProps = state => ({
  user: state.auth.user
});

export default connect(mapStateToProps, { markAsRead })(ReadSwitch);
