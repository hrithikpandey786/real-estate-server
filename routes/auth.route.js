const express = require("express");
const router = express.Router();
const controllers = require("../controllers/auth.controller");

router.post("/register", controllers.register);
router.post("/login", controllers.login);
router.post("/logout", controllers.logout);

module.exports = router;