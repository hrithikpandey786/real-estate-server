const express = require("express");
const router = express.Router();
const controllers = require("../controllers/post.controller");
const verifyToken = require("../middleware/verifyToken");

router.get("/", controllers.getPosts);
router.get("/:id", controllers.getPost);
router.post("/post", verifyToken, controllers.addPost);
router.put("/:id", verifyToken, controllers.updatePost);
router.delete("/:id", verifyToken, controllers.deletePost);

module.exports = router;