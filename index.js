const express = require("express");
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");
const passport = require("passport");
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

// passport
require("./services/passport-slack");

// enable cross origin requests
app.use(cors());

// body parser
app.use(bodyParser.json());

// using cookies
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 68 * 1000,
    keys: [keys.cookieKey],
  })
);

// initializing passport
app.use(passport.initialize());
// making passport know to use cookies
app.use(passport.session());

// routes
// auth routes
require("./routers/authRoutes")(app);
// slack messages route
require("./routers/slackMessages")(app);

// PORT
const PORT = process.env.PORT || 5000;

// start server
app.listen(PORT, () => {
  console.log("server is up");
});
