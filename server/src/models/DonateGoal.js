const mongoose = require("mongoose");

const DonateGoalSchema = new mongoose.Schema({
  donateIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "donate",
    },
  ],
  priority: { type: Number, default: 1, enum: [1, 2, 3] },
  title: { type: String },
  currency: { type: String, default: "RUB" },
  amountNeeded: { type: Number },
  amountCollected: { type: Number, default: 0 },
  desc: { type: String, required: true },
  isFinished: { type: Boolean, default: false }, // when amountNeeded == amountCollected
  isActive: { type: Boolean, default: true },
  notFinancial: { type: Boolean, default: false },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = DonateGoal = mongoose.model("donategoal", DonateGoalSchema);
