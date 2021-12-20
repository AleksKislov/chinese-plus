import React, { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "../layout/Spinner";
import Tippy from "@tippyjs/react";
import AllUserTextsTable from "./AllUserTextsTable";
// import {withRouter} from 'react-router-dom'

const UserProfile = ({ match, history }) => {
  useEffect(() => {
    loadProfile(match.params.id);
  }, []);

  const [profile, setProfile] = useState(null);
  const [isCopied, setIsCopied] = useState(false);

  const loadProfile = async id => {
    try {
      const { data } = await axios.get("/api/profile/user/" + id);
      setProfile(data);
    } catch (err) {
      console.log(err);
    }
  };

  return profile ? (
    <div className='row'>
      <div className='col-md-12'>
        <button className='btn btn-outline-info my-2 btn-sm' onClick={history.goBack}>
          Назад
        </button>
      </div>
      <div className='col-md-1'>
        <Tippy content={"Поменять аватар можно в ЛК"} placement='bottom'>
          <img className='mr-3' src={`https:${profile.avatar}`} style={imgStyle} alt='Avatar' />
        </Tippy>
      </div>
      <div className='col-md-11'>
        <p>
          <strong>Пользователь:</strong> {profile.name}
        </p>
        <p>
          <strong>Роль:</strong> {profile.role || "изучающий"}
        </p>
        <p>
          <strong>ID пользователя:</strong> {` @@[${profile._id}]{${profile.name}}@@`}{" "}
          <Tippy content={"Кнопка копирования ID"} placement='bottom'>
            <button
              className='btn btn-sm btn-primary'
              onClick={() => {
                setIsCopied(true);
                navigator.clipboard.writeText(` @@[${profile._id}]{${profile.name}}@@, `);
              }}
            >
              <i className='far fa-copy'></i>
            </button>
          </Tippy>{" "}
          {isCopied && <span className='text-danger'> Скопировано!</span>}
        </p>

        <div className='alert alert-dismissible alert-success'>
          По ID можно обращаться к пользователям в комментариях. Чтобы скопировать - нажмите кнопку{" "}
          <i className='far fa-copy'></i>
        </div>
        <div className=''>
          <AllUserTextsTable userId={match.params.id} />
        </div>
        <div className=''>
          <h5>Ниже функционал в разработке:</h5>
          <ul>
            <li>написать личное сообщение пользователю</li>
            <li>ачивки / бэйджики</li>
            <li>если есть идеи, что сюда можно добавить - пишите в Гостевой :)</li>
          </ul>
        </div>
      </div>
    </div>
  ) : (
    <Spinner />
  );
};

const imgStyle = {
  width: "60px",
  borderRadius: "8px"
};

export default UserProfile;
