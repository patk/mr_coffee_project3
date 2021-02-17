// set up express
const express = require("express");
const app = express();

// set up morgan
const morgan = require("morgan");
app.use(morgan("dev"));

// set up database
const database = require("./database");

// set up view engine
app.set("view engine", "ejs");

// port
const PORT = 3100;
app.listen(PORT, () => {
  console.log("server is listening on localhost " + PORT);
});

// routes
app.get("/", (req, res) => {
  // select all fields from schedule table
  database.any("SELECT * FROM schedule;").then((schedule) => {
    console.log(schedule);
    res.render("pages/index", {
      schedule: schedule,
    });
  });
});

app.get("/new", (req, res) => {
  res.render("pages/new-schedule");
});
