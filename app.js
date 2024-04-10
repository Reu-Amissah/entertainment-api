//setup ENV.
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const app = express();
const cors = require("cors");

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const session = require("express-session");
const PORT = process.env.PORT || 3000;
const movieController = require("./controllers/MovieController");
const store = new session.MemoryStore();

const usersDB = require("./models/users.json");

const corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
// app.use(cors(corsOptions));

app.use(
  session({
    secret: process.env.SESSIONSECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24, secure: false },
    store,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new LocalStrategy(function (username, password, done) {
    const user = usersDB.users.find((user) => user.username === username);
    if (!user) {
    return done(null, false, { message: 'Incorrect username.' });
    }
    if (user.password !== password) {
    return done(null, false, { message: 'Incorrect password.' });
    }
    return done(null, user);
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
  });
 passport.deserializeUser((id, done) => {
  const user = users.find(u => u.id === id);
  done(null, user);
  });

app.post("/login", passport.authenticate("local"), (req, res) => {
  res.json({ msg: "Login successful" });
});

app.get("/", movieController.get);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
