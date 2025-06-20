import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminHeader from "./AdminPanelHeader";
import AdminFooter from "./AdminPanelFooter";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiTrash2,
  FiEdit2,
  FiSave,
  FiX,
  FiCheckCircle,
  FiBook,
  FiCalendar,
  FiClock,
  FiList,
  FiLock,
  FiPlusCircle,
  FiChevronDown,
  FiChevronUp,
  FiAlertCircle,
} from "react-icons/fi";

const AllExam = () => {
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState(null);
  const [updatedExamData, setUpdatedExamData] = useState({
    moduleName: "",
    examName: "",
    examPassword: "",
    examDuration: 0,
    scheduledDate: "",
    questionsToShow: 0,
  });
  const [showAddQuestionForm, setShowAddQuestionForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    questionText: "",
    questionType: "mcq",
    options: ["", "", "", ""],
    correctAnswer: "",
    marks: 1,
  });

  // Fetch all exams
  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/exams/exams"
        );
        setExams(response.data);
      } catch (error) {
        console.error("Error fetching exams:", error);
      }
    };
    fetchExams();
  }, []);

  // Fetch exam details by ID
  const fetchExamDetails = async (examId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/exams/exams/${examId}`
      );
      setSelectedExam(response.data);
      setUpdatedExamData({
        moduleName: response.data.moduleName,
        examName: response.data.examName,
        examPassword: response.data.examPassword,
        examDuration: response.data.examDuration,
        scheduledDate: response.data.scheduledDate,
        questionsToShow: response.data.questionsToShow,
      });
      setShowAddQuestionForm(false);
      setEditMode(false);
    } catch (error) {
      console.error("Error fetching exam details:", error);
    }
  };

  // Handle exam selection
  const handleExamSelect = (examId) => {
    fetchExamDetails(examId);
  };

  // Handle exam details update
  const handleExamUpdate = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/exams/exams/${selectedExam._id}`,
        updatedExamData
      );
      setSelectedExam(response.data.exam);
      alert("Exam updated successfully");
    } catch (error) {
      console.error("Error updating exam:", error);
      alert("Failed to update exam");
    }
  };

  // Handle question update
  const handleQuestionUpdate = async () => {
    try {
      const updatedQuestions = [...selectedExam.questions];
      updatedQuestions[editingQuestion] = {
        ...updatedQuestions[editingQuestion],
        ...updatedQuestionData,
      };

      const response = await axios.put(
        `http://localhost:5000/api/exams/exams/${selectedExam._id}`,
        { questions: updatedQuestions }
      );
      setSelectedExam(response.data.exam);
      setEditingQuestion(null);
      setEditMode(false);
      alert("Question updated successfully");
    } catch (error) {
      console.error("Error updating question:", error);
      alert("Failed to update question");
    }
  };

  // Handle add new question
  const handleAddQuestion = async () => {
    try {
      const updatedQuestions = [...selectedExam.questions, newQuestion];

      const response = await axios.put(
        `http://localhost:5000/api/exams/exams/${selectedExam._id}`,
        { questions: updatedQuestions }
      );

      setSelectedExam(response.data.exam);
      setNewQuestion({
        questionText: "",
        questionType: "mcq",
        options: ["", "", "", ""],
        correctAnswer: "",
        marks: 1,
      });
      setShowAddQuestionForm(false);
      alert("Question added successfully");
    } catch (error) {
      console.error("Error adding question:", error);
      alert("Failed to add question");
    }
  };

  // Handle question delete
  const handleQuestionDelete = async () => {
    try {
      const updatedQuestions = [...selectedExam.questions];
      updatedQuestions.splice(questionToDelete, 1);

      const response = await axios.put(
        `http://localhost:5000/api/exams/exams/${selectedExam._id}`,
        { questions: updatedQuestions }
      );
      setSelectedExam(response.data.exam);
      setOpenDeleteDialog(false);
      if (editingQuestion === questionToDelete) {
        setEditingQuestion(null);
        setEditMode(false);
      }
      alert("Question deleted successfully");
    } catch (error) {
      console.error("Error deleting question:", error);
      alert("Failed to delete question");
    }
  };

  // Handle exam delete
  const handleExamDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/api/exams/exams/${selectedExam._id}`
      );
      setSelectedExam(null);
      setExams(exams.filter((exam) => exam._id !== selectedExam._id));
      alert("Exam deleted successfully");
    } catch (error) {
      console.error("Error deleting exam:", error);
      alert("Failed to delete exam");
    }
  };

  // State for updated question data during editing
  const [updatedQuestionData, setUpdatedQuestionData] = useState({
    questionText: "",
    questionType: "mcq",
    options: ["", "", "", ""],
    correctAnswer: "",
    marks: 1,
  });

  // Start editing a question
  const startEditingQuestion = (index) => {
    setEditingQuestion(index);
    setEditMode(true);
    setUpdatedQuestionData(selectedExam.questions[index]);
    setShowAddQuestionForm(false);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingQuestion(null);
    setEditMode(false);
  };

  // Confirm delete question
  const confirmDeleteQuestion = (index) => {
    setQuestionToDelete(index);
    setOpenDeleteDialog(true);
  };

  // Handle new question text change
  const handleNewQuestionTextChange = (e) => {
    setNewQuestion({
      ...newQuestion,
      questionText: e.target.value,
    });
  };

  // Handle new question type change
  const handleNewQuestionTypeChange = (e) => {
    setNewQuestion({
      ...newQuestion,
      questionType: e.target.value,
    });
  };

  // Handle new option change
  const handleNewOptionChange = (index, e) => {
    const newOptions = [...newQuestion.options];
    newOptions[index] = e.target.value;
    setNewQuestion({
      ...newQuestion,
      options: newOptions,
    });
  };

  // Handle new correct answer change
  const handleNewCorrectAnswerChange = (e) => {
    setNewQuestion({
      ...newQuestion,
      correctAnswer: e.target.value,
    });
  };

  // Handle new marks change
  const handleNewMarksChange = (e) => {
    setNewQuestion({
      ...newQuestion,
      marks: parseInt(e.target.value),
    });
  };

  // Handle question text change
  const handleQuestionTextChange = (e) => {
    setUpdatedQuestionData({
      ...updatedQuestionData,
      questionText: e.target.value,
    });
  };

  // Handle question type change
  const handleQuestionTypeChange = (e) => {
    setUpdatedQuestionData({
      ...updatedQuestionData,
      questionType: e.target.value,
    });
  };

  // Handle option change
  const handleOptionChange = (index, e) => {
    const newOptions = [...updatedQuestionData.options];
    newOptions[index] = e.target.value;
    setUpdatedQuestionData({
      ...updatedQuestionData,
      options: newOptions,
    });
  };

  // Handle correct answer change
  const handleCorrectAnswerChange = (e) => {
    setUpdatedQuestionData({
      ...updatedQuestionData,
      correctAnswer: e.target.value,
    });
  };

  // Handle marks change
  const handleMarksChange = (e) => {
    setUpdatedQuestionData({
      ...updatedQuestionData,
      marks: parseInt(e.target.value),
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 to-purple-50">
      <AdminHeader />
      <main className="flex-1 p-4 md:p-6 w-full max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-indigo-800 mb-6"
        >
          All Exams
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Exams List */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-xl shadow-md p-4 h-full"
            >
              <h2 className="text-xl font-semibold text-indigo-700 mb-3 flex items-center">
                <FiList className="mr-2" />
                Scheduled Exams
              </h2>
              <div className="border-b border-indigo-100 mb-4"></div>
              {exams.length === 0 ? (
                <p className="text-gray-500">No exams scheduled yet</p>
              ) : (
                <div className="space-y-3">
                  {exams.map((exam) => (
                    <motion.div
                      key={exam._id}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div
                        className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                          selectedExam?._id === exam._id
                            ? "bg-indigo-100 border-l-4 border-indigo-500"
                            : "bg-white hover:bg-gray-50 border border-gray-200"
                        }`}
                        onClick={() => handleExamSelect(exam._id)}
                      >
                        <h3 className="font-medium text-indigo-900">
                          {exam.examName}
                        </h3>
                        <p className="text-sm text-indigo-600">
                          {exam.moduleName}
                        </p>
                        <div className="mt-2 space-y-1 text-sm text-gray-600">
                          <div className="flex items-center">
                            <FiCalendar className="mr-2 text-indigo-500" />
                            {new Date(exam.scheduledDate).toLocaleString()}
                          </div>
                          <div className="flex items-center">
                            <FiClock className="mr-2 text-indigo-500" />
                            {exam.examDuration} minutes
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Exam Details */}
          <div className="lg:col-span-2">
            {selectedExam ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-xl shadow-md p-6"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-indigo-800 flex items-center">
                    <FiBook className="mr-2" />
                    Exam Details
                  </h2>
                  <button
                    onClick={handleExamDelete}
                    className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center"
                  >
                    <FiTrash2 className="mr-2" />
                    Delete Exam
                  </button>
                </div>
                <div className="border-b border-indigo-100 mb-6"></div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-indigo-700 mb-1">
                      Module Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiList className="text-indigo-500" />
                      </div>
                      <input
                        type="text"
                        className="pl-10 w-full rounded-lg border border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 py-2 px-3 text-gray-700 leading-tight"
                        value={updatedExamData.moduleName}
                        onChange={(e) =>
                          setUpdatedExamData({
                            ...updatedExamData,
                            moduleName: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-indigo-700 mb-1">
                      Exam Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiBook className="text-indigo-500" />
                      </div>
                      <input
                        type="text"
                        className="pl-10 w-full rounded-lg border border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 py-2 px-3 text-gray-700 leading-tight"
                        value={updatedExamData.examName}
                        onChange={(e) =>
                          setUpdatedExamData({
                            ...updatedExamData,
                            examName: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-indigo-700 mb-1">
                      Exam Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiLock className="text-indigo-500" />
                      </div>
                      <input
                        type="password"
                        className="pl-10 w-full rounded-lg border border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 py-2 px-3 text-gray-700 leading-tight"
                        value={updatedExamData.examPassword}
                        onChange={(e) =>
                          setUpdatedExamData({
                            ...updatedExamData,
                            examPassword: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-indigo-700 mb-1">
                      Duration (minutes)
                    </label>
                    <input
                      type="number"
                      className="w-full rounded-lg border border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 py-2 px-3 text-gray-700 leading-tight"
                      value={updatedExamData.examDuration}
                      onChange={(e) =>
                        setUpdatedExamData({
                          ...updatedExamData,
                          examDuration: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-indigo-700 mb-1">
                      Questions to Show
                    </label>
                    <input
                      type="number"
                      className="w-full rounded-lg border border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 py-2 px-3 text-gray-700 leading-tight"
                      value={updatedExamData.questionsToShow}
                      onChange={(e) =>
                        setUpdatedExamData({
                          ...updatedExamData,
                          questionsToShow: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-indigo-700 mb-1">
                      Scheduled Date
                    </label>
                    <input
                      type="text"
                      disabled
                      className="w-full rounded-lg border border-indigo-200 bg-gray-100 py-2 px-3 text-gray-700 cursor-not-allowed"
                      value={new Date(
                        updatedExamData.scheduledDate
                      ).toLocaleString()}
                    />
                  </div>
                </div>

                <button
                  onClick={handleExamUpdate}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg"
                >
                  Update Exam Details
                </button>

                <div className="mt-8">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-indigo-800">
                      Questions ({selectedExam.questions.length})
                    </h3>
                    <button
                      onClick={() => {
                        setShowAddQuestionForm(!showAddQuestionForm);
                        setEditMode(false);
                      }}
                      className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors flex items-center"
                    >
                      <FiPlusCircle className="mr-2" />
                      {showAddQuestionForm ? "Cancel" : "Add Question"}
                    </button>
                  </div>
                  <div className="border-b border-indigo-100 mb-4"></div>

                  {/* Add New Question Form */}
                  <AnimatePresence>
                    {showAddQuestionForm && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="bg-indigo-50 rounded-lg p-4 mb-6 border-l-4 border-indigo-500">
                          <h4 className="text-lg font-medium text-indigo-800 mb-3">
                            Add New Question
                          </h4>
                          <textarea
                            className="w-full rounded-lg border border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 py-2 px-3 text-gray-700 leading-tight mb-4 min-h-[80px]"
                            placeholder="Question Text"
                            value={newQuestion.questionText}
                            onChange={handleNewQuestionTextChange}
                          />

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <label className="block text-sm font-medium text-indigo-700 mb-1">
                                Question Type
                              </label>
                              <select
                                className="w-full rounded-lg border border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 py-2 px-3 text-gray-700 leading-tight"
                                value={newQuestion.questionType}
                                onChange={handleNewQuestionTypeChange}
                              >
                                <option value="mcq">Multiple Choice</option>
                                <option value="structured">Structured</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-indigo-700 mb-1">
                                Marks
                              </label>
                              <input
                                type="number"
                                className="w-full rounded-lg border border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 py-2 px-3 text-gray-700 leading-tight"
                                value={newQuestion.marks}
                                onChange={handleNewMarksChange}
                              />
                            </div>
                          </div>

                          {newQuestion.questionType === "mcq" && (
                            <div className="mt-4">
                              <h5 className="text-sm font-medium text-indigo-700 mb-2">
                                Options
                              </h5>
                              {newQuestion.options.map((option, oIndex) => (
                                <input
                                  key={oIndex}
                                  type="text"
                                  className="w-full rounded-lg border border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 py-2 px-3 text-gray-700 leading-tight mb-2"
                                  placeholder={`Option ${oIndex + 1}`}
                                  value={option}
                                  onChange={(e) =>
                                    handleNewOptionChange(oIndex, e)
                                  }
                                />
                              ))}

                              <div className="mt-4">
                                <h5 className="text-sm font-medium text-indigo-700 mb-2">
                                  Correct Answer
                                </h5>
                                <div className="space-y-2">
                                  {newQuestion.options.map((option, oIndex) => (
                                    <label
                                      key={oIndex}
                                      className={`flex items-center p-2 rounded-lg ${
                                        newQuestion.correctAnswer === option
                                          ? "bg-green-100 border border-green-300"
                                          : "bg-gray-50 border border-gray-200"
                                      }`}
                                    >
                                      <input
                                        type="radio"
                                        name="correctAnswer"
                                        value={option}
                                        checked={
                                          newQuestion.correctAnswer === option
                                        }
                                        onChange={handleNewCorrectAnswerChange}
                                        className="text-indigo-600 focus:ring-indigo-500"
                                        disabled={!option.trim()}
                                      />
                                      <span className="ml-2 text-sm text-gray-700">
                                        Option {oIndex + 1}:{" "}
                                        {option || "[Empty]"}
                                      </span>
                                    </label>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="flex justify-end space-x-3 mt-4">
                            <button
                              onClick={() => setShowAddQuestionForm(false)}
                              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
                            >
                              <FiX className="mr-2" />
                              Cancel
                            </button>
                            <button
                              onClick={handleAddQuestion}
                              disabled={!newQuestion.questionText.trim()}
                              className={`px-4 py-2 rounded-lg flex items-center ${
                                !newQuestion.questionText.trim()
                                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                  : "bg-green-600 text-white hover:bg-green-700"
                              }`}
                            >
                              <FiSave className="mr-2" />
                              Add Question
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Questions List */}
                  <div className="space-y-4">
                    <AnimatePresence>
                      {selectedExam.questions.map((question, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.3 }}
                          layout
                        >
                          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-4">
                              {editMode && editingQuestion === index ? (
                                <div>
                                  <textarea
                                    className="w-full rounded-lg border border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 py-2 px-3 text-gray-700 leading-tight mb-4 min-h-[80px]"
                                    placeholder="Question Text"
                                    value={updatedQuestionData.questionText}
                                    onChange={handleQuestionTextChange}
                                  />

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                      <label className="block text-sm font-medium text-indigo-700 mb-1">
                                        Question Type
                                      </label>
                                      <select
                                        className="w-full rounded-lg border border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 py-2 px-3 text-gray-700 leading-tight"
                                        value={updatedQuestionData.questionType}
                                        onChange={handleQuestionTypeChange}
                                      >
                                        <option value="mcq">
                                          Multiple Choice
                                        </option>
                                        <option value="structured">
                                          Structured
                                        </option>
                                      </select>
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium text-indigo-700 mb-1">
                                        Marks
                                      </label>
                                      <input
                                        type="number"
                                        className="w-full rounded-lg border border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 py-2 px-3 text-gray-700 leading-tight"
                                        value={updatedQuestionData.marks}
                                        onChange={handleMarksChange}
                                      />
                                    </div>
                                  </div>

                                  {updatedQuestionData.questionType ===
                                    "mcq" && (
                                    <div className="mt-4">
                                      <h5 className="text-sm font-medium text-indigo-700 mb-2">
                                        Options
                                      </h5>
                                      {updatedQuestionData.options.map(
                                        (option, oIndex) => (
                                          <input
                                            key={oIndex}
                                            type="text"
                                            className="w-full rounded-lg border border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 py-2 px-3 text-gray-700 leading-tight mb-2"
                                            placeholder={`Option ${oIndex + 1}`}
                                            value={option}
                                            onChange={(e) =>
                                              handleOptionChange(oIndex, e)
                                            }
                                          />
                                        )
                                      )}

                                      <div className="mt-4">
                                        <h5 className="text-sm font-medium text-indigo-700 mb-2">
                                          Correct Answer
                                        </h5>
                                        <div className="space-y-2">
                                          {updatedQuestionData.options.map(
                                            (option, oIndex) => (
                                              <label
                                                key={oIndex}
                                                className={`flex items-center p-2 rounded-lg ${
                                                  updatedQuestionData.correctAnswer ===
                                                  option
                                                    ? "bg-green-100 border border-green-300"
                                                    : "bg-gray-50 border border-gray-200"
                                                }`}
                                              >
                                                <input
                                                  type="radio"
                                                  name="correctAnswerEdit"
                                                  value={option}
                                                  checked={
                                                    updatedQuestionData.correctAnswer ===
                                                    option
                                                  }
                                                  onChange={
                                                    handleCorrectAnswerChange
                                                  }
                                                  className="text-indigo-600 focus:ring-indigo-500"
                                                  disabled={!option.trim()}
                                                />
                                                <span className="ml-2 text-sm text-gray-700">
                                                  Option {oIndex + 1}:{" "}
                                                  {option || "[Empty]"}
                                                </span>
                                              </label>
                                            )
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  <div className="flex justify-end space-x-3 mt-4">
                                    <button
                                      onClick={cancelEditing}
                                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
                                    >
                                      <FiX className="mr-2" />
                                      Cancel
                                    </button>
                                    <button
                                      onClick={handleQuestionUpdate}
                                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
                                    >
                                      <FiSave className="mr-2" />
                                      Save
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div>
                                  <div className="flex justify-between items-start">
                                    <h4 className="text-lg font-medium text-indigo-900">
                                      Question {index + 1}
                                    </h4>
                                    <div className="flex space-x-2">
                                      <button
                                        onClick={() =>
                                          startEditingQuestion(index)
                                        }
                                        className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-full transition-colors"
                                        title="Edit"
                                      >
                                        <FiEdit2 />
                                      </button>
                                      <button
                                        onClick={() =>
                                          confirmDeleteQuestion(index)
                                        }
                                        className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors"
                                        title="Delete"
                                      >
                                        <FiTrash2 />
                                      </button>
                                    </div>
                                  </div>

                                  <p className="mt-2 text-gray-700">
                                    {question.questionText}
                                  </p>

                                  <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                                    <div>
                                      <span className="font-medium text-indigo-700">
                                        Type:
                                      </span>{" "}
                                      {question.questionType}
                                    </div>
                                    <div>
                                      <span className="font-medium text-indigo-700">
                                        Marks:
                                      </span>{" "}
                                      {question.marks}
                                    </div>
                                  </div>

                                  {question.questionType === "mcq" && (
                                    <div className="mt-4">
                                      <h5 className="text-sm font-medium text-indigo-700 mb-2">
                                        Options
                                      </h5>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        {question.options.map(
                                          (option, oIndex) =>
                                            option && (
                                              <div
                                                key={oIndex}
                                                className={`p-2 rounded-lg border ${
                                                  option ===
                                                  question.correctAnswer
                                                    ? "bg-green-50 border-green-200"
                                                    : "bg-gray-50 border-gray-200"
                                                }`}
                                              >
                                                <div className="flex items-center">
                                                  {option ===
                                                    question.correctAnswer && (
                                                    <FiCheckCircle className="text-green-500 mr-2" />
                                                  )}
                                                  <span>
                                                    Option {oIndex + 1}:{" "}
                                                    {option}
                                                  </span>
                                                </div>
                                              </div>
                                            )
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-xl shadow-md p-8 text-center"
              >
                <div className="text-indigo-400 mb-4">
                  <FiBook className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-xl font-medium text-indigo-800 mb-2">
                  Select an exam to view details
                </h3>
                <p className="text-gray-600">
                  Choose an exam from the list to see its questions and settings
                </p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Delete confirmation dialog */}
        <AnimatePresence>
          {openDeleteDialog && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full"
              >
                <div className="flex items-center mb-4">
                  <div className="bg-red-100 p-3 rounded-full mr-4">
                    <FiAlertCircle className="text-red-600 w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Confirm Delete
                  </h3>
                </div>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete this question? This action
                  cannot be undone.
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setOpenDeleteDialog(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleQuestionDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <AdminFooter />
    </div>
  );
};

export default AllExam;
