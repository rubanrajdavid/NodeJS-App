const express = require("express");
const morgan = require("morgan");
const mysql_lib = require("mysql");
const bodyParser = require("body-parser");
const myfun = require('./user-def-functions')

//SQL Connection Setting
const mysql = mysql_lib.createConnection({
  host: "localhost",
  user: "root",
  database: "cron_example",
});

//Create an object in Express
const app = express();

//Assign the View folder as static address
app.use(express.static("./view"));

//Log each request URI ,Status and its response time
app.use(morgan("tiny"));

//Retiving data from req sent as JSON in body
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);
app.use(bodyParser.json());
app.use(bodyParser.raw());

//Start Express Server
app.listen(3002, () => {
  console.log("server running in 3002 port");
});

//Check Server Status
app.get("/", (_req, res) => {
  res.send("");
});

//Database error code reference URI --> https://mariadb.com/kb/en/mariadb-error-codes/
//HTTP Status Code  Reference URI   --> https://www.exai.com/blog/http-status-codes-cheat-sheet

//Get List of Users and handle errors
app.get("/users", (_req, res) => {
  mysql.query("SELECT * FROM user_data", (err, rows, fields) => {
    if (err != null) {
      res.json({
        error: err.code,
        code: err.errno,
        message: err.message,
      });
    } else if (rows.length == 0) {
      res.sendStatus(204);
    } else {
      var details = rows.map((rows) => {
        return {
          name: rows.USER_NAME,
          mail: rows.EMAIL,
        };
      });
      res.json(details);
    }
  });
});

//Get Details of a User and handle errors
app.get("/user/:id", (req, res) => {
  let user_id = req.params.id;
  let sql_query = "SELECT * FROM user_data WHERE ID = ?";
  mysql.query(sql_query, [user_id], (err, rows, fields) => {
    if (err != null) {
      res.json({
        error: err.code,
        code: err.errno,
        message: err.message,
      });
    } else if (rows.length == 0) {
      res.sendStatus(204);
    } else {
      var details = rows.map((rows) => {
        return {
          name: rows.USER_NAME,
          mail: rows.EMAIL,
        };
      });
      res.json(details);
    }
  });
});

//Create a new user by put method
app.post("/user", (req, res) => {
  let sql_query =
    "INSERT INTO `user_data` (`ID`, `USER_NAME`, `EMAIL`, `CONTACT_NUMBER`) VALUES (NULL, '?', '?', '?');";
  myfun.check_if_user_exists(req.body.mail)
    .then((x) => {
      console.log(x);
    })
    .catch((e) => {
      console.log(e);
    });
  res.end();
});

//Function to Check if MailID Exists