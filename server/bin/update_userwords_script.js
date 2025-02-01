const mongoose = require('mongoose');
const UserWord = require('../src/models/UserWord');
const DictWord = require('../src/models/Dictionary');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/contactKeeper', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const updateWordCollection = async () => {
  try {
    const words = await UserWord.find();

    console.log(words.length);

    for (const word of words.slice(0, 10)) {
      const lexiconWord = await DictWord.findOne({
        chinese: word.chinese,
      });

      if (lexiconWord) {
        word.wordId = lexiconWord._id;
        await word.save();
      }
    }

    console.log('Word collection updated successfully');
  } catch (error) {
    console.error('Error updating Word collection:', error);
  } finally {
    // Close the database connection
    mongoose.connection.close();
  }
};

updateWordCollection();
