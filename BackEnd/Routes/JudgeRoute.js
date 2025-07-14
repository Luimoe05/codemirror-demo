// setup all routes
const express = require("express");
const router = express.Router();
const controller = require("../Controllers/JudgeController");

// runs the code and returns the result in one
router.post("/run-code", controller.run);

module.exports = router;
