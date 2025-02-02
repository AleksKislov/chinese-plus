const mongoose = require('mongoose');
// const UserWord = require('../src/models/UserWord');
const DictWord = require('../src/models/Dictionary');

const UserWordSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  wordId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'dictionary',
  },
  date: {
    type: Date,
    default: Date.now,
  },
  // deprecated fields
  chinese: {
    type: String,
  },
  translation: {
    type: String,
  },
  pinyin: {
    type: String,
  },
});

const UserWord = mongoose.model('userword', UserWordSchema);

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/contactKeeper', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const updateWordCollection = async () => {
  try {
    const words = await UserWord.find({ wordId: { $exists: false } });

    console.log(words.length);

    for (const word of words) {
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
