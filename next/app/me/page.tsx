"use client";
import Image from "next/image";
import Link from "next/link";
import { useAuthCtx } from "../../src/context/auth/store";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;

export default function Dashboard() {
  const { user } = useAuthCtx();

  return user.isLoggedIn ? (
    <>
      <div className='row'>
        <div className='col-sm-6'>
          <h1 className=''>Личный Кабинет</h1>
          <div className='row'>
            <div className='col-2'>
              <Link href='/set_avatar'>
                <OverlayTrigger placement='bottom' overlay={<Tooltip>Поменять аватар</Tooltip>}>
                  <Image
                    src={user.avatarPic}
                    alt='avatar'
                    className='rounded'
                    width={80}
                    height={80}
                  />
                </OverlayTrigger>
              </Link>
            </div>
            <div className='col-10'>
              <p>
                <FontAwesomeIcon icon={faUser} /> Привет, {user.name}
              </p>
              <p className=''>Роль: {user.role}</p>
            </div>
          </div>
        </div>

        <div className='col-sm-6'>{/* <ReadingCard /> */}</div>

        <div className='col-sm-12'>{/* <Analytics /> */}</div>
      </div>

      <div className='row'>
        <div className='col-sm-6'>
          {/* <div className='card border-primary mb-3'>
              <div className='card-body'>
                <h4 className='card-title'>Мой HSK</h4>
                <h6 className='card-subtitle mb-2 text-muted'>Личный список слов HSK</h6>
                <p className='card-text'>
                  Сейчас для повторения вы отобрали столько слов:{" "}
                  <span className='badge badge-pill badge-warning'>
                    {allWordsLen} / {users.vocabSize}
                  </span>
                </p>
                <Link href='/hsk-table' className='card-link'>
                  Весь HSK
                </Link>
                <Link href='/hsk-words' className='card-link'>
                  Мой HSK
                </Link>
              </div>
            </div> */}

          {/* <div className='card border-primary mb-3'>
              <div className='card-body'>
                <h4 className='card-title'>Мои Слова</h4>
                <h6 className='card-subtitle mb-2 text-muted'>Список слов из текстов</h6>
                <p className='card-text'>
                  Сейчас для повторения вы отобрали столько слов:{" "}
                  <span className='badge badge-pill badge-warning'>
                    {userWordsLen} / {users.vocabSize}
                  </span>
                </p>
                <Link href='/userwords' className='card-link'>
                  Мои Слова
                </Link>
              </div>
            </div> */}
        </div>

        <div className='col-sm-6'>{/* <CommentsCard /> */}</div>
      </div>
    </>
  ) : (
    <p>Вам нужно залогиниться</p>
  );
}
