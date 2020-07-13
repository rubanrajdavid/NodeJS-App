const controller = require("./src/controller/users");
const express = require('express')
const router = express.Router()

module.exports = (app) => {
    app.get("/", controller.server_test);

    //Database error code reference URI --> https://mariadb.com/kb/en/mariadb-error-codes/
    //HTTP Status Code  Reference URI   --> https://www.exai.com/blog/http-status-codes-cheat-sheet

    //Get List of Users and handle errors
    app.get("/users", controller.listusers);

    //Get Details of a User and handle errors
    app.get("/user/:mail", controller.userdetails);

    //Create a new user by put method
    app.post("/user", controller.create_user)
}