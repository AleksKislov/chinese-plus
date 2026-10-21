const { NAMES, BY_SLUG } = require('./names-data');

const toLink = (n) => n && { slug: n.slug, name: n.name, cn: n.variants[0].cn };

// one name plus its alphabetical neighbours of the same gender (for prev / next links)
async function getName(req, res) {
  const name = BY_SLUG.get(req.params.slug);
  if (!name) return res.status(404).json({ msg: 'Name not found' });

  const sameGender = NAMES.filter((n) => n.gender === name.gender);
  const ind = sameGender.indexOf(name);
  res.json({
    name,
    prev: toLink(sameGender[ind - 1]),
    next: toLink(sameGender[ind + 1]),
  });
}

module.exports = { getName };
