const express = require('express');
const router = express.Router();
const moderatorAuth = require('../../middleware/moderator-auth');
const { cacheRoute, TTL } = require('../../src/cache');

const Book = require('../../src/models/Book');
const Bookauthor = require('../../src/models/Bookauthor');
const BookContent = require('../../src/models/BookContent');
const BookPage = require('../../src/models/BookPage');
const {
  createPages,
  getPage,
  updateBookPage,
  getBookPageById,
  createBook,
  createAuthor,
} = require('../../src/api/services/books');
const { Notify } = require('../../src/api/services/_misc');

/**
 * @route   GET api/books/all
 */
router.get('/all', cacheRoute('books', { ttl: TTL.LONG }), async (req, res) => {
  try {
    const books = await Book.find({ isActive: true }).populate('author', ['name', 'country']);
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

router.post('/authors', moderatorAuth, createAuthor);

/**
 * @route   POST api/books/create
 */
router.post('/create', moderatorAuth, createBook);

/**
 * @route   GET api/books/:id
 */
router.get('/:id', async (req, res) => {
  const bookId = req.params.id;

  try {
    const book = await Book.findById(bookId).populate('author', ['name', 'year', 'country']);

    if (!book) return res.status(404).json({ msg: 'Book not found' });

    const contentsPromise = BookContent.find({ book: bookId }).select('ind title').sort({ ind: 1 });

    const pagesPromise = BookPage.find({ book: bookId }).select('ind length belongsTo');

    const [contentsP, pagesP] = await Promise.all([contentsPromise, pagesPromise]);

    const contents = contentsP.map((part) => {
      const pages = pagesP
        .filter((page) => page.belongsTo.toString() === part._id.toString())
        .sort((a, b) => a.ind - b.ind);

      return {
        _id: part._id,
        ind: part.ind,
        title: part.title,
        length: pages.reduce((acc, currentVal) => acc + currentVal.length, 0),
        pages,
      };
    });

    const bookLen = contents.reduce((acc, currentVal) => acc + currentVal.length, 0);
    book.length = bookLen;

    res.json({ book, contents });
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'Book not found!' });
    res.status(500).send('Server error');
  }
});

router.post('/page', moderatorAuth, createPages);
router.get('/page/:page_id', getBookPageById);

router.put('/page/:page_id', moderatorAuth, updateBookPage);

router.post('/chapter', moderatorAuth, async (req, res) => {
  const { bookId, chapters } = req.body;

  try {
    const toSave = chapters.map((chapter) => {
      return {
        ...chapter,
        book: bookId,
      };
    });

    const savedChapters = await BookContent.insertMany(toSave);

    const book = await Book.findById(bookId).select('title');
    const chapterTitles = savedChapters
      .map((c) => c.title?.cn || c.title?.ru)
      .filter(Boolean)
      .join(', ');
    Notify.admin(`📖 Добавлена глава для книги "${book?.title?.cn || bookId}": ${chapterTitles}`);

    res.json(savedChapters);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

router.get('/:id/:chapter_id/:page_ind', getPage);

module.exports = router;
