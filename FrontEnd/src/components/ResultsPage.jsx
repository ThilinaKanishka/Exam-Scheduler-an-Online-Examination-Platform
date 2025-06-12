import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from "@mui/material";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const ResultsPage = () => {
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/examinations"
      );
      setExams(response.data);
    } catch (error) {
      console.error("Error fetching exams:", error);
    }
  };

  const handleSelectExam = async (examId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/examinations/${examId}/results`
      );
      setSelectedExam(examId);
      setResults(response.data);
    } catch (error) {
      console.error("Error fetching results:", error);
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const exam = exams.find((e) => e._id === selectedExam);

    doc.text(`Exam Results: ${exam?.moduleName} - ${exam?.examName}`, 14, 15);

    doc.autoTable({
      startY: 25,
      head: [["Student Name", "IT Number", "Total Marks", "Submission Date"]],
      body: results.map((result) => [
        result.studentName,
        result.itNumber,
        result.totalMarks,
        new Date(result.submittedAt).toLocaleString(),
      ]),
    });

    doc.save(`exam_results_${exam?.examName}.pdf`);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Exam Results
      </Typography>

      <Paper sx={{ padding: 3, marginBottom: 3 }}>
        <Typography variant="h6" gutterBottom>
          Select Exam
        </Typography>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          {exams.map((exam) => (
            <Button
              key={exam._id}
              variant={selectedExam === exam._id ? "contained" : "outlined"}
              onClick={() => handleSelectExam(exam._id)}
            >
              {exam.moduleName} - {exam.examName}
            </Button>
          ))}
        </Box>
      </Paper>

      {selectedExam && (
        <Paper sx={{ padding: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6">Results</Typography>
            <Button variant="contained" onClick={downloadPDF}>
              Download PDF
            </Button>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Student Name</TableCell>
                  <TableCell>IT Number</TableCell>
                  <TableCell>Total Marks</TableCell>
                  <TableCell>Submission Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {results.map((result, index) => (
                  <TableRow key={index}>
                    <TableCell>{result.studentName}</TableCell>
                    <TableCell>{result.itNumber}</TableCell>
                    <TableCell>{result.totalMarks}</TableCell>
                    <TableCell>
                      {new Date(result.submittedAt).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Box>
  );
};

export default ResultsPage;
