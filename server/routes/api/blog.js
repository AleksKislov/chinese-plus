const router = require('express').Router();
const auth = require('../../middleware/auth');
const adminAuth = require('../../middleware/admin-auth');
const upload = require('../../middleware/upload');

const {
  createPost,
  updatePost,
  deletePost,
  getById,
  getAllApproved,
  getByUserId,
  getNotApproved,
  uploadImage,
  likePost,
} = require('../../src/api/services/blog');

/**
 * @method    POST
 * @route     api/blog/upload-image
 * @desc      Upload (and resize) an image for a blog post, returns its public url
 * @access    Private
 */
router.post(
  '/upload-image',
  auth,
  (req, res, next) => {
    upload.single('image')(req, res, (err) => {
      if (err) return res.status(400).json({ msg: err.message });
      next();
    });
  },
  uploadImage,
);

/**
 * @method    POST
 * @route     api/blog/create
 * @desc      Create a blog post
 * @access    Private
 */
router.post('/create', auth, createPost);

/**
 * @method    POST
 * @route     api/blog/update
 * @desc      Update a blog post
 * @access    Private
 */
router.post('/update', auth, updatePost);

/**
 * @method    DELETE
 * @route     api/blog/delete/:id
 * @desc      Delete a blog post
 * @access    Private
 */
router.delete('/delete/:id', auth, deletePost);

/**
 *  @route    PUT api/blog/like/:id
 *  @desc     Like a blog post
 *  @access   Private
 */
router.put('/like/:id', auth, likePost);

/**
 * @route     GET api/blog/not_approved
 * @desc      Get all blog posts pending moderation
 * @access    Private (admin)
 */
router.get('/not_approved', adminAuth, getNotApproved);

/**
 * @route     GET api/blog/user/:userId
 * @desc      Get all blog posts by user who published them
 * @access    Public
 */
router.get('/user/:userId', getByUserId);

/**
 * @route     GET api/blog
 * @desc      Get all approved blog posts
 * @access    Public
 */
router.get('/', getAllApproved);

/**
 * @route     GET api/blog/:id
 * @desc      Get a blog post by id
 * @access    Public
 */
router.get('/:id', getById);

module.exports = router;
