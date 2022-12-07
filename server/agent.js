const express = require("express");
const router = express.Router();
const Dialogflow = require("@google-cloud/dialogflow");
const { v4: uuid4 } = require("uuid");
const Path = require("path");

// send text input to chatbot
router.post("/text-input", async (req, res) => {
  const { message } = req.body;
  console.log(req.body);

  // create a new session
  const sessionClient = new Dialogflow.SessionsClient({
    keyFilename: Path.join(__dirname, "./service_account_key.json"),
  });

  const sessionPath = sessionClient.projectAgentSessionPath(
    process.env.PROJECT_ID,
    // uuid4()
    "bot-session" // can't be a random id, otherwise can't detect context!!!
  );

  const contexts = sessionClient.getContext;

  // The dialogflow request object
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        // The query to send to the dialogflow agent
        text: message,
        languageCode: "en-US",
      },
    },
  };

  // Sends data from the agent as a response
  try {
    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult;
    res.status(200).send(result);
  } catch (e) {
    console.log(e);
    res.status(422).send({ e });
  }
});

router.post("/event", async (req, res) => {
  const event = req.body.message;
  console.log(req.body);

  // create a new session
  const sessionClient = new Dialogflow.SessionsClient({
    keyFilename: Path.join(__dirname, "./service_account_key.json"),
  });

  const sessionPath = sessionClient.projectAgentSessionPath(
    process.env.PROJECT_ID,
    // uuid4()
    "bot-session"
  );

  // The dialogflow request object
  const request = {
    session: sessionPath,
    queryInput: {
      event: {
        // The query to send to the dialogflow agent
        name: event,
        languageCode: "en-US",
      },
    },
  };

  // Sends data from the agent as a response
  try {
    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult;
    res.status(200).send(result);
  } catch (e) {
    console.log(e);
    res.status(422).send({ e });
  }
});

// // send voice input to chatbot
// router.post("/voice-input", (req, res) => {
//   res.status(200).send({ data: "VOICE ENDPOINT CONNECTION SUCCESSFUL" });
// });

module.exports = router;
