const express = require("express");
const router = express.Router();
const controller = require("../Controllers/ExaminationController");

router.post("/create", controller.createExam);
router.get("/:id", controller.getExam);
router.post("/submit", controller.submitAnswers);
router.get("/:id/results", controller.getResults);

module.exports = router;
