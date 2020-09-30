const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

// keys
const keys = require("./config/keys");

// app
const app = express();

// db
mongoose.connect(keys.mongodbURL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

// enable cross origin requests
app.use(cors());

// body parser
app.use(bodyParser.json());

// routes
// auth routes
require("./routers/authRoutes")(app);
// slack messages route
// require("./routers/slackMessages")(app);

// PORT
const PORT = process.env.PORT || 5000;

// start server
app.listen(PORT, () => {
  console.log("server is up");
});
