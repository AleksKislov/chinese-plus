const express = require("express");
const connectDB = require("./src/mongo_db/db");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const compression = require("compression");
const cors = require("cors");

const isDevelopment = process.env.NODE_ENV === "development";

require("dotenv").config({ path: isDevelopment ? ".env.dev" : ".env.prod" });
const { passport } = require("./src/auth");

const app = express();
connectDB();

// Init Middleware
if (isDevelopment) {
  morgan.token("body", (req, res) => JSON.stringify(req.body, null, 2));
  app.use(
    morgan(
      ":method :url :status :response-time ms - :res[content-length] :body - :req[content-length]"
    )
  );
}

app.use(cors({ origin: "*" }));
app.use(compression());
app.use(bodyParser.json({ limit: "10mb" }));
// app.use(bodyParser.urlencoded({ limit: "10mb", extended: true, parameterLimit: 50000 }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(passport.initialize());
app.use(passport.session());

// api routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/posts", require("./routes/api/posts"));
app.use("/api/plans", require("./routes/api/plans"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/lexicon", require("./routes/api/lexicon"));
app.use("/api/newhskwords", require("./routes/api/newhskwords"));
app.use("/api/words", require("./routes/api/words"));
app.use("/api/userwords", require("./routes/api/userwords"));
app.use("/api/dictionary", require("./routes/api/dictionary"));
app.use("/api/comments", require("./routes/api/comments"));
app.use("/api/texts", require("./routes/api/texts"));
app.use("/api/books", require("./routes/api/books"));
app.use("/api/translation", require("./routes/api/translation"));
app.use("/api/notices", require("./routes/api/notices"));
app.use("/api/videos", require("./routes/api/videos"));

// glcoud services routes
app.use("/gcloud/dialogflow", require("./routes/gcloud/dialogflow"));
app.use("/gcloud/youtube", require("./routes/gcloud/youtube"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is up on port ${PORT}. Is development MODE: ${isDevelopment}`);
});
