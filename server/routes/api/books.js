const express = require('express');
const router = express.Router();

const Book = require('../../src/models/Book');
const Bookauthor = require('../../src/models/Bookauthor');
const BookContent = require('../../src/models/BookContent');
// const BookPage = require('../../src/models/BookPage');
const { createPages } = require('../../src/api/services/books');

/**
 * @route   GET api/books/all
 */
router.get('/all', async (req, res) => {
  try {
    const books = await Book.find().populate('author', ['name']);
    res.json(books);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

/**
 * @route   GET api/books/authors
 */
router.get('/authors', async (req, res) => {
  try {
    const authors = await Bookauthor.find();
    res.json(authors);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

/**
 * @route   GET api/books/:id
 */
router.get('/:id', async (req, res) => {
  const bookId = req.params.id;

  try {
    const book = await Book.findById(bookId).populate('author', ['name', 'year']);

    if (!book) return res.status(404).json({ msg: 'Book not found' });

    const contents = await BookContent.find({ book: bookId })
      .select('ind title length')
      .sort({ ind: 1 });

    res.json({ book, contents });
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'Book not found!' });
    res.status(500).send('Server error');
  }
});

router.post('/page', createPages);

// // calculate book total length
// router.post('/book_length', async (req, res) => {
//   let { bookId } = req.body;

//   try {
//     const book = await Book.findById(bookId);
//     const allChapters = book.contents;
//     const length = allChapters.reduce((acc, currentVal) => acc + currentVal.length, 0);

//     const editedBook = await Book.findByIdAndUpdate(
//       bookId,
//       {
//         $set: { length },
//       },
//       { new: true },
//     );

//     res.json(editedBook);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Server error');
//   }
// });

module.exports = router;
