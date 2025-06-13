import React, { useState, useEffect } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";

const ResultsPage = () => {
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState("");
  const [results, setResults] = useState([]);

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

  const handleExamChange = async (e) => {
    const examId = e.target.value;
    setSelectedExam(examId);
    if (examId) {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/exams/exams/${examId}/results`
        );
        setResults(response.data);
      } catch (error) {
        console.error("Error fetching results:", error);
      }
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const exam = exams.find((e) => e._id === selectedExam);

    doc.text(`Exam Results: ${exam?.examName || ""}`, 10, 10);
    doc.text(`Module: ${exam?.moduleName || ""}`, 10, 20);

    let y = 40;
    doc.text("Rank", 10, y);
    doc.text("Student Name", 30, y);
    doc.text("IT Number", 80, y);
    doc.text("Score", 120, y);
    doc.text("Submitted At", 150, y);
    y += 10;

    results.forEach((result, index) => {
      doc.text(`${index + 1}`, 10, y);
      doc.text(result.studentName, 30, y);
      doc.text(result.itNumber, 80, y);
      doc.text(result.score.toString(), 120, y);
      doc.text(new Date(result.submittedAt).toLocaleString(), 150, y);
      y += 10;
    });

    doc.save(`ExamResults_${exam?.examName || "results"}.pdf`);
  };

  return (
    <div>
      <h1>Exam Results</h1>
      <div>
        <label>Select Exam:</label>
        <select value={selectedExam} onChange={handleExamChange}>
          <option value="">-- Select Exam --</option>
          {exams.map((exam) => (
            <option key={exam._id} value={exam._id}>
              {exam.examName} - {exam.moduleName}
            </option>
          ))}
        </select>
      </div>

      {selectedExam && (
        <div>
          <button onClick={downloadPDF}>Download as PDF</button>
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Student Name</th>
                <th>IT Number</th>
                <th>Score</th>
                <th>Submitted At</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => (
                <tr key={result._id}>
                  <td>{index + 1}</td>
                  <td>{result.studentName}</td>
                  <td>{result.itNumber}</td>
                  <td>{result.score}</td>
                  <td>{new Date(result.submittedAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ResultsPage;
