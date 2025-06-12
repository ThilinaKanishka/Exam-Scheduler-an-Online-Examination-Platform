const mongoose = require("mongoose");

const examinationSchema = new mongoose.Schema({
  moduleName: {
    type: String,
    required: true,
  },
  examName: {
    type: String,
    required: true,
  },
  examDate: {
    type: Date,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  questionType: {
    type: String,
    enum: ["MCQ", "Structured"],
    required: true,
  },
  totalQuestions: {
    type: Number,
    required: true,
  },
  questionsToDisplay: {
    type: Number,
    required: true,
  },
  questions: [
    {
      questionText: {
        type: String,
        required: true,
      },
      options: {
        type: [String],
        required: function () {
          return this.questionType === "MCQ";
        },
      },
      correctAnswer: {
        type: String,
        required: true,
      },
      marks: {
        type: Number,
        required: true,
      },
    },
  ],
  results: [
    {
      studentName: {
        type: String,
        required: true,
      },
      itNumber: {
        type: String,
        required: true,
      },
      answers: [
        {
          questionId: mongoose.Schema.Types.ObjectId,
          answer: String,
          isCorrect: Boolean,
          marksObtained: Number,
        },
      ],
      totalMarks: {
        type: Number,
        required: true,
      },
      submittedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Examination", examinationSchema);
