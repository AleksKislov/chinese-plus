import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Length from "./Length";
import AuthorRus from "./AuthorRus";
import ReadingCard from "../../dashboard/ReadingCard";
import BooksNotification from "./BooksNotification";
import FontSize from "../../common/FontSize";

const ImageCard = ({ book, isAuthenticated, currentUser }) => {
  const { genre, pictureUrl, authorName, length } = book;

  return (
    <div className='col-sm-3'>
      <div className='card bg-light mb-3'>
        <img className='mr-3 cardImageStyle' src={`${pictureUrl}`} alt='book' />
        <div className='card-body'>
          <p className='card-text text-center'>
            {genre.map((genreName, ind) => (
              <span key={ind} className='badge badge-pill badge-info ml-1'>
                {genreName}
              </span>
            ))}
          </p>

          <AuthorRus authorName={authorName} />
          <Length length={length} />

          <FontSize />

          {isAuthenticated && currentUser.role === "admin" && (
            <Link to='/create-bookpage'>
              <button className='btn btn-sm btn-outline-warning'>Edit</button>
            </Link>
          )}
        </div>
      </div>

      <BooksNotification />

      <ReadingCard />
    </div>
  );
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  currentUser: state.auth.user
});

export default connect(mapStateToProps, {})(ImageCard);
