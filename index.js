// set up express
const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
// route to retrieve the list of all existing schedules from the database
app.get("/", (req, res) => {
  // select all fields from schedule table
  database.any("SELECT * FROM schedule;").then((schedule) => {
    console.log(schedule);
    res.render("pages/index", {
      schedule: schedule,
    });
  });
});

// route to display a form to add a schedule
app.get("/new", (req, res) => {
  res.render("pages/new-schedule");
});

// route to post new schedule to the database
app.post("/new", (req, res) => {
  console.log(req.body);
  // get input values from the form
  const username = req.body.username;
  const day = Number(req.body.day);
  const start_time = req.body.start_time;
  const end_time = req.body.end_time;

  // push the form data to the database
  database
    .query(
      "INSERT INTO schedule(username, day, start_time, end_time) VALUES($1, $2, $3, $4);",
      [username, day, start_time, end_time]
    )
    .then((newSchedule) => {
      console.log(newSchedule);
      res.redirect("/new");
    });
});

/*
function translateDay(dayInNumber) {
  switch (dayInNumber) {
    case 1:
      return "Monday";
    case 2:
      return "Tuesday";
    case 3:
      return "Wednesday";
    case 4:
      return "Thursday";
    case 5:
      return "Friday";
    case 6:
      return "Saturday";
    case 7:
      return "Sunday";
  }
}*/
