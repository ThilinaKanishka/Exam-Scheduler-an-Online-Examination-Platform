import React, { useState } from "react";
import axios from "axios";
import {
  FiPlus,
  FiTrash2,
  FiEdit,
  FiSave,
  FiX,
  FiClock,
  FiLock,
  FiBook,
  FiCalendar,
  FiList,
} from "react-icons/fi";

const AdminScheduleExam = () => {
  const [examData, setExamData] = useState({
    moduleName: "",
    examName: "",
    examPassword: "",
    examDuration: 60,
    scheduledDate: "",
    questionsToShow: 20,
    questions: [
      {
        questionText: "",
        questionType: "mcq",
        options: ["", "", "", ""],
        correctAnswer: "",
        marks: 1,
      },
    ],
  });
  const [showExamList, setShowExamList] = useState(false);
  const [editingQuestionIndex, setEditingQuestionIndex] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExamData({ ...examData, [name]: value });
  };

  const handleQuestionChange = (index, e) => {
    const { name, value } = e.target;
    const updatedQuestions = [...examData.questions];
    updatedQuestions[index] = { ...updatedQuestions[index], [name]: value };
    setExamData({ ...examData, questions: updatedQuestions });
  };

  const handleOptionChange = (qIndex, oIndex, e) => {
    const { value } = e.target;
    const updatedQuestions = [...examData.questions];
    updatedQuestions[qIndex].options[oIndex] = value;
    setExamData({ ...examData, questions: updatedQuestions });
  };

  const addQuestion = () => {
    setExamData({
      ...examData,
      questions: [
        ...examData.questions,
        {
          questionText: "",
          questionType: "mcq",
          options: ["", "", "", ""],
          correctAnswer: "",
          marks: 1,
        },
      ],
    });
  };

  const removeQuestion = (index) => {
    const updatedQuestions = [...examData.questions];
    updatedQuestions.splice(index, 1);
    setExamData({ ...examData, questions: updatedQuestions });
    if (editingQuestionIndex === index) {
      setEditingQuestionIndex(null);
      setEditMode(false);
    }
  };

  const startEditingQuestion = (index) => {
    setEditingQuestionIndex(index);
    setEditMode(true);
  };

  const cancelEditing = () => {
    setEditingQuestionIndex(null);
    setEditMode(false);
  };

  const saveEditedQuestion = () => {
    setEditingQuestionIndex(null);
    setEditMode(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      // const response = await axios.post(
      //   "http://localhost:5000/api/exams/exams",
      //   examData
      // );
      alert("Exam scheduled successfully!");
      // console.log(response.data);
      setShowExamList(true);
    } catch (error) {
      console.error("Error scheduling exam:", error);
      alert("Failed to schedule exam");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-900 text-gray-100 flex items-center justify-center">
      {/* Header */}
      <div className="w-full max-w-md p-8 bg-white bg-opacity-10 backdrop-blur-md rounded-xl shadow-xl border border-white border-opacity-20">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white flex items-center">
            <FiBook className="mr-2" />
            ExamSync
          </h1>
          <div className="flex items-center space-x-4">
            <span className="text-indigo-200">Admin Dashboard</span>
          </div>
        </div>
      </header>

      {/* Main Content - Full screen layout */}
      <main className="flex-1 overflow-hidden py-4 px-2">
        <div className="container mx-auto h-full px-2">
          {!showExamList ? (
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between mb-4 px-2">
                <h1 className="text-2xl md:text-3xl font-bold text-indigo-300 flex items-center">
                  <FiCalendar className="mr-3" />
                  Schedule New Exam
                </h1>
              </div>

              <form
                onSubmit={handleSubmit}
                className="bg-gray-800 rounded-xl p-4 md:p-6 shadow-2xl flex-1 flex flex-col overflow-hidden"
              >
                {/* Exam Details */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 overflow-y-auto">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Module Name
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="moduleName"
                          value={examData.moduleName}
                          onChange={handleChange}
                          required
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-4 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                          placeholder="Enter module name"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Exam Name
                      </label>
                      <input
                        type="text"
                        name="examName"
                        value={examData.examName}
                        onChange={handleChange}
                        required
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-4 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter exam name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Exam Password
                      </label>
                      <div className="relative">
                        <FiLock className="absolute left-3 top-3 text-gray-400" />
                        <input
                          type="password"
                          name="examPassword"
                          value={examData.examPassword}
                          onChange={handleChange}
                          required
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-10 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                          placeholder="Set exam password"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Duration (minutes)
                      </label>
                      <div className="relative">
                        <FiClock className="absolute left-3 top-3 text-gray-400" />
                        <input
                          type="number"
                          name="examDuration"
                          value={examData.examDuration}
                          onChange={handleChange}
                          required
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-10 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                          placeholder="Exam duration"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Scheduled Date
                      </label>
                      <input
                        type="datetime-local"
                        name="scheduledDate"
                        value={examData.scheduledDate}
                        onChange={handleChange}
                        required
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-4 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Questions to Show
                      </label>
                      <input
                        type="number"
                        name="questionsToShow"
                        value={examData.questionsToShow}
                        onChange={handleChange}
                        required
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-4 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                        placeholder="Number of questions"
                      />
                    </div>
                  </div>
                </div>

                {/* Questions Section - Scrollable */}
                <div className="mb-4 flex-1 overflow-y-auto">
                  <h2 className="text-xl font-semibold text-indigo-300 mb-4 flex items-center">
                    <FiList className="mr-2" />
                    Questions
                  </h2>

                  <div className="space-y-4">
                    {examData.questions.map((question, qIndex) => (
                      <div
                        key={qIndex}
                        className="bg-gray-750 rounded-lg p-4 border border-gray-700 hover:border-indigo-500 transition-all duration-200"
                      >
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="text-lg font-medium text-gray-200">
                            Question {qIndex + 1}
                          </h3>
                          <button
                            type="button"
                            onClick={() => removeQuestion(qIndex)}
                            className="text-red-400 hover:text-red-300 transition-colors duration-200 flex items-center"
                          >
                            <FiTrash2 className="mr-1" /> Remove
                          </button>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                              Question Text
                            </label>
                            <input
                              type="text"
                              name="questionText"
                              value={question.questionText}
                              onChange={(e) => handleQuestionChange(qIndex, e)}
                              required
                              className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-4 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                              placeholder="Enter question text"
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-1">
                                Question Type
                              </label>
                              <select
                                name="questionType"
                                value={question.questionType}
                                onChange={(e) =>
                                  handleQuestionChange(qIndex, e)
                                }
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-4 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                              >
                                <option value="mcq">
                                  Multiple Choice (MCQ)
                                </option>
                                <option value="structured">Structured</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-1">
                                Marks
                              </label>
                              <input
                                type="number"
                                name="marks"
                                value={question.marks}
                                onChange={(e) =>
                                  handleQuestionChange(qIndex, e)
                                }
                                required
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-4 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                placeholder="Marks for this question"
                              />
                            </div>
                          </div>

                          {question.questionType === "mcq" && (
                            <div className="mt-4">
                              <h4 className="text-sm font-medium text-gray-300 mb-3">
                                Options
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {question.options.map((option, oIndex) => (
                                  <div key={oIndex}>
                                    <label className="block text-xs text-gray-400 mb-1">
                                      Option {oIndex + 1}
                                    </label>
                                    <input
                                      type="text"
                                      value={option}
                                      onChange={(e) =>
                                        handleOptionChange(qIndex, oIndex, e)
                                      }
                                      required
                                      className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-4 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                      placeholder={`Option ${oIndex + 1}`}
                                    />
                                  </div>
                                ))}
                              </div>

                              <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                  Correct Answer
                                </label>
                                <select
                                  name="correctAnswer"
                                  value={question.correctAnswer}
                                  onChange={(e) =>
                                    handleQuestionChange(qIndex, e)
                                  }
                                  required
                                  className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-4 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                >
                                  <option value="">
                                    Select correct option
                                  </option>
                                  {question.options.map((option, oIndex) => (
                                    <option key={oIndex} value={option}>
                                      Option {oIndex + 1}{" "}
                                      {option && `(${option})`}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={addQuestion}
                    className="mt-4 flex items-center justify-center w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all duration-200 hover:shadow-lg"
                  >
                    <FiPlus className="mr-2" />
                    Add Question
                  </button>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-4 border-t border-gray-700">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex items-center justify-center py-2 px-6 rounded-lg transition-all duration-200 ${
                      isSubmitting
                        ? "bg-indigo-800 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg"
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Scheduling...
                      </>
                    ) : (
                      <>Schedule Exam</>
                    )}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="h-full flex flex-col overflow-hidden">
              <div className="flex items-center justify-between mb-4 px-2">
                <h1 className="text-2xl md:text-3xl font-bold text-indigo-300">
                  Scheduled Exam Details
                </h1>
                <button
                  onClick={() => setShowExamList(false)}
                  className="flex items-center bg-gray-700 hover:bg-gray-600 py-2 px-4 rounded-lg transition-all duration-200"
                >
                  <FiEdit className="mr-2" /> Edit Exam
                </button>
              </div>

              <div className="bg-gray-800 rounded-xl p-4 md:p-6 shadow-2xl mb-4 overflow-y-auto">
                <h3 className="text-xl font-semibold text-indigo-300 mb-4">
                  Exam Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-750 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm">Module Name</p>
                    <p className="text-white font-medium">
                      {examData.moduleName}
                    </p>
                  </div>
                  <div className="bg-gray-750 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm">Exam Name</p>
                    <p className="text-white font-medium">
                      {examData.examName}
                    </p>
                  </div>
                  <div className="bg-gray-750 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm">Duration</p>
                    <p className="text-white font-medium">
                      {examData.examDuration} minutes
                    </p>
                  </div>
                  <div className="bg-gray-750 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm">Scheduled Date</p>
                    <p className="text-white font-medium">
                      {new Date(examData.scheduledDate).toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-gray-750 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm">Questions to Show</p>
                    <p className="text-white font-medium">
                      {examData.questionsToShow}
                    </p>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-indigo-300 mb-4 px-2">
                Questions
              </h3>
              <div className="space-y-4 flex-1 overflow-y-auto pb-4 px-2">
                {examData.questions.map((question, index) => (
                  <div
                    key={index}
                    className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-indigo-500 transition-all duration-200"
                  >
                    {editMode && editingQuestionIndex === index ? (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">
                            Question Text
                          </label>
                          <input
                            type="text"
                            name="questionText"
                            value={question.questionText}
                            onChange={(e) => handleQuestionChange(index, e)}
                            required
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-4 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                              Question Type
                            </label>
                            <select
                              name="questionType"
                              value={question.questionType}
                              onChange={(e) => handleQuestionChange(index, e)}
                              className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-4 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                            >
                              <option value="mcq">MCQ</option>
                              <option value="structured">Structured</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                              Marks
                            </label>
                            <input
                              type="number"
                              name="marks"
                              value={question.marks}
                              onChange={(e) => handleQuestionChange(index, e)}
                              required
                              className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-4 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                            />
                          </div>
                        </div>

                        {question.questionType === "mcq" && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-300 mb-3">
                              Options
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {question.options.map((option, oIndex) => (
                                <div key={oIndex}>
                                  <label className="block text-xs text-gray-400 mb-1">
                                    Option {oIndex + 1}
                                  </label>
                                  <input
                                    type="text"
                                    value={option}
                                    onChange={(e) =>
                                      handleOptionChange(index, oIndex, e)
                                    }
                                    required
                                    className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-4 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                  />
                                </div>
                              ))}
                            </div>

                            <div className="mt-4">
                              <label className="block text-sm font-medium text-gray-300 mb-1">
                                Correct Answer
                              </label>
                              <select
                                name="correctAnswer"
                                value={question.correctAnswer}
                                onChange={(e) => handleQuestionChange(index, e)}
                                required
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-4 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                              >
                                <option value="">Select correct option</option>
                                {question.options.map((option, oIndex) => (
                                  <option key={oIndex} value={option}>
                                    Option {oIndex + 1}{" "}
                                    {option && `(${option})`}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        )}

                        <div className="flex justify-end space-x-3">
                          <button
                            onClick={cancelEditing}
                            className="flex items-center bg-gray-700 hover:bg-gray-600 py-2 px-4 rounded-lg transition-all duration-200"
                          >
                            <FiX className="mr-2" /> Cancel
                          </button>
                          <button
                            onClick={saveEditedQuestion}
                            className="flex items-center bg-indigo-600 hover:bg-indigo-700 py-2 px-4 rounded-lg transition-all duration-200"
                          >
                            <FiSave className="mr-2" /> Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-lg font-medium text-white">
                              <span className="text-indigo-300">
                                Q{index + 1}:
                              </span>{" "}
                              {question.questionText}
                            </p>
                            <div className="flex space-x-4 mt-1">
                              <span className="text-sm text-gray-400">
                                Type: {question.questionType}
                              </span>
                              <span className="text-sm text-gray-400">
                                Marks: {question.marks}
                              </span>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => startEditingQuestion(index)}
                              className="text-indigo-400 hover:text-indigo-300 transition-colors duration-200 flex items-center"
                            >
                              <FiEdit className="mr-1" /> Edit
                            </button>
                            <button
                              onClick={() => removeQuestion(index)}
                              className="text-red-400 hover:text-red-300 transition-colors duration-200 flex items-center"
                            >
                              <FiTrash2 className="mr-1" /> Delete
                            </button>
                          </div>
                        </div>

                        {question.questionType === "mcq" && (
                          <div className="mt-3">
                            <p className="text-sm text-gray-400 mb-1">
                              Options:
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {question.options.map((option, oIndex) => (
                                <div
                                  key={oIndex}
                                  className={`p-2 rounded ${
                                    option === question.correctAnswer
                                      ? "bg-green-900/30 border border-green-700"
                                      : "bg-gray-700"
                                  }`}
                                >
                                  <span className="text-gray-300">
                                    {oIndex + 1}. {option}
                                    {option === question.correctAnswer && (
                                      <span className="ml-2 text-green-400 text-xs">
                                        (Correct)
                                      </span>
                                    )}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminScheduleExam;
