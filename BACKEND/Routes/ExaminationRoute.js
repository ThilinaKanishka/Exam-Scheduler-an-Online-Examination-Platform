const express = require("express");
const router = express.Router();
const {
  createExam,
  getAllExams,
  getExamById,
  updateExam,
  deleteExam,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  submitResults,
  getResults,
  verifyPassword,
  getStudentQuestions,
} = require("../Controllers/ExaminationController");

// Exam routes
router.post("/", createExam);
router.get("/", getAllExams);
router.get("/:id", getExamById);
router.put("/:id", updateExam);
router.delete("/:id", deleteExam);

// Question routes
router.post("/:id/questions", addQuestion);
router.put("/:examId/questions/:questionId", updateQuestion);
router.delete("/:examId/questions/:questionId", deleteQuestion);

// Results routes
router.post("/:id/results", submitResults);
router.get("/:id/results", getResults);

// Student routes
router.post("/:id/verify-password", verifyPassword);
router.get("/:id/student-questions", getStudentQuestions);

module.exports = router;
