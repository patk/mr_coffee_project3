const express = require("express");
const db = require("./data.js");
const app = express();
const PORT = 3000;

// hashing password
// https://www.youtube.com/watch?v=sfbFk84Cx6Q
const crypto = require("crypto");

// more info about express.json() and express.urlencoded:
// https://stackoverflow.com/questions/23259168/what-are-express-json-and-express-urlencoded/51844327#:~:text=a.-,express.,use(express.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => {
  console.log("server is listening on localhost " + PORT);
});

app.get("/", (req, res) => {
  res.send("Welcome to our schedule website");
});

app.get("/users", (req, res) => {
  // returns the list of all users
  res.json(db.users);
});

app.get("/schedules", (req, res) => {
  // returns the list of all schedules
  res.json(db.schedules);
});

app.get("/users/:userId", (req, res) => {
  // returns a specific user
  res.send(db.users[req.params.userId]);
});

app.get("/users/:userId/schedules", (req, res) => {
  // return all schedules of a specific user
  const scheduleArray = db.schedules;
  const userSchedule = scheduleArray.filter(
    (schedule) => schedule.user_id === Number(req.params.userId)
  );
  res.send(userSchedule);
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
  res.send("new user added");
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
  res.send("new schedule added");
});
