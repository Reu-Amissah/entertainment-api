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
app.use(cors(corsOptions));

app.use(express.json());

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
      return done(null, null, { message: "Incorrect username." });
    }
    if (user.password !== password) {
      return done(null, null, { message: "Incorrect password." });
    }
    return done(null, user, { message: "Authentication successful" });
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  const user = usersDB.users.find((u) => u.id === id);
  done(null, user);
});

app.post("/login", (req, res, next) => {
  passport.authenticate("local", function (err, user, info, status) {
    const response = { user, ...info };
    if (!user) {
      console.log({ user }, "user doesn't exist");
      return res.json(response);
    }

    return res.json(response).status(status);
  })(req, res, next);
});

const getNewId = (array) => {
  if (array.length > 0) {
    return array[array.length - 1].id + 1;
  } else {
    return 1;
  }
};

function createUser(user) {
  return new Promise((resolve, reject) => {
    const newUser = {
      id: getNewId(usersDB.users),
      ...user,
    };
    usersDB.users = [...usersDB.users, newUser];
    resolve(newUser);
  });
}
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const user = await createUser({ username, password });
  if (user) {
    res.send({ message: "created User Succes" });
  } else {
    res.send({ message: "create user Unsuccessul" }).status("401");
  }
});

app.get("/logout", (req, res) => {
  req.logout();
  res.send("Logged out user Success");
});

app.get("/", movieController.get);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
