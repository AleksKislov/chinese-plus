const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");
const { updateOrCreate, fetchReading, encodeJWT } = require("../api/services");

const User = require("../../src/models/User");
/**
 * @route     POST api/users
 * @desc      Register user
 * @access    Public
 */
router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Please enter a password with 6 or more characters").isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, password, email } = req.body;

    try {
      // User exists?
      let user = await User.findOne({ email });
      let namedUser = await User.findOne({ name });

      if (user) return res.status(400).json({ errors: [{ msg: "Такой пользователь уже есть" }] });
      if (namedUser) return res.status(400).json({ errors: [{ msg: "Имя уже занято" }] });

      user = new User({
        name,
        email,
        password,
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();

      // const payload = { user: { id: user.id } };

      // jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
      //   if (err) throw err;
      //   res.json({ token });
      // });
      const token = await encodeJWT(user._id);
      res.json({ token });
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server error");
    }
  }
);

/**
 * @route     POST api/users/read_today
 * @desc      Add number of read chars into DB for this user
 * @access    Private
 */
router.post("/read_today", auth, async (req, res) => {
  let { num, path, ind } = req.body;
  num = parseInt(num);
  ind = parseInt(ind);
  const user_id = req.user.id;

  try {
    const user = await User.findById(user_id);

    let newObj = user.read_today_arr;
    if (newObj[path]) {
      newObj[path].push(ind);
    } else {
      newObj[path] = [ind];
    }

    const updatedUser = await User.findByIdAndUpdate(
      user_id,
      {
        $set: { read_today_num: user.read_today_num + num, read_today_arr: newObj },
      },
      { new: true }
    ).select("-password");

    updateOrCreate({
      user_id,
      have_read: updatedUser.read_today_num,
      daily_goal: updatedUser.daily_reading_goal,
    });

    res.json(updatedUser);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
});

/**
 * @route     POST api/users/unread_today
 * @desc      Remove read paragraph from user DB
 * @access    Private
 */
router.post("/unread_today", auth, async (req, res) => {
  let { num, path, ind } = req.body;
  num = parseInt(num);
  ind = parseInt(ind);
  const user_id = req.user.id;

  try {
    const user = await User.findById(user_id);

    let newObj = user.read_today_arr;
    if (newObj[path]) {
      const indToDelete = newObj[path].indexOf(ind);
      newObj[path].splice(indToDelete, 1);
    } else {
      throw new Error("No such text here!");
    }

    const updatedUser = await User.findByIdAndUpdate(
      user_id,
      {
        $set: { read_today_num: user.read_today_num - num, read_today_arr: newObj },
      },
      { new: true }
    ).select("-password");

    updateOrCreate({
      user_id,
      have_read: updatedUser.read_today_num,
      daily_goal: updatedUser.daily_reading_goal,
    });

    res.json(updatedUser);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
});

/**
 * @route     POST api/users/daily_reading_goal
 * @desc      Set daily reaing goal
 * @access    Private
 */
router.post("/daily_reading_goal/:num", auth, async (req, res) => {
  const daily_reading_goal = parseInt(req.params.num);
  const user_id = req.user.id;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      user_id,
      {
        $set: { daily_reading_goal },
      },
      { new: true }
    ).select("-password");

    updateOrCreate({
      user_id,
      have_read: updatedUser.read_today_num,
      daily_goal: daily_reading_goal,
    });

    res.json(updatedUser);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
});

router.get("/reading_results", auth, async (req, res) => {
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
router.post("/reset_reading", async (req, res) => {
  const token = req.header("special-token");
  if (!(token && token === process.env.SPECIAL_TOKEN)) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    await User.updateMany(
      {},
      {
        $set: { read_today_num: 0, read_today_arr: {} },
      }
    );
    res.json({ ok: "200 OK" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
});

/**
 * set new avatar
 * @route     POST api/users/set_my_avatar
 * @desc      Change avatar
 * @access    Private
 */
router.post("/set_my_avatar", auth, async (req, res) => {
  const userId = req.user.id;
  const { type, background, seed } = req.body;

  if (!seed || !type || !background) {
    return res.status(400).json({ errors: [{ msg: "Не хватает параметров" }] });
  }

  const newAvatar = { type, background, seed };
  try {
    await User.findByIdAndUpdate(userId, { $set: { newAvatar } }, { new: true });

    res.json(newAvatar);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
});

/**
 * @route     GET api/users/:userId
 * @desc      Get one user info
 * @access    Public
 */
router.get("/:userId", async (req, res) => {
  try {
    const profile = await User.findById(req.params.userId).select("name newAvatar _id role");
    if (!profile) return res.status(400).json({ msg: "Profile not found" });
    res.json(profile);
  } catch (err) {
    console.error(err.message);

    if (err.kind == "ObjectId") return res.status(400).json({ msg: "Profile not found" });
    res.status(500).send("Server error");
  }
});

module.exports = router;
