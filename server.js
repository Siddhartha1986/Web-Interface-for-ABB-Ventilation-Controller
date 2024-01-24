const express = require('express');
const path = require('path');
const bodyparser = require("body-parser");
const session = require("express-session");
const {
  v4: uuidv4
} = require("uuid");
var sqlite3 = require("sqlite3");

const router = require('./router');

let db = new sqlite3.Database('./public/db/users.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
  }
});

const app = express();

const port = process.env.PORT || 4000;

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
  extended: true
}))

app.set('view engine', 'ejs');

// load static assets
app.use('/static', express.static(path.join(__dirname, 'public')))
app.use('/assets', express.static(path.join(__dirname, 'public/assets')))

app.use(session({
  secret: uuidv4(), //  '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'
  resave: false,
  saveUninitialized: true
}));

app.use('/route', router);

// home route
app.get('/', (req, res) => {
  res.render('login', {
    title: "User Login"
  });
});

// home route
app.get('/signup', (req, res) => {
  res.render('signup', {});
});

// POST /ventSettings
app.post("/setVentSettings", (req, res) => {

  //Check for existing data
  const sql = "select * from settings";
  db.all(sql, [], (err, rows) => {
    if (err) {
      return console.error(err.message);
    }
    if (rows.length > 0) {
      const sql = "DELETE FROM settings";
      db.run(sql, [], err => {
        if (err) {
          return console.error(err.message);
        }
      })
    }
    const sql = "INSERT into settings (mode, pointSet,server,port,publisherText, updatedBy, UpdatedOn,subscriberText) values(?,?,?,?,?,?,datetime('now'),?)";
    const date = [req.body.Mode, req.body.setPoint, req.body.server, req.body.port, req.body.publisher, req.session.user, req.body.subscriber];
    db.run(sql, date, err => {
      if (err) {
        return console.error(err.message);
      }
      res.redirect("/route/ventSettings");
    })
  })
});

app.post("/udpateMessage", (req, res) => {
  const sql = "INSERT into MessageDetails (createdBy, setting,setpoint, pressure, speed,temperature,co2,rh,createdOn) values (?,?,?,?,?,?,?,?,datetime('now'))";
  const date = [req.session.user, '', req.body.setpoint, req.body.pressure, req.body.speed, req.body.temp, req.body.co2, req.body.rh];
  db.run(sql, date, err => {
    if (err) {
      return console.error(err.message);
    }
    res.redirect("/route/ventMonitor");
  })
});

app.listen(port, () => {
  console.log("Lostening to the server on http://localhost:4000")
});