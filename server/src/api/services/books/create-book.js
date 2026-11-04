const Book = require('../../../models/Book');
const { invalidateTag } = require('../../../cache');
const { Notify } = require('../_misc');

async function createBook(req, res) {
  const { title, year, author, about, genres, picUrl, translationSrc } = req.body;

  if (!author) {
    return res.status(400).json({ msg: 'Нужен автор' });
  }

  const newBook = new Book({
    title,
    year,
    author,
    about,
    genres,
    picUrl,
    translationSrc,
  });

  const book = await newBook.save();

  invalidateTag('books');
  Notify.admin(
    `📚 Добавлена новая книга: ${book.title?.cn || ''}${book.title?.ru ? ` / ${book.title.ru}` : ''}`,
  );

  return res.json(book);
}

module.exports = { createBook };
