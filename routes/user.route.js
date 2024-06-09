const express = require("express");
const router = express.Router();
const controllers = require("../controllers/user.controller.js");
const verifyToken = require("../middleware/verifyToken.js");

router.get("/", controllers.getUsers);
router.put("/:id", verifyToken, controllers.updateUser);
router.delete("/:id", verifyToken, controllers.deleteUser);
router.post("/save", verifyToken, controllers.savedPost);
router.get("/profilePosts", verifyToken, controllers.profilePosts);
router.get("/notification", verifyToken, controllers.getNotification);

module.exports = router;