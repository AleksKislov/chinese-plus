const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const connectDB = async (mongoUrl) => {
  try {
    await mongoose.connect(mongoUrl);
    console.log('Mongo DB connected');
  } catch (err) {
    console.log('MONGO NOT CONNECTED ERROR', err.message);
    process.exit(1);
  }
};

module.exports = { connectDB };
