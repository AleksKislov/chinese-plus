const mongoose = require('mongoose');
const Word = require('../src/models/Word');
const OldHskWord = require('../src/models/Lexicon');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/contactKeeper', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const updateWordCollection = async () => {
  try {
    const words = await Word.find();

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
