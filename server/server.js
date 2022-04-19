const express = require("express");
const connectDB = require("./src/mongo_db/db");
const bodyParser = require("body-parser");
const path = require("path");
const morgan = require("morgan");
const cookieSession = require("cookie-session");
const compression = require("compression");

const isDevelopment = process.env.NODE_ENV === "development";

require("dotenv").config({ path: ".env.prod" });
const { passport } = require("./src/auth");

const app = express();
connectDB();

// mysql db
require("./src/sql_db/connection");

// Init Middleware
morgan.token("body", (req, res) => JSON.stringify(req.body, null, 2));
if (isDevelopment) {
  app.use(
    morgan(
      ":method :url :status :response-time ms - :res[content-length] :body - :req[content-length]"
    )
  );
}

app.use(compression());
// app.use(express.json({ extended: false }));
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true, parameterLimit: 50000 }));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000, // milliseconds of a day
    keys: [process.env.COOKIE_SECRET],
  })
);
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

// Serve static files
if (!isDevelopment) {
  // Set Static folder
  app.use(express.static(path.join(__dirname, "build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is up on port ${PORT}. Is development MODE: ${isDevelopment}`);
});
