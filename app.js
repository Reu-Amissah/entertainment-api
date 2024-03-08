//setup ENV.
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const app = express();
const passport = require("passport");
const session = require("express-session");
const PORT = process.env.PORT || 3000;
const movieController = require("./controllers/MovieController");
const store = new session.MemoryStore();

app.use(
  session({
    secret: process.env.SESSIONSECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24, secure: false },
    store,
  })
);

app.get("/", movieController.get);

app.get("/", (req, res, next) => {
  res.send("Middleware worked");
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
