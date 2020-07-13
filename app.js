const express = require("express");
const morgan = require("morgan");
const mysql_lib = require("mysql");
const bodyParser = require("body-parser");


//SQL Connection Setting


//Create an object in Express
const app = express();
const appRoutes = require('./routes')(app)
//Assign the View folder as static address
app.use(express.static("./view"));

//Log each request URI ,Status and its response time
app.use(morgan("dev"));

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