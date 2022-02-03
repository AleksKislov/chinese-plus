const textToSpeech = require("@google-cloud/text-to-speech");
const fs = require("fs");
const util = require("util");

const client = new textToSpeech.TextToSpeechClient();

const writeMP3 = async (word) => {
  const { id, cn, lvl } = word;
  const outputFile = `./audio/band${lvl}/${id}.mp3`;

  const request = {
    input: { text: cn },
    voice: { languageCode: "zh", ssmlGender: "FEMALE" },
    audioConfig: { audioEncoding: "MP3" },
  };

  try {
    const [response] = await client.synthesizeSpeech(request);
    const writeFile = util.promisify(fs.writeFile);
    await writeFile(outputFile, response.audioContent, "binary");
    console.log(`Audio content written to file: ${outputFile}`);
  } catch (err) {
    console.log("ошибочка", err);
  }
};

module.exports = {
  writeMP3,
};
