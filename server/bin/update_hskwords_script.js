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

const uri = 'mongodb://127.0.0.1:27017/contactKeeper?retryWrites=true&w=majority';

async function main() {
  try {
    // Connect with better error handling
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 30000,
    });

    console.log('Connected to MongoDB');

    const words = await Word.find({ wordId: { $exists: false } });
    console.log(`Found ${words.length} words to update`);

    let updated = 0;
    for (const word of words) {
      try {
        const lexiconWord = await OldHskWord.findOne({
          level: word.level,
          word_id: word.word_id,
        });

        if (lexiconWord) {
          word.wordId = lexiconWord._id;
          await word.save();
          updated++;
          if (updated % 100 === 0) {
            console.log(`Updated ${updated}/${words.length} words`);
          }
        }
      } catch (error) {
        console.error(`Error updating word (ID: ${word.word_id}, Level: ${word.level}):`, error);
        continue;
      }
    }

    console.log(`Successfully updated ${updated} words`);
  } catch (error) {
    console.error('Script error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

main().catch(console.error);
