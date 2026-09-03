const router = require('express').Router();
const { cacheRoute, TTL } = require('../../src/cache');

const { getExamsList, getExamBySlug } = require('../../src/api/services/hsk-exams');

/**
 * @route     GET api/hsk-exams?version=new&lvl=1
 * @desc      List published exams, optionally filtered by HSK version and level
 * @access    Public
 */
router.get('/', cacheRoute('hsk-exams', { ttl: TTL.MEDIUM }), getExamsList);

/**
 * @route     GET api/hsk-exams/:slug
 * @desc      Get one published exam with all sections, questions and media URLs
 * @access    Public
 */
router.get('/:slug', cacheRoute('hsk-exams', { ttl: TTL.MEDIUM }), getExamBySlug);

module.exports = router;
