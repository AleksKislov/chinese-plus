const { NAMES, BY_SLUG } = require('./names-data');

const toLink = (n) => n && { slug: n.slug, name: n.name, cn: n.variants[0].cn };

// one name plus its alphabetical neighbours (for prev / next links):
// full names of the same gender, or the other short forms
async function getName(req, res) {
  const name = BY_SLUG.get(req.params.slug);
  if (!name) return res.status(404).json({ msg: 'Name not found' });

  const group = NAMES.filter(
    (n) => n.kind === name.kind && (n.kind === 'short' || n.gender === name.gender),
  );
  const ind = group.indexOf(name);
  res.json({
    name,
    prev: toLink(group[ind - 1]),
    next: toLink(group[ind + 1]),
  });
}

module.exports = { getName };
