const express = require("express");
const vcController = require("../controllers/vcApp/vcApp.js");
const userController = require("../controllers/user/user.js")
const router = express.Router();
const passport = require("passport");
router.use(passport.initialize());

router.get("/", vcController.dashboardRender)
router.get("/joinroom", vcController.joinRoomRender)
router.get("/createroom", vcController.createRoomRender)

module.exports = router;