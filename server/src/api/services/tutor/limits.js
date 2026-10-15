const TutorProfile = require('../../../models/TutorProfile');
const { TUTOR } = require('./consts');

const today = () => new Date().toISOString().slice(0, 10);

// one request per user at a time (also keeps the quota updates below race-free)
const inFlight = new Set();

// all users together, per process: caps the API bill if something goes wrong
let globalDay = '';
let globalCount = 0;

function takeGlobalQuota() {
  if (globalDay !== today()) {
    globalDay = today();
    globalCount = 0;
  }
  if (globalCount >= TUTOR.GLOBAL_DAILY_MESSAGES) return false;
  globalCount += 1;
  return true;
}

// atomically counts one message for today; false when the daily limit is reached
async function takeUserQuota(userId) {
  const day = today();
  await TutorProfile.updateOne(
    { user: userId },
    { $setOnInsert: { user: userId } },
    { upsert: true },
  );
  await TutorProfile.updateOne(
    { user: userId, 'usage.day': { $ne: day } },
    { $set: { 'usage.day': day, 'usage.count': 0 } },
  );
  const res = await TutorProfile.updateOne(
    { user: userId, 'usage.count': { $lt: TUTOR.USER_DAILY_MESSAGES } },
    { $inc: { 'usage.count': 1 } },
  );
  return res.modifiedCount === 1;
}

// the reply failed: the message does not count
async function refundQuota(userId) {
  globalCount = Math.max(0, globalCount - 1);
  await TutorProfile.updateOne(
    { user: userId, 'usage.day': today(), 'usage.count': { $gt: 0 } },
    { $inc: { 'usage.count': -1 } },
  );
}

const usageOf = (profile) => ({
  used: profile?.usage?.day === today() ? profile.usage.count : 0,
  limit: TUTOR.USER_DAILY_MESSAGES,
});

module.exports = { inFlight, takeGlobalQuota, takeUserQuota, refundQuota, usageOf };
