const Day = require('../../../src/models/Day');
const errHandler = (err) => console.log('Reading day error: ', err);

/**
 * @param {object} newData  - { user_id<string>, have_read<int>, daily_goal<int> }
 */
const updateOrCreate = async (newData) => {
  const { user_id, have_read, daily_goal } = newData;
  const createdAt = new Date().toISOString().slice(0, 10);
  const foundDay = await Day.findOne({
    user_id,
    createdAt: { $gte: createdAt },
  }).catch(errHandler);

  if (!foundDay) return { day: await new Day(newData).save(), created: true };

  const day = await Day.findByIdAndUpdate(
    foundDay._id,
    {
      $set: { have_read, daily_goal },
    },
    { new: true },
  );
  return { day, created: false };
};

const fetchReading = async (user_id) => {
  let startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 1);
  const currentDate = new Date();

  const where = {
    user_id,
    createdAt: {
      $gte: startDate,
      $lt: currentDate,
    },
  };

  return await Day.find(where).catch(errHandler);
};

module.exports = { updateOrCreate, fetchReading };
