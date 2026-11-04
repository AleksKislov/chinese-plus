const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const { updateOrCreate, fetchReading, encodeJWT } = require('../api/services');

const User = require('../../src/models/User');
/**
 * @route     POST api/users
 * @desc      Register user
 * @access    Public
 */
router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, password, email } = req.body;

    try {
      let user = await User.findOne({ email });
      let namedUser = await User.findOne({ name });

      if (user) return res.status(400).json({ errors: [{ msg: 'Такой пользователь уже есть' }] });
      if (namedUser) return res.status(400).json({ errors: [{ msg: 'Имя уже занято' }] });

      user = new User({
        name,
        email,
        password,
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();

      const token = await encodeJWT(user._id);
      res.json({ token });
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server error');
    }
  },
);

// paragraph key is used as a mongo field name: no dots, no $
const READ_PATH_RE = /^\/[\w\-/]{1,300}$/;
const MAX_PARAG_CHARS = 20000;

const parseReadBody = ({ num, path, ind }) => {
  num = parseInt(num);
  ind = parseInt(ind);
  if (!Number.isInteger(num) || num < 0 || num > MAX_PARAG_CHARS) return null;
  if (!Number.isInteger(ind) || ind < 0) return null;
  if (typeof path !== 'string' || !READ_PATH_RE.test(path)) return null;
  return { num, ind, field: `read_today_arr.${path}` };
};

/**
 * Atomic and idempotent: counter changes only if the paragraph state really flips,
 * so double clicks / out of order requests can't inflate or drive it negative
 */
const markParagraph = (isRead) => async (req, res) => {
  const parsed = parseReadBody(req.body);
  if (!parsed) return res.status(400).json({ msg: 'Invalid params' });

  const { num, ind, field } = parsed;
  const user_id = req.user.id;

  try {
    const [filter, update] = isRead
      ? [
          { _id: user_id, [field]: { $ne: ind } },
          { $addToSet: { [field]: ind }, $inc: { read_today_num: num } },
        ]
      : [
          { _id: user_id, [field]: ind },
          { $pull: { [field]: ind }, $inc: { read_today_num: -num } },
        ];

    const changedUser = await User.findOneAndUpdate(filter, update, { new: true }).select(
      '-password',
    );
    if (changedUser && changedUser.read_today_num < 0) {
      await User.updateOne(
        { _id: user_id, read_today_num: { $lt: 0 } },
        { $set: { read_today_num: 0 } },
      );
    }

    // not changed means paragraph is already in requested state -> just return actual data
    const updatedUser =
      changedUser && changedUser.read_today_num >= 0
        ? changedUser
        : await User.findById(user_id).select('-password');
    if (!updatedUser) return res.status(404).json({ msg: 'User not found' });

    if (changedUser) {
      updateOrCreate({
        user_id,
        have_read: updatedUser.read_today_num,
        daily_goal: updatedUser.daily_reading_goal,
      });
    }

    res.json(updatedUser);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
};

/**
 * @route     POST api/users/read_today
 * @desc      Add number of read chars into DB for this user
 * @access    Private
 */
router.post('/read_today', auth, markParagraph(true));

/**
 * @route     POST api/users/unread_today
 * @desc      Remove read paragraph from user DB
 * @access    Private
 */
router.post('/unread_today', auth, markParagraph(false));

/**
 * @route     POST api/users/daily_reading_goal
 * @desc      Set daily reaing goal
 * @access    Private
 */
router.post('/daily_reading_goal/:num', auth, async (req, res) => {
  const daily_reading_goal = parseInt(req.params.num);
  const user_id = req.user.id;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      user_id,
      {
        $set: { daily_reading_goal },
      },
      { new: true },
    ).select('-password');

    updateOrCreate({
      user_id,
      have_read: updatedUser.read_today_num,
      daily_goal: daily_reading_goal,
    });

    res.json(updatedUser);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
});

router.get('/reading_results', auth, async (req, res) => {
  const user_id = req.user.id;
  const arr = await fetchReading(user_id);

  res.json(arr);
});

/**
 * for everyday cron job
 * @route     POST api/users/reset_reading
 * @desc      Reset today reading history
 * @access    Private
 */
router.post('/reset_reading', async (req, res) => {
  const token = req.header('special-token');
  if (!(token && token === process.env.SPECIAL_TOKEN)) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    await User.updateMany(
      {},
      {
        $set: { read_today_num: 0, read_today_arr: {} },
      },
    );
    res.json({ ok: '200 OK' });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
});

/**
 * set new avatar
 * @route     POST api/users/set_my_avatar
 * @desc      Change avatar
 * @access    Private
 */
router.post('/set_my_avatar', auth, async (req, res) => {
  const userId = req.user.id;
  const { type, background, seed } = req.body;

  if (!seed || !type || !background) {
    return res.status(400).json({ errors: [{ msg: 'Не хватает параметров' }] });
  }

  const newAvatar = { type, background, seed };
  try {
    await User.findByIdAndUpdate(userId, { $set: { newAvatar } }, { new: true });

    res.json(newAvatar);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
});

/**
 * set bio
 * @route     POST api/users/set_my_bio
 * @desc      Change "about the author" text shown on the user's blog posts
 * @access    Private
 */
router.post('/set_my_bio', auth, async (req, res) => {
  const userId = req.user.id;
  let bio = (req.body.bio || '').trim();

  if (bio.length > 600) {
    return res.status(400).json({ errors: [{ msg: 'Слишком длинный текст' }] });
  }
  if (bio) bio = bio[0].toUpperCase() + bio.slice(1);

  try {
    await User.findByIdAndUpdate(userId, { $set: { bio } }, { new: true });

    res.json({ bio });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
});

/**
 * @route     GET api/users/:userId
 * @desc      Get one user info
 * @access    Public
 */
router.get('/:userId', async (req, res) => {
  try {
    const profile = await User.findById(req.params.userId).select('name newAvatar _id role');
    if (!profile) return res.status(400).json({ msg: 'Profile not found' });
    res.json(profile);
  } catch (err) {
    console.error(err.message);

    if (err.kind == 'ObjectId') return res.status(400).json({ msg: 'Profile not found' });
    res.status(500).send('Server error');
  }
});

module.exports = router;
