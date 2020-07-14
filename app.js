const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const db = require("./src/model/sqlconnection");

//Create an object in Express
const app = express();

//Retiving data from req sent as JSON in body
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);
app.use(bodyParser.json());
app.use(bodyParser.raw());

//Routes
app.use('/', require('./src/routes/general'))
app.use('/user', require('./src/routes/user'))

//Test DB Connection
db.authenticate()
  .then(() => {
    console.log("connected");
  })
  .catch((error) => console.log(error));

//Assign the View folder as static address
app.use(express.static("./view"));

//Log each request URI ,Status and its response time
app.use(morgan("dev"));


//Start Express Server
app.listen(3002, () => {
  console.log("server running in 3002 port");
});