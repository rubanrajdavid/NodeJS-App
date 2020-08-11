const express = require("express");
const controller = require("../controllers/user/user");
const router = express.Router();
const passport = require("passport");
router.use(passport.initialize());

//Database error code reference URI --> https://mariadb.com/kb/en/mariadb-error-codes/
//HTTP Status Code  Reference URI   --> https://www.exai.com/blog/http-status-codes-cheat-sheet

//Get List of Users and handle errors
router.get("/listusers", controller.listusers);

//Get Details of a User and handle errors
router.get("/details/:mail", controller.userdetails);

//Create a new user
router.post("/create", controller.create_user);

//Register User by getting all details
router.get("/verify/:otp", controller.verify_url);

//Registering user Controller
router.post("/register", controller.register);

//Register Page HTML Send
router.get("/create", controller.checkNotAuthenticated, controller.register_html);

//Login controller
router.post("/login", controller.login);

//Login Page HTML send
router.get("/login", controller.checkNotAuthenticated, controller.login_html);

//Logout Function
router.delete("/logout", controller.logout);

//Forgot Password Controller
router.post("/reset-password", controller.forgot_pwd);

//Forgot Password HTML send
router.get("/reset-password", controller.forgot_pwd_html);

//Forgot Password verification link
router.get("/verify-reset/:otp", controller.forgot_pwd_mail_verify);

//Forgot Password reset submit
router.post("/verify-reset", controller.forgot_pwd_change);

//Navigate to homepage
router.get("/homepage", controller.checkAuthenticated, controller.homepage_html);

module.exports = router;