const app = require("express")();
const express = require("express")
const morgan = require("morgan");
const bodyParser = require("body-parser");
const db = require("./src/configurations/sqlconnection");
const hbs = require("express-handlebars");
const path = require("path");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");
require("dotenv").config();

//Passport Config
require("./src/controllers/user/passport")(passport);

const http = require('http').Server(app);
const io = require('socket.io')(http);

//Passport Config
// require("./src/controllers/vcApp/vcApp")(io);

//Setup for Handlebars
app.set("views", path.join(__dirname, "src/views"));
app.engine(
  "handlebars",
  hbs({
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, "/src/views/layouts"),
  }),
);
app.set("view engine", "handlebars");

// Connect flash
app.use(flash());

//Express Session Settings
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  }),
);

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//Method Override
app.use(methodOverride("_method"));

//Retiving data from req sent as JSON in body
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);
app.use(bodyParser.json());
app.use(bodyParser.raw());

//Routes
app.use("/", require("./src/routes/general"));
app.use("/user", require("./src/routes/user"));
app.use("/vcapp", require("./src/routes/vcApp"));

//Test DB Connection
db.authenticate()
  .then(() => {
    console.log("Database Connected");
  })
  .catch((error) =>
    console.log("Please Start MySQL Server / Check Credentials"),
  );

//Log each request URI ,Status and its response time
//app.use(morgan("dev"));

//Add Public as Static folder
app.use(express.static("./src/views/public"));

//Handle All 404 Error Requests
app.use((req, res, next) => {
  res.status(404).render("errors/unauthorised", {
    title: "Page not Found",
    type: "404 Page Not Found",
    status: "Requested page does not exists. Please Check the URL entered",
    link: "/user/login",
    label: "Go to Login page",
  });
});

module.exports = io

//Start Express Server
http.listen(process.env.APP_PORT, () => {
  console.log(`App Connected`);
});
