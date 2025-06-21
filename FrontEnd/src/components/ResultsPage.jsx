import React, { useState, useEffect } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { motion, AnimatePresence } from "framer-motion";
import AdminHeader from "./AdminPanelHeader";
import AdminFooter from "./AdminPanelFooter";

const ResultsPage = () => {
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState("");
  const [results, setResults] = useState([]);
  const [examDetails, setExamDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pdfError, setPdfError] = useState(null);
  const [pdfSuccess, setPdfSuccess] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchExams = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          "http://localhost:5000/api/exams/exams"
        );
        setExams(response.data);
      } catch (error) {
        console.error("Error fetching exams:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchExams();
  }, []);

  const handleExamSelect = async (examId) => {
    setSelectedExam(examId);
    if (examId) {
      try {
        setIsLoading(true);
        const exam = exams.find((e) => e._id === examId);
        setExamDetails(exam);

        const response = await axios.get(
          `http://localhost:5000/api/exams/exams/${examId}/results`
        );
        setResults(response.data);
      } catch (error) {
        console.error("Error fetching results:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setExamDetails(null);
      setResults([]);
    }
  };

  const downloadPDF = () => {
    try {
      setPdfSuccess(false);
      setPdfError(null);

      if (!results.length) {
        throw new Error("No results available to generate PDF");
      }

      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
      });

      // Header with gradient background
      doc.setFillColor(30, 58, 138);
      doc.rect(0, 0, doc.internal.pageSize.getWidth(), 25, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("ExamSync Campus", doc.internal.pageSize.getWidth() / 2, 17, {
        align: "center",
      });

      doc.setTextColor(30, 58, 138);
      doc.setFontSize(16);
      doc.text(
        "EXAMINATION RESULTS REPORT",
        doc.internal.pageSize.getWidth() / 2,
        35,
        {
          align: "center",
        }
      );

      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "normal");

      doc.text(`Module Name: ${examDetails?.moduleName || "N/A"}`, 15, 45);
      doc.text(`Exam Name: ${examDetails?.examName || "N/A"}`, 15, 52);

      doc.text(
        `Academic Year: 2023/2024`,
        doc.internal.pageSize.getWidth() - 15,
        45,
        {
          align: "right",
        }
      );
      doc.text(
        `Report Date: ${new Date().toLocaleDateString()}`,
        doc.internal.pageSize.getWidth() - 15,
        52,
        {
          align: "right",
        }
      );

      doc.setDrawColor(200, 200, 200);
      doc.line(15, 58, doc.internal.pageSize.getWidth() - 15, 58);

      // Table data preparation
      const headers = [
        [
          "Rank",
          "Student Name",
          "IT Number",
          "Marks",
          "Grade",
          "Submission Date",
          "Status",
        ],
      ];

      const data = results.map((result, index) => {
        const grade =
          result.score >= 75
            ? "A"
            : result.score >= 65
            ? "B"
            : result.score >= 50
            ? "C"
            : result.score >= 35
            ? "D"
            : "F";

        const status = result.score >= 50 ? "Pass" : "Fail";

        return [
          index + 1,
          result.studentName,
          result.itNumber,
          result.score,
          grade,
          new Date(result.submittedAt).toLocaleDateString(),
          {
            content: status,
            styles: {
              textColor: [255, 0, 0], // White text for status
              fontStyle: "bold",
            },
          },
        ];
      });

      autoTable(doc, {
        head: headers,
        body: data,
        startY: 65,
        margin: { left: 5, right: 5 },
        tableWidth: "auto",
        headStyles: {
          fillColor: [30, 58, 138],
          textColor: 255,
          fontStyle: "bold",
          fontSize: 10,
          cellPadding: 4,
        },
        bodyStyles: {
          fontSize: 9,
          cellPadding: 3,
        },
        alternateRowStyles: {
          fillColor: [240, 240, 240],
        },
        columnStyles: {
          0: { cellWidth: 20, halign: "center" },
          1: { cellWidth: "auto" },
          2: { cellWidth: 30, halign: "center" },
          3: { cellWidth: 20, halign: "center" },
          4: { cellWidth: 20, halign: "center" },
          5: { cellWidth: 25, halign: "center" },
          6: {
            cellWidth: 25,
            halign: "center",
            fillColor: (row) => {
              return row.raw[6] === "Pass" ? [34, 197, 94] : [239, 68, 68];
            },
          },
        },
        didDrawPage: (data) => {
          doc.setFontSize(8);
          doc.setTextColor(100);
          doc.text(
            `Page ${data.pageCount} of ${
              data.pageNumber
            } - Auto Generated Report | ${new Date().toLocaleString()}`,
            doc.internal.pageSize.getWidth() / 2,
            doc.internal.pageSize.getHeight() - 10,
            { align: "center" }
          );
        },
      });

      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      doc.save(
        `ExamSync_Results_${examDetails?.examName || "report"}_${timestamp}.pdf`
      );

      setPdfSuccess(true);
      setTimeout(() => setPdfSuccess(false), 3000);
    } catch (error) {
      console.error("PDF generation failed:", error);
      setPdfError(error.message);
    }
  };

  const filteredResults = results.filter((result) => {
    return (
      result.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.itNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-50">
      <AdminHeader />

      <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Examination Results
          </h1>
          <p className="text-lg text-gray-600">
            View and manage student examination results
          </p>
        </motion.div>

        {/* Exam Selection Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Select an Exam
          </h2>

          {isLoading && exams.length === 0 ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {exams.map((exam) => (
                <motion.div
                  key={exam._id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className={`bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transition-all duration-200 border-2 ${
                    selectedExam === exam._id
                      ? "border-blue-500 ring-2 ring-blue-200"
                      : "border-transparent hover:border-blue-300"
                  }`}
                  onClick={() => handleExamSelect(exam._id)}
                >
                  <div className="p-5">
                    <div className="flex items-center mb-3">
                      <div className="p-3 rounded-lg bg-blue-100 text-blue-600 mr-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-bold text-gray-800">
                        {exam.examName}
                      </h3>
                    </div>
                    <p className="text-gray-600 mb-2">
                      <span className="font-medium">Module:</span>{" "}
                      {exam.moduleName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(exam.examDate).toLocaleDateString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Results Section */}
        {selectedExam && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-xl overflow-hidden"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
              <div className="mb-4 md:mb-0">
                <h2 className="text-xl font-bold text-white">
                  {examDetails?.examName} Results
                </h2>
                <p className="text-blue-100">
                  Module: {examDetails?.moduleName}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search students..."
                    className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={downloadPDF}
                  className="bg-white hover:bg-gray-100 text-blue-600 font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center shadow-md"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Export PDF
                </motion.button>
              </div>
            </div>

            <AnimatePresence>
              {pdfError && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mx-4 mt-4 rounded"
                >
                  <p>PDF Generation Error: {pdfError}</p>
                </motion.div>
              )}

              {pdfSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mx-4 mt-4 rounded"
                >
                  <p>PDF generated successfully!</p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="overflow-x-auto max-h-screen">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rank
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      IT Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Marks
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Grade
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredResults.length > 0 ? (
                    filteredResults.map((result, index) => {
                      const grade =
                        result.score >= 75
                          ? "A"
                          : result.score >= 65
                          ? "B"
                          : result.score >= 50
                          ? "C"
                          : result.score >= 35
                          ? "D"
                          : "F";
                      const status = result.score >= 50 ? "Pass" : "Fail";

                      return (
                        <motion.tr
                          key={result._id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {result.studentName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                            {result.itNumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                            {result.score}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            <span
                              className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
                                grade === "A"
                                  ? "bg-green-100 text-green-800"
                                  : grade === "B"
                                  ? "bg-blue-100 text-blue-800"
                                  : grade === "C"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : grade === "D"
                                  ? "bg-orange-100 text-orange-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {grade}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(result.submittedAt).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${
                                status === "Pass"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {status}
                            </span>
                          </td>
                        </motion.tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan="7"
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        {searchTerm
                          ? "No matching results found"
                          : "No results available"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </main>

      <AdminFooter />
    </div>
  );
};

export default ResultsPage;
