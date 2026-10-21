const router = require('express').Router();

const { getNames, getName } = require('../../src/api/services/names');

/**
 * @route     GET api/names
 * @desc      All Russian names with their main Chinese variant (hub page, sitemap)
 * @access    Public
 */
router.get('/', getNames);

/**
 * @route     GET api/names/:slug
 * @desc      One name: variants with character meanings, short forms, prev / next names
 * @access    Public
 */
router.get('/:slug', getName);

module.exports = router;
