const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken.js");
const controllers = require("../controllers/message.controller.js");


router.put("/:chatId", verifyToken, controllers.addMessage);


module.exports = router;