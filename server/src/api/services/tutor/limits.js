const TutorProfile = require('../../../models/TutorProfile');
const { TUTOR } = require('./consts');

const today = () => new Date().toISOString().slice(0, 10);

// one request per user at a time (also keeps the quota updates below race-free)
const inFlight = new Set();
const ttsInFlight = new Set();

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

// atomically counts one use for today; false when the daily limit is reached.
// field: 'count' (messages) | 'ttsCount' (generated audio clips)
async function takeDailyQuota(userId, field, limit) {
  const day = today();
  await TutorProfile.updateOne(
    { user: userId },
    { $setOnInsert: { user: userId } },
    { upsert: true },
  );
  await TutorProfile.updateOne(
    { user: userId, 'usage.day': { $ne: day } },
    { $set: { 'usage.day': day, 'usage.count': 0, 'usage.ttsCount': 0 } },
  );
  const res = await TutorProfile.updateOne(
    { user: userId, [`usage.${field}`]: { $not: { $gte: limit } } }, // missing counts as 0
    { $inc: { [`usage.${field}`]: 1 } },
  );
  return res.modifiedCount === 1;
}

const takeUserQuota = (userId) => takeDailyQuota(userId, 'count', TUTOR.USER_DAILY_MESSAGES);
const takeTtsQuota = (userId) => takeDailyQuota(userId, 'ttsCount', TUTOR.USER_DAILY_TTS);

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

module.exports = {
  inFlight,
  ttsInFlight,
  takeGlobalQuota,
  takeUserQuota,
  takeTtsQuota,
  refundQuota,
  usageOf,
};
