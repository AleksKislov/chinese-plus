const Bookauthor = require('../../../models/Bookauthor');

async function createAuthor(req, res) {
  const { name, year, about, country } = req.body;

  const newAuthor = new Bookauthor({
    name,
    year,
    about,
    country,
  });

  const author = await newAuthor.save();

  return res.json(author);
}

module.exports = { createAuthor };
