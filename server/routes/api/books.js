// DEPCRECATED
const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Book = require('../../src/models/Book');
const Bookauthor = require('../../src/models/Bookauthor');
const Chapterpage = require('../../src/models/Chapterpage');
const Comment = require('../../src/models/Comment');

router.post('/new_author', auth, async (req, res) => {
  const { nameRus, nameChinese, yearBorn, yearDead, about, pictureUrl, isChinese } = req.body;

  const newAuthor = new Bookauthor({
    nameRus,
    nameChinese,
    yearBorn,
    yearDead,
    about,
    isChinese,
    pictureUrl,
  });

  try {
    const author = await newAuthor.save();
    res.json(author);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

router.post(
  '/new_book',
  [auth, [check('author', 'Нужен автор!').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    // author - ObjectId
    // genre - we get string
    let {
      chineseTitle,
      russianTitle,
      year,
      author,
      isChinese,
      length,
      contents,
      annotation,
      genre,
      pictureUrl,
    } = req.body;

    genre = genre.split(',').map((word) => word.trim());

    try {
      const bookAuthor = await Bookauthor.findById(author);

      const authorName = {
        nameRus: bookAuthor.nameRus,
        nameChinese: bookAuthor.nameChinese,
      };

      const newBook = new Book({
        chineseTitle,
        russianTitle,
        year,
        author,
        authorName,
        isChinese,
        length,
        contents,
        annotation,
        genre,
        pictureUrl,
      });

      const book = await newBook.save();
      bookAuthor.books.push(book._id);
      await bookAuthor.save();

      res.json(book);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  },
);

router.post(
  '/new_chapter',
  [auth, [check('book', 'Нужно указать книгу!').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    // book - ObjectId
    let { book, chineseTitle, russianTitle } = req.body;

    try {
      const bookToEdit = await Book.findById(book);
      const chapterNum = bookToEdit.contents.length;

      bookToEdit.contents.push({
        chapterId: chapterNum,
        chineseTitle,
        russianTitle,
        length: 0, // 0 by default
        pages: [],
      });

      const editedBook = await bookToEdit.save();

      res.json(editedBook);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  },
);

/**
 * @route     POST api/books/new_chapterpage
 * @desc      Create or Update chapter page (2000 chars max)
 * @access    Private
 */
router.post(
  '/new_chapterpage',
  [auth, [check('origintext', 'Нужен текст').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    // book - ObjectId for Book, chapter - index in Book.contents[]
    let { book, chapter, origintext, chinese_arr, translation, page_number, length, pageId } =
      req.body;

    // update
    if (pageId) {
      const newFields = {};
      if (origintext) newFields.origintext = origintext;
      if (translation) newFields.translation = translation;
      if (length) newFields.length = length;
      if (chinese_arr) newFields.chinese_arr = chinese_arr;
      if (page_number) newFields.page_number = page_number;
      try {
        const updatedPage = await Chapterpage.findByIdAndUpdate(
          pageId,
          {
            $set: newFields,
          },
          { new: true },
        );

        return res.json(updatedPage);
      } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
      }
    } else
      try {
        const newPage = new Chapterpage({
          book,
          chapter,
          origintext,
          length,
          translation,
          chinese_arr,
          page_number,
        });

        // create new page for the chapter
        const page = await newPage.save();

        // add the new page to chapter pages array
        await Book.findByIdAndUpdate(
          book,
          {
            $push: { 'contents.$[outer].pages': page._id },
          },
          { arrayFilters: [{ 'outer.chapterId': parseInt(chapter) }] },
        );

        res.json(page);
      } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
      }
  },
);

router.get('/allbooks', async (req, res) => {
  try {
    const books = await Book.find().sort({ date: -1 }).select('-contents');
    res.json(books);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

router.get('/get_book/:bookId', async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId);

    if (!book) return res.status(404).json({ msg: 'Text not found' });

    res.json(book);
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'Book not found!' });
    res.status(500).send('Server error');
  }
});

router.get('/get_page/:pageId', async (req, res) => {
  try {
    const page = await Chapterpage.findById(req.params.pageId);
    if (!page) return res.status(404).json({ msg: 'Страница не найдена' });
    res.json(page);
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'Страница не найдена' });
    res.status(500).send('Server error');
  }
});

// calculate chapter length
router.post('/chapter_length', async (req, res) => {
  let { bookId, chapterId } = req.body;

  try {
    const book = await Book.findById(bookId);
    const allPagesId = book.contents[chapterId].pages;

    const allPages = await Chapterpage.find({
      _id: {
        $in: allPagesId,
      },
    }).select('-origintext -translation -chinese_arr');
    // console.log(allPagesId);
    const chapterLength = allPages.reduce((acc, currentVal) => acc + currentVal.length, 0);

    // add the actual length to chapter in book.contents
    const editedBook = await Book.updateOne(
      {
        _id: bookId,
        'contents.chapterId': chapterId,
      },
      {
        $set: { 'contents.$.length': chapterLength },
      },
    );
    res.json(editedBook);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// calculate book total length
router.post('/book_length', async (req, res) => {
  let { bookId } = req.body;

  try {
    const book = await Book.findById(bookId);
    const allChapters = book.contents;
    const length = allChapters.reduce((acc, currentVal) => acc + currentVal.length, 0);

    const editedBook = await Book.findByIdAndUpdate(
      bookId,
      {
        $set: { length },
      },
      { new: true },
    );

    res.json(editedBook);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/books/comment/:id/:comment_id
// @desc    Delete a Comment from book page
// access   Private
router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
  try {
    const post = await Chapterpage.findById(req.params.id);
    const comment = await Comment.findById(req.params.comment_id);

    post.comments_id = post.comments_id.filter((comment) => comment.id !== req.params.comment_id);

    await post.save();
    await comment.remove();

    res.json(post.comments_id);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
