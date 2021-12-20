const Day = require("../../../src/sql_models/Day");
const { Op } = require("sequelize");

const errHandler = err => console.log("SQL Error: ", err);

/**
 * @param {object} newData  - { user_id<string>, have_read<int>, daily_goal<int> }
 */
const updateOrCreate = async newData => {
  // First try to find the record
  const { user_id } = newData;
  const date = new Date();
  const createdAt = date.toISOString().slice(0, 10);
  const foundDay = await Day.findOne({ where: { user_id, createdAt } }).catch(errHandler);

  if (!foundDay) {
    // not found, create a new one
    const day = await Day.create(newData).catch(errHandler);
    return { day, created: true };
  }

  // Found and updated it
  const day = await Day.update(newData, {
    where: { user_id, createdAt }
  }).catch(errHandler);
  return { day, created: false };
};

const fetchReading = async user_id => {
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 1);
  const currentDate = new Date();

  const where = {
    user_id,
    createdAt: {
      [Op.between]: [startDate, currentDate]
    }
  };

  return await Day.findAll({ where }).catch(errHandler);
};

module.exports = { updateOrCreate, fetchReading };
