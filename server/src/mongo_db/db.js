const mongoose = require("mongoose");

const connectDB = async () => {
  const MONGO_DB = process.env.LOCAL_DB ? process.env.MONGO_DB_LOCAL : process.env.MONGO_DB;
  try {
    await mongoose.connect(MONGO_DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log("Mongo DB connected");
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
