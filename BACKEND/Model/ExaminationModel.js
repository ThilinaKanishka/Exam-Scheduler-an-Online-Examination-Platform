const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  questionType: { type: String, enum: ["mcq", "structured"], required: true },
  options: [{ type: String }], // For MCQ questions
  correctAnswer: { type: String, required: true },
  marks: { type: Number, required: true },
});

const examSchema = new mongoose.Schema({
  moduleName: { type: String, required: true },
  examName: { type: String, required: true },
  examPassword: { type: String, required: true },
  examDuration: { type: Number, required: true }, // in minutes
  scheduledDate: { type: Date, required: true },
  questions: [questionSchema],
  questionsToShow: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

const resultSchema = new mongoose.Schema({
  examId: { type: mongoose.Schema.Types.ObjectId, ref: "Exam", required: true },
  studentName: { type: String, required: true },
  itNumber: { type: String, required: true },
  answers: [
    {
      questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
      selectedAnswer: { type: String, required: true },
    },
  ],
  score: { type: Number, required: true },
  submittedAt: { type: Date, default: Date.now },
});

const Exam = mongoose.model("Exam", examSchema);
const Result = mongoose.model("Result", resultSchema);

module.exports = { Exam, Result };
