const mongoose = require('mongoose');
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

const uri = 'mongodb://localhost:27017/contactKeeper?retryWrites=true&w=majority';

async function main() {
  try {
    // Connect with better error handling
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // Increase timeout
      connectTimeoutMS: 30000,
      socketTimeoutMS: 30000,
    });

    console.log('Connected to MongoDB');

    const words = await UserWord.find({ wordId: { $exists: false } });
    console.log(`Found ${words.length} words to update`);

    let updated = 0;
    for (const word of words) {
      try {
        const lexiconWord = await DictWord.findOne({
          chinese: word.chinese,
        });

        if (lexiconWord) {
          word.wordId = lexiconWord._id;
          await word.save();
          updated++;
          if (updated % 100 === 0) {
            // Log progress every 100 updates
            console.log(`Updated ${updated}/${words.length} words`);
          }
        }
      } catch (error) {
        console.error(`Error updating word ${word.chinese}:`, error);
        continue; // Continue with next word even if one fails
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

// Run the script
main().catch(console.error);
