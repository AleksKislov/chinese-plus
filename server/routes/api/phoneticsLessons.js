const router = require('express').Router();
const auth = require('../../middleware/auth');

const { likeVideoLesson } = require('../../src/api/services/videos');

/**
 *  @route    PUT api/phoneticsLessons/like/:id
 *  @desc     Like a video lesson on phonetics
 *  @access   Private
 */
router.put('/like/:id', auth, likeVideoLesson);

module.exports = router;
