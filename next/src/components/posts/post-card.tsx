"use client";
import Link from "next/link";
import Image from "next/image";

import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { dateToStr } from "../../helpers/ui";
import UndecLink from "../layout/undec-link";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentDots } from "@fortawesome/free-solid-svg-icons";

export default function PostCard({ post }: { post: PostT }) {
  const { _id, text, name, avatar, date, title, tag, user, comments_id } = post;

  const dateAndTime = dateToStr(date, false);
  const badgeColor = tag === "news" ? "info" : tag === "bug" ? "danger" : "success";

  return (
    <div className='card mb-2'>
      <div className='card-body'>
        <div className='row'>
          <div className='col-1'>
            <OverlayTrigger
              placement='bottom'
              overlay={<Tooltip>Кликните, чтобы написать пользователю</Tooltip>}
            >
              <Image
                src={`https:${avatar}`}
                style={{}}
                quality={70}
                alt='avatar'
                width={40}
                height={40}
                className='rounded'
              />
              {/* <img
              className='mr-3'
              src={`https:${avatar}`}
              // style={imgStyle}
              alt='avatar'
              // onClick={() => addressToUser(user, name)}
            /> */}
            </OverlayTrigger>
          </div>
          <div className='col-11'>
            <span className={`badge float-end bg-${badgeColor}`}>{tagTheme[tag]}</span>
            <h4 className='card-title '>
              <UndecLink href={`/posts/${_id}`} txt={title} />
            </h4>
          </div>
        </div>
        <div className='row'>
          <div className='col-1'></div>
          <div className='col-11'>
            <h6 className='card-subtitle mb-2 text-muted'>
              <UndecLink href={`/user/${user}`} txt={name} /> | <em>{dateAndTime}</em>
            </h6>
          </div>
        </div>

        <p className='card-text' dangerouslySetInnerHTML={{ __html: text }}></p>
        <Link href={`/posts/${_id}`}>
          <OverlayTrigger placement='bottom' overlay={<Tooltip>Комментарии</Tooltip>}>
            <button className='btn btn-sm btn-outline-info'>
              <FontAwesomeIcon icon={faCommentDots} />{" "}
              {comments_id.length > 0 && <span>{comments_id.length}</span>}
            </button>
          </OverlayTrigger>
        </Link>
      </div>
    </div>
  );
}

const tagTheme: { [key: string]: string } = {
  wish: "Пожелание",
  bug: "Баг",
  news: "Новости",
};
