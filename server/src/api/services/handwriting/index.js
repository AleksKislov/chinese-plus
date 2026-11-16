const { apiDecorator } = require('../../api-decorator');
const { HttpError } = require('../../http-error');
const Handwriting = require('../../../models/Handwriting');

// fonts are listed on the FE (components/handwriting/fonts.ts), any id of this shape is accepted
const FONT_RE = /^[a-z0-9-]{1,40}$/;
const HAN_RE = /^\p{Script=Han}$/u;

const MAX_STROKES = 80;
const MAX_POINTS = 20000;

const checkFont = (font) => {
  if (!FONT_RE.test(String(font || ''))) throw new HttpError(400, 'Unknown font');
  return font;
};

const checkChar = (char) => {
  if (!HAN_RE.test(String(char || ''))) throw new HttpError(400, 'Not a Chinese character');
  return char;
};

const isNum = (n) => typeof n === 'number' && Number.isFinite(n);

// see models/Handwriting.js for the point format; values are clamped and rounded
const cleanStrokes = (strokes) => {
  if (!Array.isArray(strokes) || !strokes.length || strokes.length > MAX_STROKES) {
    throw new HttpError(400, 'Bad strokes');
  }
  let total = 0;
  const clamp = (n, max) => Math.min(max, Math.max(0, n));
  return strokes.map((stroke) => {
    if (!Array.isArray(stroke) || !stroke.length) throw new HttpError(400, 'Bad stroke');
    total += stroke.length;
    if (total > MAX_POINTS) throw new HttpError(400, 'Too many points');
    return stroke.map((p) => {
      if (!Array.isArray(p) || p.length !== 4 || !p.every(isNum)) {
        throw new HttpError(400, 'Bad point');
      }
      const [x, y, pressure, t] = p;
      return [
        Math.round(clamp(x, 1000)),
        Math.round(clamp(y, 1000)),
        Math.round(clamp(pressure, 1) * 100) / 100,
        Math.round(Math.max(0, t)),
      ];
    });
  });
};

// { brush, width, sensitivity, taperStart, taperEnd, smoothing } from the FE brushes,
// the rest is dropped
const BRUSH_RE = /^[a-z-]{1,20}$/;
const cleanStyle = (style) => {
  if (!style || !BRUSH_RE.test(String(style.brush || ''))) return undefined;
  if (!isNum(style.width) || !isNum(style.sensitivity)) return undefined;
  return {
    brush: style.brush,
    width: Math.min(200, Math.max(1, Math.round(style.width))),
    sensitivity: Math.min(10, Math.max(1, Math.round(style.sensitivity))),
    ...(isNum(style.taperStart) && {
      taperStart: Math.min(300, Math.max(0, Math.round(style.taperStart))),
    }),
    ...(isNum(style.taperEnd) && {
      taperEnd: Math.min(300, Math.max(0, Math.round(style.taperEnd))),
    }),
    ...(isNum(style.smoothing) && {
      smoothing: Math.min(10, Math.max(0, Math.round(style.smoothing))),
    }),
  };
};

// GET ?font= - chars already saved for the font, to mark them
async function getSaved(req, res) {
  const font = checkFont(req.query.font);
  const docs = await Handwriting.find({ font }, { _id: 0, char: 1 }).lean();
  res.json(docs.map((d) => d.char));
}

// GET /:font/:char - one saved char with its strokes, to replay it
async function getOne(req, res) {
  const font = checkFont(req.params.font);
  const char = checkChar(req.params.char);
  const doc = await Handwriting.findOne(
    { font, char },
    { _id: 0, font: 1, char: 1, strokes: 1, size: 1, pen: 1, style: 1, updatedAt: 1 },
  ).lean();
  if (!doc) throw new HttpError(404, 'Not saved yet');
  res.json(doc);
}

// PUT /:font/:char { strokes, size, pen, style } - save, replacing an earlier version
async function saveOne(req, res) {
  const font = checkFont(req.params.font);
  const char = checkChar(req.params.char);
  const strokes = cleanStrokes(req.body?.strokes);
  const size = isNum(req.body?.size) ? Math.round(req.body.size) : undefined;
  const style = cleanStyle(req.body?.style);

  await Handwriting.findOneAndUpdate(
    { font, char },
    { font, char, strokes, size, style, pen: Boolean(req.body?.pen), user: req.user.id },
    { upsert: true },
  );
  res.json({ char, font });
}

// DELETE /:font/:char
async function deleteOne(req, res) {
  const font = checkFont(req.params.font);
  const char = checkChar(req.params.char);
  await Handwriting.deleteOne({ font, char });
  res.json({ char, font });
}

module.exports = {
  getSaved: apiDecorator(getSaved),
  getOne: apiDecorator(getOne),
  saveOne: apiDecorator(saveOne),
  deleteOne: apiDecorator(deleteOne),
};
