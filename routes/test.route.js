const express = require('express');
const router = express.Router();
const controllers = require("../controllers/test.controller.js");
const verfiyToken = require("../middleware/verifyToken.js");

router.get("/should-be-logged-in", verfiyToken, controllers.shouldBeLoggedIn);
router.get("/should-be-admin", controllers.shouldBeAdmin);

module.exports = router;