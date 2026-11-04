const router = require('express').Router();
const { cacheRoute, TTL } = require('../../src/cache');
const adminAuth = require('../../middleware/admin-auth');

const {
  getGrammarLevels,
  getGrammarByLevel,
  getGrammarTopic,
  getGrammarSlugs,
  deleteAudio,
} = require('../../src/api/services/grammar');

/**
 * @route     GET api/grammar
 * @desc      Levels that have grammar topics, with topic counts
 * @access    Public
 */
router.get('/', cacheRoute('grammar', { ttl: TTL.DAY }), getGrammarLevels);

/**
 * @route     GET api/grammar/slugs
 * @desc      All topic slugs (for the sitemap)
 * @access    Public
 */
router.get('/slugs', cacheRoute('grammar', { ttl: TTL.DAY }), getGrammarSlugs);

/**
 * @route     GET api/grammar/level/:level
 * @desc      Topics of a level ('1'..'6', '789'): titles and summaries only
 * @access    Public
 */
router.get('/level/:level', cacheRoute('grammar', { ttl: TTL.DAY }), getGrammarByLevel);

/**
 * @route     GET api/grammar/topic/:slug
 * @desc      One topic with prev / next topic of the same level
 * @access    Public
 */
router.get('/topic/:slug', cacheRoute('grammar', { ttl: TTL.DAY }), getGrammarTopic);

/**
 * @route     DELETE api/grammar/audio/:file
 * @desc      Delete an example's audio ({hash}.mp3) from the bucket and the DB,
 *            so generate-grammar-audio.js records it again
 * @access    Admin
 */
router.delete('/audio/:file', adminAuth, deleteAudio);

module.exports = router;
