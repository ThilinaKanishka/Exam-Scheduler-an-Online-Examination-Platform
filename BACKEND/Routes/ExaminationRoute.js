const express = require("express");
const router = express.Router();
const examinationController = require("../Controllers/ExaminationController");

// Exam scheduling routes
router.post("/exams", examinationController.scheduleExam);
router.get("/exams", examinationController.getAllExams);
router.get("/exams/:id", examinationController.getExamById);
router.put("/exams/:id", examinationController.updateExam);
router.delete("/exams/:id", examinationController.deleteExam);

// Student exam routes
router.post("/exams/verify-password", examinationController.verifyExamPassword);
router.get("/exams/:id/questions", examinationController.getExamQuestions);
router.post("/exams/submit", examinationController.submitExam);

// Results routes
router.get("/exams/:examId/results", examinationController.getExamResults);

module.exports = router;
