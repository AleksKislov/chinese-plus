const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const User = require('../../src/models/User');
const Comment = require('../../src/models/Comment');
const Post = require('../../src/models/Post');
const Text = require('../../src/models/Text');
const Video = require('../../src/models/Video');
const { Notify } = require('../../src/api/services/_misc');
const { shortUserInfoFields } = require('../../src/api/consts');
const VideoLesson = require('../../src/models/VideoLesson');
const mongoose = require('mongoose');
const BookPage = require('../../src/models/BookPage');

const COMMENT_DESTINATION = {
  post: 'post',
  video: 'video',
  text: 'text',
  book: 'book_page',
  phoneticsLesson: 'phoneticsLesson',
  charactersLesson: 'charactersLesson',
};

// @route   POST api/comments?where=...&id=
// @desc    Create a comment
// access   Private
router.post('/', [auth, [check('text', 'Нужен текст').not().isEmpty()]], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const where = req.query.where;
  const id = req.query.id;
  const { path, addressees, commentIdToReply } = req.body;

  let addressees_id;
  if (addressees) {
    addressees_id = addressees.map((x) => {
      return { id: x.id, seenIt: false };
    });
  }

  if (commentIdToReply) {
    const includesUserId = addressees_id.filter((x) => x.id === commentIdToReply.userId);
    if (includesUserId.length === 0)
      addressees_id.push({ id: commentIdToReply.userId, seenIt: false });
  }

  try {
    const [user, destination] = await Promise.all([
      User.findById(req.user.id).select('-password'),
      getCommentDestinationById(where, id),
    ]);

    const newComment = new Comment({
      text: req.body.text,
      user: req.user.id,
      post_id: id,
      destination: where,
      addressees: addressees_id,
      commentIdToReply,
      path,
    });

    const comment = await newComment.save();
    destination.comments_id.unshift(comment._id);
    await destination.save();

    Notify.admin(`New comment from ${user.name} in /${where}s: ${req.body.text}`);

    res.json(destination.comments_id);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

async function getCommentDestinationById(where, id) {
  if (where === COMMENT_DESTINATION.post) {
    return Post.findById(id);
  }
  if (where === COMMENT_DESTINATION.text) {
    return Text.findById(id);
  }
  if (where === COMMENT_DESTINATION.video) {
    return Video.findById(id);
  }
  if (where === COMMENT_DESTINATION.book) {
    return BookPage.findById(id).populate('book', ['_id', 'title']);
  }

  if ([COMMENT_DESTINATION.phoneticsLesson, COMMENT_DESTINATION.charactersLesson].includes(where)) {
    return VideoLesson.findById(id);
  }
  throw new Error('No destination for the comment!');
}

router.post('/edit', auth, async (req, res) => {
  const { text, id } = req.body;
  try {
    await Comment.findByIdAndUpdate(id, { $set: { text } }, { new: true });

    res.json({ status: 'OK 200' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

router.get('/to_me/:seen_it', auth, async (req, res) => {
  const { seen_it } = req.params;

  let comments;
  try {
    if (seen_it === 'false') {
      comments = await Comment.find({
        addressees: { $elemMatch: { id: req.user.id, seenIt: false } },
      })
        .populate('user', shortUserInfoFields)
        .select('-avatar -name')
        .sort({ date: -1 });
    } else {
      comments = await Comment.find({
        'addressees.id': req.user.id,
        'addressees.seenIt': true,
      })
        .sort({ date: -1 })
        .populate('user', shortUserInfoFields)
        .select('-avatar -name')
        .limit(30);
    }

    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

async function getCommentForBookPage(pageInd, chapterId) {
  const found = await BookPage.find({ belongsTo: chapterId, ind: pageInd }).populate('book', [
    '_id',
    'title',
  ]);
  return found.length > 0 ? found[0] : null;
}
// @route   GET api/comments?where=...&id=
// @desc    Get all comments for the given content page
// access   Public
router.get('/', async (req, res) => {
  const { where, id, page_ind, chapter_id } = req.query;

  const isBook = where === COMMENT_DESTINATION.book;

  try {
    const destination =
      isBook && chapter_id
        ? await getCommentForBookPage(page_ind, chapter_id)
        : await getCommentDestinationById(where, id);

    if (!destination) {
      return res.status(404).json({ msg: 'Destination not found' });
    }

    const comments = await Comment.find({
      _id: { $in: destination.comments_id },
    })
      .populate('user', shortUserInfoFields)
      .select('-avatar -name')
      .sort({ date: 1 });

    if (isBook) {
      const bookComments = comments.map((comment) => {
        return {
          ...comment.toObject(),
          pageInfo: {
            book: destination.book.toObject(),
            belongsTo: destination.belongsTo,
            ind: destination.ind,
          },
        };
      });
      return res.json(bookComments);
    }

    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

/**
 *  @route    PUT api/comments/like/:id
 *  @desc     Like a comment
 *  @access   Private
 */
router.put('/like/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const post = await Comment.findById(req.params.id);

    // check if already liked
    if (post.likes.filter((like) => like.user.toString() === req.user.id).length > 0) {
      post.likes = post.likes.filter((like) => like.user.toString() !== req.user.id);
    } else {
      post.likes.unshift({ user: req.user.id, name: user.name });
    }

    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

/**
 * @route     GET api/comments/last
 * @desc      Get last 10 comments
 * @access    Public
 */
router.get('/last', async (req, res) => {
  try {
    const rawComments = await Comment.find()
      .sort({ date: -1 })
      .populate('user', shortUserInfoFields)
      .select('-avatar -name')
      .limit(10);

    // if comments include book_page comments, add page info
    const commentsWithPageInfo = await Promise.all(
      rawComments.map(async (comment) => {
        if (comment.destination === COMMENT_DESTINATION.book) {
          const bookPage = await BookPage.findById(comment.post_id).populate('book', [
            '_id',
            'title',
          ]);
          return {
            ...comment.toObject(),
            pageInfo: {
              book: bookPage.book.toObject(),
              belongsTo: bookPage.belongsTo,
              ind: bookPage.ind,
            },
          };
        }
        return comment;
      }),
    );
    const comments = commentsWithPageInfo.filter((comment) => comment !== null);

    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

router.post('/mark_mentions_as_seen', auth, async (req, res) => {
  try {
    await Comment.updateMany(
      { 'addressees.id': req.user.id },
      { 'addressees.$.seenIt': true },
      { new: true },
    );
    res.send('ok');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

/**
 * @route     GET api/comments/liked
 * @desc      Get last 20 comments user liked
 * @access    Private
 */
router.get('/liked', auth, async (req, res) => {
  const limit = +req.query.limit || 20;
  const userId = mongoose.Types.ObjectId(req.user.id);
  try {
    const ids = await Comment.aggregate([
      { $match: { 'likes.user': userId } },
      { $unwind: '$likes' },
      { $match: { 'likes.user': userId } },
      { $sort: { 'likes._id': -1 } },
      { $limit: limit },
      { $project: { _id: 1 } },
    ]);

    const commentIds = ids.map((x) => x._id);
    const comments = await Comment.find({ _id: { $in: commentIds } })
      .populate('user', shortUserInfoFields)
      .select('-avatar -name')
      .lean();

    const reorderedComments = commentIds.map((commentId) =>
      comments.find((comment) => comment._id.equals(commentId)),
    );

    res.json(reorderedComments);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
