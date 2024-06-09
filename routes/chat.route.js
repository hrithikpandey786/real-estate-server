const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken.js");
const controllers = require("../controllers/chats.controller.js");


router.get("/", verifyToken, controllers.getChats);
router.get("/:id", verifyToken, controllers.getChat);
router.post("/", verifyToken, controllers.addChat);
router.put("/read/:id", verifyToken, controllers.readChat);

module.exports = router;