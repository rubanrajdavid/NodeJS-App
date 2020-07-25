const express = require('express')
const controller = require("../controller/user");
const router = express.Router()


//Database error code reference URI --> https://mariadb.com/kb/en/mariadb-error-codes/
//HTTP Status Code  Reference URI   --> https://www.exai.com/blog/http-status-codes-cheat-sheet

//Get List of Users and handle errors
router.get('/listusers', controller.listusers);

//Get Details of a User and handle errors
router.get("/details/:mail", controller.userdetails);

//Create a new user 
router.post("/", controller.create_user)

//Register User by getting all details
router.get("/verify/:otp", controller.verify_url)

//Registering user details
router.post("/register", controller.register)

//Register Page
router.get("/register", controller.register_html)

//register html send file
router.post("/login", controller.login)

//Login Page
router.get("/login", controller.login_html)

module.exports = router