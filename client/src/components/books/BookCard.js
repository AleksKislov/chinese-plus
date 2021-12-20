import React from "react";
import { Link } from "react-router-dom";
import Length from "./info/Length";
import AuthorRus from "./info/AuthorRus";
import Annotation from "./info/Annotation";
import BookTitle from "./info/BookTitle";
import { Helmet } from "react-helmet";

const BookCard = ({ book }) => {
  const {
    chineseTitle,
    russianTitle,
    pictureUrl,
    year,
    authorName,
    genre, // array
    length,
    annotation,
    _id // book id
  } = book;
  return (
    <div className='card my-2'>
      <Helmet>
        <meta charSet='utf-8' />
        <title>Тексты на китайском языке с переводом | Chinese+</title>
      </Helmet>
      <div className='card-body row'>
        <div style={{ position: "relative" }} className='col-md-3'>
          <Link to={`/books/${_id}`}>
            <img className='mr-3 textCardImg' src={`${pictureUrl}`} alt='book pic' />
          </Link>
        </div>
        <div className='col-md-9'>
          <Link to={`/books/${_id}`}>
            <h4 className='card-title'>
              <BookTitle russianTitle={russianTitle} chineseTitle={chineseTitle} />
            </h4>
          </Link>
          <h6 className='card-subtitle mb-2'>
            <span className='text-muted'>Жанр: </span>
            {genre.map((genreName, ind) => (
              <span key={ind} className='badge badge-pill badge-info ml-1'>
                {genreName}
              </span>
            ))}
          </h6>

          <h6 className='card-subtitle mb-2'>
            <span className='text-muted'>Год: </span>
            {year}
          </h6>
          <AuthorRus authorName={authorName} />
          <Length length={length} />
          <Annotation annotation={annotation} />

          <div className=''>
            <Link to={`/books/${_id}`}></Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
