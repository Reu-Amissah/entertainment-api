const express = require("express");
const app = express();
const passport = require('passport');
const session = require('express-session');
const PORT = process.env.port || 3000;
const movieController = require("./controllers/MovieController");

app.get("/", movieController.get);

app.get("/", (req, res, next) => {
  res.send("Middleware worked");
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
