import mongoose from "mongoose";

const examinationSchema = new mongoose.Schema(
  {
    moduleName: {
      type: String,
      required: true,
    },
    examType: {
      type: String,
      enum: ["MCQ", "Structured"],
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
            return this.examType === "MCQ";
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
    examPassword: {
      type: String,
      required: true,
    },
    examDuration: {
      type: Number, // in minutes
      required: true,
    },
    questionsToDisplay: {
      type: Number,
      required: true,
    },
    scheduledDate: {
      type: Date,
      required: true,
    },
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
            selectedAnswer: String,
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
  },
  { timestamps: true }
);

const Examination = mongoose.model("Examination", examinationSchema);

export default Examination;
