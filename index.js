const express = require("express");
const db = require("./data.js");
const app = express();
const morgan = require("morgan");
const PORT = 3000;

// hashing password
// https://www.youtube.com/watch?v=sfbFk84Cx6Q
const crypto = require("crypto");

// more info about express.json() and express.urlencoded:
// https://stackoverflow.com/questions/23259168/what-are-express-json-and-express-urlencoded/51844327#:~:text=a.-,express.,use(express.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// use morgan middleware in this app
app.use(morgan("dev"));

// set the view engine (in this case we are using EJS)
app.set("view engine", "ejs");

app.listen(PORT, () => {
  console.log("server is listening on localhost " + PORT);
});

app.get("/", (req, res) => {
  res.render("pages/index");
});

// returns the list of all users
app.get("/users", (req, res) => {
  res.render("pages/users", {
    // passing users object
    users: db.users,
  });
});

// returns the list of all schedules
app.get("/schedules", (req, res) => {
  res.render("pages/schedules", {
    // passing schedules object
    schedules: db.schedules,
  });
});

// returns a specific user
app.get("/users/:userId(\\d+)/", (req, res) => {
  // TODO: validate if user specified exist
  res.render("pages/user", {
    user: db.users[req.params.userId],
  });
});

// return all schedules of a specific user
app.get("/users/:userId/schedules", (req, res) => {
  const scheduleArray = db.schedules;
  const userSchedule = scheduleArray.filter(
    (schedule) => schedule.user_id === Number(req.params.userId)
  );
  res.render("pages/user-schedule", {
    userSchedule: userSchedule,
  });
});

// route to create a new user
app.get("/users/new", (req, res) => {
  res.render("pages/new-user");
});

// route to create a new schedule
app.get("/schedules/new", (req, res) => {
  res.render("pages/new-schedule");
});

// post new user
app.post("/users", (req, res) => {
  // encrypt user password in SHA256
  const encryptedPassword = crypto
    .createHash("sha256")
    .update(req.body.password)
    .digest("hex");

  const newUser = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    password: encryptedPassword,
  };
  db.users.push(newUser);
  res.redirect("/users");
});

// post new schedule
app.post("/schedules", (req, res) => {
  const newSchedule = {
    user_id: Number(req.body.user_id),
    day: Number(req.body.day),
    start_at: req.body.start_at,
    end_at: req.body.end_at,
  };
  db.schedules.push(newSchedule);
  res.redirect("/schedules");
});
