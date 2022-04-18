const router = require("express").Router();
const dialogflow = require("@google-cloud/dialogflow");
const uuid = require("uuid");

router.get("/", async (req, res) => {
  async function runSample(text = "你好", projectId = process.env.GCLOUD_PROJECT_ID) {
    // A unique identifier for the given session
    const sessionId = uuid.v4();

    // Create a new session
    const sessionClient = new dialogflow.SessionsClient({
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    });
    const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);

    // The text query request.
    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          // The query to send to the dialogflow agent
          // text: "你好",
          text,
          // The language used by the client (en-US)
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
    // console.log("Detected intent");
    const result = responses[0].queryResult;
    // console.log(`  Query: ${result.queryText}`);
    // console.log(`  Response: ${result.fulfillmentText}`);
    // if (result.intent) {
    //   console.log(`  Intent: ${result.intent.displayName}`);
    // } else {
    //   console.log(`  No intent matched.`);
    // }
    return result.fulfillmentText;
  }

  const text = req.query.text;

  runSample(text)
    .then((data) => {
      res.json({ response: data });
    })
    .catch((e) => console.log(e));
});

module.exports = router;
