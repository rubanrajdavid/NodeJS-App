const express = require('express')
const controller = require("../controller/general");
const router = express.Router()

router.get("/", controller.server_test);

module.exports = router