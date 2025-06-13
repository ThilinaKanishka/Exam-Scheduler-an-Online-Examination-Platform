import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ExamDetailsPage = () => {
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState("");
  const [studentDetails, setStudentDetails] = useState({
    studentName: "",
    itNumber: "",
    examPassword: "",
  });
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const fetchExams = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/exams/exams");
      setExams(response.data);
    } catch (error) {
      console.error("Error fetching exams:", error);
    }
  };

  React.useEffect(() => {
    fetchExams();
  }, []);

  const handleExamChange = (e) => {
    setSelectedExam(e.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStudentDetails({ ...studentDetails, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Verify exam password
      const response = await axios.post(
        "http://localhost:5000/api/exams/exams/verify-password",
        {
          examId: selectedExam,
          password: studentDetails.examPassword,
        }
      );

      if (response.data.message === "Password verified") {
        navigate(`/student-exam/${selectedExam}`, {
          state: {
            studentName: studentDetails.studentName,
            itNumber: studentDetails.itNumber,
          },
        });
      }
    } catch (error) {
      setError("Invalid exam password or exam not found");
      console.error("Error verifying password:", error);
    }
  };

  return (
    <div>
      <h1>Exam Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Select Exam:</label>
          <select value={selectedExam} onChange={handleExamChange} required>
            <option value="">-- Select Exam --</option>
            {exams.map((exam) => (
              <option key={exam._id} value={exam._id}>
                {exam.examName} - {exam.moduleName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Student Name:</label>
          <input
            type="text"
            name="studentName"
            value={studentDetails.studentName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>IT Number:</label>
          <input
            type="text"
            name="itNumber"
            value={studentDetails.itNumber}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Exam Password:</label>
          <input
            type="password"
            name="examPassword"
            value={studentDetails.examPassword}
            onChange={handleInputChange}
            required
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Start Exam</button>
      </form>
    </div>
  );
};

export default ExamDetailsPage;
