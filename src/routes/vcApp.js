const express = require("express");
const vcController = require("../controllers/vcApp/vcApp.js");
const userController = require("../controllers/user/user.js")
const router = express.Router();
const passport = require("passport");
router.use(passport.initialize());

router.get("/", userController.checkAuthenticated, vcController.dashboardRender)
router.get("/joinroom", userController.checkAuthenticated, vcController.joinRoomRender)
router.get("/createroom", userController.checkAuthenticated, vcController.createRoomRender)

router.post("/createroom", userController.checkAuthenticated, vcController.createRoom)
router.get("/chatroom/:uid", userController.checkAuthenticated, vcController.chatRoomRender)
router.delete("/deleteroom/:uid", userController.checkAuthenticated, vcController.deleteRoom)

module.exports = router;