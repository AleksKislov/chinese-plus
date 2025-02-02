const mongoose = require('mongoose');
const OldHskWord = require('../src/models/Lexicon');
const WordSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  wordId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'lexicon',
  },
  date: {
    type: Date,
    default: Date.now,
  },
  // deprecated fields
  word_id: {
    type: Number,
  },
  level: {
    type: Number,
  },
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

const Word = mongoose.model('word', WordSchema);

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/contactKeeper', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const updateWordCollection = async () => {
  try {
    const words = await Word.find({ wordId: { $exists: false } });

    console.log(words.length);

    for (const word of words) {
      const lexiconWord = await OldHskWord.findOne({
        level: word.level,
        word_id: word.word_id,
      });

      if (lexiconWord) {
        // Update the Word document with the ObjectId from the Lexicon document
        word.wordId = lexiconWord._id;

        // Save the updated Word document back to the database
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
