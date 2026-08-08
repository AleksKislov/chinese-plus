const axios = require('axios');

const GOOGLE_ENDPOINT =
  'https://inputtools.google.com/request?ime=handwriting&app=mobilesearch&cs=1&oe=UTF-8';
const TIMEOUT_MS = 5000;
const MAX_STROKES = 60;
const MAX_POINTS_PER_STROKE = 300;
const DEFAULT_SIZE = 300;
const MAX_SIZE = 4000;
const HAN_ONLY = /^\p{Script=Han}+$/u;

function isValidSize(n) {
  return typeof n === 'number' && Number.isFinite(n) && n > 0 && n <= MAX_SIZE;
}

function isValidStroke(stroke) {
  return (
    Array.isArray(stroke) &&
    stroke.length === 2 &&
    Array.isArray(stroke[0]) &&
    Array.isArray(stroke[1]) &&
    stroke[0].length > 0 &&
    stroke[0].length === stroke[1].length &&
    stroke[0].length <= MAX_POINTS_PER_STROKE &&
    stroke[0].every((n) => typeof n === 'number') &&
    stroke[1].every((n) => typeof n === 'number')
  );
}

/**
 * @desc proxies to Google's unofficial, undocumented handwriting recognition
 * endpoint (the same one Gboard/Google Translate use). It's unauthenticated
 * (no API key), but unsupported: it can change shape, rate-limit, or go away
 * without notice. Fail soft - return no candidates rather than an error.
 */
async function handwritingSearch(req, res) {
  const { strokes, width, height } = req.body;

  if (!Array.isArray(strokes) || !strokes.length) {
    throw new Error('strokes are required');
  }
  if (strokes.length > MAX_STROKES) {
    throw new Error(`at most ${MAX_STROKES} strokes allowed`);
  }
  if (!strokes.every(isValidStroke)) {
    throw new Error('each stroke must be [xs[], ys[]] of equal-length numbers');
  }

  const writingAreaWidth = isValidSize(width) ? width : DEFAULT_SIZE;
  const writingAreaHeight = isValidSize(height) ? height : DEFAULT_SIZE;

  let candidates = [];
  try {
    const { data } = await axios.post(
      GOOGLE_ENDPOINT,
      {
        options: 'enable_pre_space',
        requests: [
          {
            writing_guide: {
              writing_area_width: writingAreaWidth,
              writing_area_height: writingAreaHeight,
            },
            pre_context: '',
            max_num_results: 10,
            ink: strokes,
            language: 'zh_CN',
          },
        ],
      },
      { timeout: TIMEOUT_MS },
    );

    if (data?.[0] === 'SUCCESS') {
      candidates = (data[1]?.[0]?.[1] || []).filter((c) => HAN_ONLY.test(c));
    }
  } catch (err) {
    console.log('[dictionary] handwriting recognition API failed', err.message);
  }

  res.json({ candidates });
}

module.exports = { handwritingSearch };
