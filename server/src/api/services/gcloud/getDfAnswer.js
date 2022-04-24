const dialogflow = require("@google-cloud/dialogflow");
const uuid = require("uuid");

async function getDfAnswer(req, res) {
  const data = await dfQuery(req.query.text);
  res.json({ response: data });
}

async function dfQuery(text = "你好") {
  const sessionId = uuid.v4();

  // Create a new session
  const sessionClient = new dialogflow.SessionsClient({
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  });

  const sessionPath = sessionClient.projectAgentSessionPath(
    process.env.GCLOUD_PROJECT_ID,
    sessionId
  );

  // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text,
        languageCode: "zn-CN",
      },
    },
  };

  // Send request and log result
  let responses;
  try {
    responses = await sessionClient.detectIntent(request);
  } catch (error) {
    console.error(error);
  }
  return responses[0].queryResult.fulfillmentText;
}

module.exports = { getDfAnswer };
