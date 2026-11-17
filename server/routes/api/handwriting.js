const router = require('express').Router();
const adminAuth = require('../../middleware/admin-auth');

const {
  getSaved,
  getOne,
  saveOne,
  deleteOne,
  getSettings,
  saveSettings,
  deleteSettings,
} = require('../../src/api/services/handwriting');

// stylus recordings of characters for an animated handwriting font (FE page /admin/handwriting/)
router.use(adminAuth);

/**
 * @route     GET api/handwriting?font=mini-yingbi-xingshu
 * @desc      Characters already saved for the font
 * @access    Admin
 */
router.get('/', getSaved);

// /settings/:font before /:font/:char, which would take 'settings' for a font id

/**
 * @route     GET api/handwriting/settings/:font
 * @desc      The page settings saved for the font (line width, brush...), null if none
 * @access    Admin
 */
router.get('/settings/:font', getSettings);

/**
 * @route     PUT api/handwriting/settings/:font
 * @desc      Save the page settings for the font { settings }, replacing the earlier ones
 * @access    Admin
 */
router.put('/settings/:font', saveSettings);

/**
 * @route     DELETE api/handwriting/settings/:font
 * @desc      Delete the settings saved for the font
 * @access    Admin
 */
router.delete('/settings/:font', deleteSettings);

/**
 * @route     GET api/handwriting/:font/:char
 * @desc      One saved character with its pen strokes
 * @access    Admin
 */
router.get('/:font/:char', getOne);

/**
 * @route     PUT api/handwriting/:font/:char
 * @desc      Save the pen strokes of a character { strokes, size, pen, style }, replacing an older one
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
