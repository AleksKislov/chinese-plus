const Sequelize = require("sequelize");
const { DataTypes } = Sequelize;
const sequelize = require("../sql_db/connection");

module.exports = sequelize.define("day", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  user_id: DataTypes.STRING(30),
  have_read: DataTypes.INTEGER,
  daily_goal: DataTypes.INTEGER,
  createdAt: DataTypes.DATEONLY,
  updatedAt: DataTypes.DATEONLY
});
