const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const User = require("../../src/models/User");
const Plan = require("../../src/models/Plan");

/**
 * @route     POST api/plans
 * @desc      Create a plan
 * @access    Private
 */
router.post(
  "/",
  [
    auth,
    [
      check("text", "Нужен текст").not().isEmpty(),
      check("task_type", "Нужен тип задачи").not().isEmpty(),
      check("title", "Нужен заголовок").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { text, title, task_type } = req.body;

      const newPlan = new Plan({
        text,
        title,
        task_type,
      });

      const plan = await newPlan.save();

      res.json(plan);
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  }
);

/**
 * @route     GET api/plans
 * @desc      Get all tasks
 * @access    Public
 */
router.get("/", async (req, res) => {
  try {
    const plans = await Plan.find().sort({ date: -1 });

    res.json(plans);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
