const router = require('express').Router();
const { cacheRoute, TTL } = require('../../src/cache');

const { getRuWords, getRuWordsByCn, getRuWord } = require('../../src/api/services/ru-words');

/**
 * @route     GET api/ru-words
 * @desc      Topics of the "Слова на китайском" pages with their words (hub page, sitemap)
 * @access    Public
 */
router.get('/', getRuWords);

/**
 * @route     GET api/ru-words/by-cn/:cn
 * @desc      Pages whose main Chinese word is :cn ([{ slug, ru }]), for links from /dictionary
 * @access    Public
 */
router.get('/by-cn/:cn', getRuWordsByCn);

/**
 * @route     GET api/ru-words/:slug
 * @desc      One page: a word with its characters, dictionary examples and audio, or a topic
 * @access    Public
 */
router.get('/:slug', cacheRoute('ru-words', { ttl: TTL.DAY }), getRuWord);

module.exports = router;
