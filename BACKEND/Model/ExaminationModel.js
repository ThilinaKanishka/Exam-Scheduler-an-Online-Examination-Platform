const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }], // 4 options
  correctAnswer: { type: String, required: true },
  marks: { type: Number, required: true },
});

const AnswerSchema = new mongoose.Schema({
  itNumber: { type: String, required: true },
  name: { type: String, required: true },
  answers: [
    {
      questionId: mongoose.Schema.Types.ObjectId,
      selectedAnswer: String,
      isCorrect: Boolean,
      marksObtained: Number,
    },
  ],
  totalMarks: Number,
  submittedAt: Date,
});

const ExaminationSchema = new mongoose.Schema({
  moduleName: { type: String, required: true },
  examName: { type: String, required: true },
  examDate: { type: Date, required: true },
  examStartTime: { type: String, required: true },
  examDuration: { type: Number, required: true }, // in minutes
  password: { type: String, required: true },
  questionType: { type: String, enum: ["MCQ", "Structured"], required: true },
  totalQuestions: { type: Number, required: true },
  questionsToDisplay: { type: Number, required: true },
  questions: [QuestionSchema],
  results: [AnswerSchema],
});

module.exports = mongoose.model("Examination", ExaminationSchema);
