const router = require('express').Router();
const { cacheRoute, TTL } = require('../../src/cache');
const adminAuth = require('../../middleware/admin-auth');
const optionalAdminAuth = require('../../middleware/optional-admin-auth');
const imageUpload = require('../../middleware/upload');

const {
  getExamsList,
  getExamBySlug,
  setApproved,
  uploadHskExamImage,
  deleteHskExamImage,
} = require('../../src/api/services/hsk-exams');

/**
 * @route     GET api/hsk-exams?version=new&lvl=1
 * @desc      List exams, optionally filtered by HSK version and level.
 *            Admins (optionalAdminAuth) see every exam; everyone else only
 *            sees isApproved: true.
 * @access    Public
 */
router.get(
  '/',
  optionalAdminAuth,
  // An admin's response includes unapproved exams - never let it get cached
  // and served back to a non-admin visitor under the same URL.
  cacheRoute('hsk-exams', { ttl: TTL.MEDIUM, shouldCache: (req) => !req.isAdmin }),
  getExamsList
);

/**
 * @route     PUT api/hsk-exams/:slug/approve
 * @desc      Publish or unpublish an exam
 * @access    Private (admin)
 */
router.put('/:slug/approve', adminAuth, setApproved);

/**
 * @method    POST
 * @route     api/hsk-exams/:slug/image
 * @desc      Upload/replace one picture on an exam (a question, an option, or
 *            a part's shared bank entry)
 * @access    Private (admin)
 */
router.post(
  '/:slug/image',
  adminAuth,
  (req, res, next) => {
    imageUpload.single('image')(req, res, (err) => {
      if (err) return res.status(400).json({ msg: err.message });
      next();
    });
  },
  uploadHskExamImage
);

/**
 * @route     DELETE api/hsk-exams/:slug/image
 * @desc      Remove a picture uploaded via POST .../image, falling back to
 *            text-only for that question/option/bank entry
 * @access    Private (admin)
 */
router.delete('/:slug/image', adminAuth, deleteHskExamImage);

/**
 * @route     GET api/hsk-exams/:slug
 * @desc      Get one exam with all sections, questions and media URLs.
 *            Admins can open an unapproved exam to review/finish it; a 404
 *            hides it from everyone else.
 * @access    Public
 */
router.get(
  '/:slug',
  optionalAdminAuth,
  cacheRoute('hsk-exams', { ttl: TTL.MEDIUM, shouldCache: (req) => !req.isAdmin }),
  getExamBySlug
);

module.exports = router;
