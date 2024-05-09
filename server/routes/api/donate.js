const axios = require("axios");
const router = require("express").Router();

const Donate = require("../../src/models/Donate");
const DonateGoal = require("../../src/models/DonateGoal");
const { shortUserInfoFields } = require("../../src/api/consts");

const DONATE_LABEL_START = "supportChinesePlus";
const LABEL_SEPARATOR = "#";

router.post("/history", async (req, res) => {
  const records = +req.query.records || 30;
  try {
    const [yooMoneyDonates, mongoDonates, oldGoals] = await Promise.all([
      getYooMoneyDonates(records),
      getMongoDonates(),
      getGoals(),
    ]);

    const higherPriorityGoal = oldGoals.filter((x) => !x.isFinished)[0];

    const newDonates = getNewDonates(yooMoneyDonates, mongoDonates);
    // console.log({ newDonates, yooMoneyDonates, mongoDonates });

    let insertedDonates = [];
    if (newDonates.length) {
      insertedDonates = await Donate.insertMany(newDonates);
    }

    // @todo currently works properly only for one donate at a time
    for (const don of insertedDonates) {
      const goal = higherPriorityGoal.amountNeeded;
      const currAmount = higherPriorityGoal.amountCollected;
      const newAmount = currAmount + don.amount;

      const args = [
        { _id: higherPriorityGoal._id },
        { $push: { donateIds: don._id }, $set: { amountCollected: newAmount } },
        { new: true },
      ];
      if (goal <= newAmount) {
        args[1] = {
          $push: { donateIds: don._id },
          $set: { amountCollected: newAmount, isFinished: true },
        };
      }
      await DonateGoal.updateOne(...args);
    }

    const [allDonates, goals] = await Promise.all([getMongoDonates(true), getGoals()]);

    res.json({ donates: allDonates, goals });
  } catch (err) {
    res.status(500).json({ err });
  }
});

router.get("/goals", async (_req, res) => {
  try {
    const [[financialGoal], notFinancialGoal] = await Promise.all([
      getGoals(1, true),
      getNotFinancialGoal(),
    ]);

    res.json([financialGoal, notFinancialGoal]);
  } catch (err) {
    res.status(500).json({ err });
  }
});

async function getGoals(lim = 0, onlyNotFinished = false) {
  const limit = {};
  if (lim) limit.limit = lim;
  const filters = { isActive: true };
  if (onlyNotFinished) filters.isFinished = false;
  return DonateGoal.find(filters, undefined, limit)
    .select("-donateIds -isActive")
    .sort({ isFinished: 1, priority: -1 });
}

async function getNotFinancialGoal() {
  const [notFinancialGoals, tgData] = await Promise.all([
    DonateGoal.find({ isActive: true, notFinancial: true }, undefined, { limit: 1 }),
    axios.get(process.env.TELEGRAM_MEMBERS_NUM_URL),
  ]);

  notFinancialGoals[0].amountCollected = tgData.data.result;
  return notFinancialGoals[0];
}

function getNewDonates(yooMoneyDonates, mongoDonates) {
  return yooMoneyDonates
    .filter((newDonate) => mongoDonates.every((x) => x.operationId !== newDonate.operation_id))
    .map((newDonate) => {
      const user = newDonate.label.split(LABEL_SEPARATOR)[1];
      return {
        userId: user || null,
        operationId: newDonate.operation_id,
        amount: newDonate.amount,
        label: newDonate.label,
        currency: newDonate.amount_currency,
        datetime: newDonate.datetime,
      };
    });
}

async function getYooMoneyDonates(records = 30) {
  const headers = {
    Authorization: `Bearer ${process.env.YOO_MONEY_TOKEN}`,
    "Content-Type": "application/x-www-form-urlencoded",
  };

  const historyUrl = "https://yoomoney.ru/api/operation-history";
  const params = { records /* type: "deposition" */ };

  const { data } = await axios.post(historyUrl, params, { headers });

  return data.operations.filter(
    (x) => x.direction === "in" && x.status === "success" && x.label?.includes(DONATE_LABEL_START)
  );
}

async function getMongoDonates(withPopulate) {
  if (!withPopulate) return Donate.find().sort({ createdAt: -1 });
  return Donate.find()
    .select("-label -datetime -operationId")
    .populate("userId", shortUserInfoFields)
    .sort({ createdAt: -1 });
}

module.exports = router;
