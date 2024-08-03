const mongoose = require('mongoose');

const connectDB = async (mongoUrl) => {
  try {
    await mongoose.connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log('Mongo DB connected');
  } catch (err) {
    console.log('MONGO NOT CONNECTED ERROR', err.message);
    process.exit(1);
  }
};

module.exports = { connectDB };
