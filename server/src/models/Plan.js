const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PlanSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  task_type: {
    type: Number,
    required: true
  }, // backlog, todo, in progress or done
  text: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Plan = mongoose.model("plan", PlanSchema);
