var express = require("express");
var router = express.Router();
var sqlite3 = require("sqlite3");

let db = new sqlite3.Database('./public/db/users.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err.message);
    }
});

// login user
router.post('/login', (req, res) => {
    if (req.body.email !== "" && req.body.password !== "") {
        pass = Buffer.from(req.body.password).toString('base64')
        const sql = "select * from users where email=? and password=?;";
        const date = [req.body.email, pass]
        id = "";
        db.all(sql, date, (err, rows) => {
            if (err) {
                return console.error(err.message);
            }
            rows.forEach((row) => {
                id = row.userid;
            });
            if (id !== "") {
                const sql = "INSERT into Logs (userid,action_on, action) values (?,datetime('now'),'Logged In')";
                const date = [id];
                db.run(sql, date, err => {
                    if (err) {
                        return console.error(err.message);
                    }
                    req.session.user = id;
                    res.redirect('/route/dashboard');
                })
            } else {
                res.end("Invalid Username and password")
            }
        })
    } else {
        res.end("Invalid Username and password")
    }
});

// route for dashboard
router.get('/dashboard', (req, res) => {
    if (req.session.user) {
        res.render('dashboard', {
            user: req.session.user
        })
    } else {
        res.send("Unauthorize User")
    }
});

// route for logout
router.get('/logout', (req, res) => {
    req.session.destroy(function (err) {
        if (err) {
            console.log(err);
            res.send("Error")
        } else {
            const sql = "INSERT into Logs (userid,action_on, action) values (?,datetime('now'),'Logged Out')";
            const date = [id];
            db.run(sql, date, err => {
                if (err) {
                    return console.error(err.message);
                }
            })
            res.render('login', {
                title: "Express",
                logout: "logout Successfully...!"
            })
        }
    })
});

//Route for log viewing page
router.get('/logs', (req, res) => {
    if (req.session.user) {
        const sql = "Select u.userid,name,email, action_on,action  FROM Users u INNER JOIN Logs l ON u.userid = l.userid  order by action_on DESC;";
        db.all(sql, [], (err, rows) => {
            if (err) {
                return console.error(err.message);
            }
            //res.render('logs', {user : req.session.user,model: rows})
            res.render("logs", {
                model: rows
            });
        });
    } else {
        res.send("Unauthorize User")
    }
});

//get route for opening message logs
router.get('/ViewMessageLog', (req, res) => {
    if (req.session.user) {
        res.render("ViewMessageLog", {
            model: '',
            count: 0
        });
    } else {
        res.send("Unauthorize User")
    }
});

//post route for show message logs
router.post('/ShowMessageLog', (req, res) => {
    if (req.session.user) {
        const sql = "Select pressure, setpoint, temperature,co2, rh, speed, name, createdOn FROM MessageDetails m INNER JOIN Users u ON m.createdBy = u.userid and date(createdOn) between date(?) and date(?)  order by createdOn DESC;";
        const data = [req.body.fromDate, req.body.toDate];
        db.all(sql, data, (err, rows) => {
            if (err) {
                return console.error(err.message);
            }
            //res.render('logs', {user : req.session.user,model: rows})
            res.render("ViewMessageLog", {
                model: rows,
                fdate: req.body.fromDate,
                tdate: req.body.toDate,
                count: rows.length
            });
        });
    } else {
        res.send("Unauthorize User")
    }
});

// GET /ventSettings
router.get("/ventSettings", (req, res) => {
    if (req.session.user) {
        const sql = "Select mode,pointSet,server,port,publisherText,subscriberText  FROM settings;";
        db.all(sql, [], (err, rows) => {
            if (err) {
                return console.error(err.message);
            }
            mode = "";
            pointset = "";
            server = "";
            port = "";
            publishText = "";
            subscriberText = "";
            rows.forEach((rows) => {
                mode = rows.mode;
                pointset = rows.pointSet;
                server = rows.server;
                port = rows.port;
                publishText = rows.publisherText;
                subscriberText = rows.subscriberText;
            });
            res.render('ventSettings', {
                user: req.session.user,
                getMode: mode,
                getPoint: pointset,
                getServer: server,
                getPort: port,
                getPublishText: publishText,
                getSubscriberText: subscriberText
            });
        });
    } else {
        res.send("Unauthorize User")
    }
});

// POST /ventSettings
router.post("/setVentSettings", (req, res) => {
    const sql = "INSERT into settings (mode, pointSet,server,port,publisherText, UpdatedOn, updatedBy) values(?,?,?,?,?,?,datetime('now'))";
    const data = [req.body.Mode, req.body.setPoint, req.body.server, req.body.port, req.body.publisher, req.session.user];
    db.run(sql, data, err => {
        if (err) {
            return console.error(err.message);
        }
        res.redirect("/ventSettings");
    });
});

//route for publishing Message
router.get('/publishMessage', (req, res) => {
    if (req.session.user) {
        const sql = "Select mode,pointSet,server,port,publisherText  FROM settings;";
        db.all(sql, [], (err, rows) => {
            if (err) {
                return console.error(err.message);
            }
            mode = "";
            pointset = "";
            server = "";
            port = "";
            publishTest = "";
            var pubMessage = {};
            rows.forEach((rows) => {
                mode = rows.mode;
                pointset = rows.pointSet;
                server = rows.server;
                port = rows.port;
                publishText = rows.publisherText;
                if (mode == "Pressure") {
                    pubMessage = {
                        "auto": true,
                        "pressure": pointset
                    };
                } else {
                    pubMessage = {
                        "auto": false,
                        "speed": pointset
                    };
                }
            });
            res.render('publishMessage', {
                user: req.session.user,
                getMode: mode,
                getPoint: pointset,
                getServer: server,
                getPort: port,
                getPublishText: publishText,
                getMessage: JSON.stringify(pubMessage)
            });
        });
    } else {
        res.send("Unauthorize User")
    }
});

//route for subscribing message
router.get('/subscribeMessage', (req, res) => {
    if (req.session.user) {
        const sql = "Select mode,pointSet,server,port,publisherText,subscriberText  FROM settings;";
        db.all(sql, [], (err, rows) => {
            if (err) {
                return console.error(err.message);
            }
            server = "";
            port = "";
            publishTest = "";
            rows.forEach((rows) => {
                server = rows.server;
                port = rows.port;
                publishText = rows.publisherText;
            });
            res.render('subscribeMessage', {
                user: req.session.user,
                getServer: server,
                getPort: port,
                getPublishText: publishText,
                getSubscriberText: subscriberText
            });
        });
    } else {
        res.send("Unauthorize User")
    }
});

//route for ventilation monitor
router.get('/ventMonitor', (req, res) => {
    if (req.session.user) {
        res.render('ventMonitor', {
            user: req.session.user
        })
    } else {
        res.send("Unauthorize User")
    }
});

// POST /ventSettings
router.post("/userSignup", (req, res) => {
    if (req.body.name === "" || req.body.email === "" || req.body.password === "") {
        res.redirect("/signup");
    } else {
        pass = Buffer.from(req.body.password).toString('base64')
        const sql = "INSERT into Users (name, email,phone, password) values (?,?,?,?)";
        const date = [req.body.name, req.body.email, req.body.phone, pass];
        db.run(sql, date, err => {
            if (err) {
                return console.error(err.message);
            }
            res.redirect("/");
        })
    }
});

module.exports = router;