const router = require('express').Router();
const adminAuth = require('../../middleware/admin-auth');

const { getSaved, getOne, saveOne, deleteOne } = require('../../src/api/services/handwriting');

// stylus recordings of characters for an animated handwriting font (FE page /admin/handwriting/)
router.use(adminAuth);

/**
 * @route     GET api/handwriting?font=mini-yingbi-xingshu
 * @desc      Characters already saved for the font
 * @access    Admin
 */
router.get('/', getSaved);

/**
 * @route     GET api/handwriting/:font/:char
 * @desc      One saved character with its pen strokes
 * @access    Admin
 */
router.get('/:font/:char', getOne);

/**
 * @route     PUT api/handwriting/:font/:char
 * @desc      Save the pen strokes of a character { strokes, size, pen }, replacing an older one
 * @access    Admin
 */
router.put('/:font/:char', saveOne);

/**
 * @route     DELETE api/handwriting/:font/:char
 * @desc      Delete a saved character
 * @access    Admin
 */
router.delete('/:font/:char', deleteOne);

module.exports = router;
