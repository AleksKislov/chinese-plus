const router = require('express').Router();
const { cacheRoute, TTL } = require('../../src/cache');

const { getHskChars, getChars } = require('../../src/api/services/writing-sheets');

/**
 * @route     GET api/writing-sheets/hsk?version=3&level=1
 * @desc      New characters of an HSK level with pinyin and a short meaning (writing sheets)
 * @access    Public
 */
router.get('/hsk', cacheRoute('writing-sheets', { ttl: TTL.DAY }), getHskChars);

/**
 * @route     GET api/writing-sheets/chars?chars=你好
 * @desc      Pinyin and a short meaning for any characters (writing sheets)
 * @access    Public
 */
router.get('/chars', cacheRoute('writing-sheets', { ttl: TTL.DAY }), getChars);

module.exports = router;
