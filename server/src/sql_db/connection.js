const Sequelize = require("sequelize");
const db_name = process.env.GOOGLE_DB_NAME;
const db_user = process.env.GOOGLE_DB_USER;
const db_pass = process.env.GOOGLE_DB_PASSWORD;
const db_host = process.env.GOOGLE_DB_HOST;

const sequelize = new Sequelize(db_name, db_user, db_pass, {
  host: db_host,
  dialect: "mysql",
  pool: {
    max: 15,
    min: 5,
    idle: 20000,
    evict: 15000,
    acquire: 30000
  }
});
module.exports = sequelize;
