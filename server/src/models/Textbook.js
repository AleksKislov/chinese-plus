const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TextbookSchema = new Schema({
  level: {
    type: String,
    required: true,
  },
  // ind is the index of the topic in the level
  // topic is the name of the topic
  ind: {
    type: Number,
    required: true,
  },
  topic: {
    type: String,
    required: true,
  },
  content: [
    {
      desc: {
        type: String,
        required: true,
      },
      examples: [
        {
          cn: [String],
          py: String,
          ru: String,
          audio: String, // URL to audio file
        },
      ],
    },
  ],
});

// {
// 	"level": "1",
// 	"ind": 0,
// 	"topic": "Личная связка 是 (shì) — «быть»",
// 	"content": [
// 		{
// 			"desc": "Используется для утверждения.",
// 			"examples": [
// 				{
// 					"cn": ["他","是","老师"],
// 					"py": "tā shì lǎoshī",
// 					"ru": "Он учитель.",
// 					"audio": "link"
// 				}
// 			]
// 		}
// 	]
// }

module.exports = Post = mongoose.model('textbook', TextbookSchema);
