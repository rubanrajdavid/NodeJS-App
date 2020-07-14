const express = require('express')
const controller = require("../controller/user");
const router = express.Router()


//Database error code reference URI --> https://mariadb.com/kb/en/mariadb-error-codes/
//HTTP Status Code  Reference URI   --> https://www.exai.com/blog/http-status-codes-cheat-sheet

//Get List of Users and handle errors
router.get('/listusers', controller.listusers);

//Get Details of a User and handle errors
router.get("/:mail", controller.userdetails);

//Create a new user by put method
router.post("/", controller.create_user)

module.exports = router