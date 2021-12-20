import React, { useEffect } from "react";
import { connect } from "react-redux";
import { loadBooks, clearBook } from "../../actions/books";
import BookCard from "./BookCard";
import Spinner from "../layout/Spinner";
import ReadingCard from "../dashboard/ReadingCard";
import { Helmet } from "react-helmet";
import BooksNotification from "./info/BooksNotification";

const Books = ({ loadBooks, books, loading, clearBook }) => {
  useEffect(() => {
    clearBook();
    loadBooks();
  }, [loadBooks]);

  return (
    <div className='row'>
      <Helmet>
        <meta charSet='utf-8' />
        <title>Книги на китайском языке с переводом | Chinese+</title>
      </Helmet>

      <div className='col-md-3'>
        <div className='card bg-light mb-3'>
          <div className='card-body'>
            <p className='card-text'>
              Чтение книг на китайском языке с параллельным переводом каждого параграфа, а также с
              буквальным переводом каждого слова (по клику).
            </p>
          </div>
        </div>
        <BooksNotification />
        <ReadingCard />
      </div>

      <div className='col-md-9'>
        <h2>Книги на китайском языке с переводом</h2>

        {loading && !books.length ? (
          <Spinner />
        ) : (
          books.map(book => <BookCard key={book._id} book={book} />)
        )}
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  books: state.books.books,
  loading: state.books.loading
});

export default connect(mapStateToProps, { loadBooks, clearBook })(Books);
