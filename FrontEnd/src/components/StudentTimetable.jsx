import { useState, useEffect } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import ClienHeader from "./ClientHeader";
import ClienFooter from "./ClientFooter";

const StudentTimetable = () => {
  const [timetables, setTimetables] = useState([]);
  const [filteredTimetables, setFilteredTimetables] = useState([]);
  const [faculty, setFaculty] = useState("computing");
  const [timetableType, setTimetableType] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pdfSuccess, setPdfSuccess] = useState(false);
  const [pdfError, setPdfError] = useState(null);

  useEffect(() => {
    const fetchTimetables = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:5000/api/timetables/faculty/${faculty}/${timetableType}`
        );
        setTimetables(response.data);
        setFilteredTimetables(response.data);
        setError("");
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch timetables");
        setTimetables([]);
        setFilteredTimetables([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTimetables();
  }, [faculty, timetableType]);

  const downloadAsPDF = (timetable) => {
    try {
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
        `${timetable.timetableType.toUpperCase()} TIMETABLE - ${
          timetable.semester || ""
        }`,
        doc.internal.pageSize.getWidth() / 2,
        35,
        { align: "center" }
      );

      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "normal");

      // Faculty and semester information
      doc.text(`Faculty: ${timetable.faculty || "N/A"}`, 15, 45);
      if (timetable.semester) {
        doc.text(`Semester: ${timetable.semester}`, 15, 52);
      }
      if (timetable.weekType) {
        doc.text(
          `Week Type: ${timetable.weekType}`,
          15,
          timetable.semester ? 59 : 52
        );
      }

      doc.text(
        `Academic Year: ${new Date().getFullYear()}/${
          new Date().getFullYear() + 1
        }`,
        doc.internal.pageSize.getWidth() - 15,
        45,
        { align: "right" }
      );
      doc.text(
        `Generated: ${new Date().toLocaleDateString()}`,
        doc.internal.pageSize.getWidth() - 15,
        52,
        { align: "right" }
      );

      doc.setDrawColor(200, 200, 200);
      doc.line(15, 70, doc.internal.pageSize.getWidth() - 15, 70);

      // Table data preparation
      const headers = [
        [
          "Day",
          "Module Name",
          "Module Code",
          "Venue",
          "Start Time",
          "End Time",
          "Instructor",
          ...(timetable.timetableType !== "All Semester" ? ["Exam Type"] : []),
        ],
      ];

      const data = timetable.modules.map((module) => [
        module.day,
        module.moduleName,
        module.moduleCode,
        module.venue,
        module.startTime,
        module.endTime,
        module.instructor,
        ...(timetable.timetableType !== "All Semester"
          ? [module.examType || "N/A"]
          : []),
      ]);

      autoTable(doc, {
        head: headers,
        body: data,
        startY: 75,
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
          2: { cellWidth: 25, halign: "center" },
          3: { cellWidth: 25, halign: "center" },
          4: { cellWidth: 20, halign: "center" },
          5: { cellWidth: 20, halign: "center" },
          6: { cellWidth: "auto" },
          ...(timetable.timetableType !== "All Semester"
            ? { 7: { cellWidth: 30, halign: "center" } }
            : {}),
        },
        didDrawPage: (data) => {
          doc.setFontSize(8);
          doc.setTextColor(100);
          doc.text(
            `Page ${data.pageNumber} of ${data.pageCount}`,
            doc.internal.pageSize.getWidth() / 2,
            doc.internal.pageSize.getHeight() - 10,
            { align: "center" }
          );
        },
      });

      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const filename = `ExamSync_${timetable.timetableType.replace(
        /\s+/g,
        "_"
      )}_${timetable.faculty}_${timetable.semester || ""}_${timestamp}.pdf`;
      doc.save(filename);

      setPdfSuccess(true);
      setTimeout(() => setPdfSuccess(false), 3000);
    } catch (error) {
      console.error("PDF generation failed:", error);
      setPdfError(error.message);
      setTimeout(() => setPdfError(null), 3000);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-gray-50">
      {/* Header - Full Width */}
      <div className="w-full">
        <ClienHeader />
      </div>

      {/* Main Content - Full Width */}
      <main className="flex-grow w-full px-6 py-8">
        {/* Page Title - Full Width */}
        <div className="w-full mb-8">
          <h1 className="text-4xl font-bold text-gray-900 text-center">
            Student Timetables
          </h1>
          <p className="text-lg text-gray-600 text-center mt-2">
            View and download academic timetables by faculty and type
          </p>
        </div>

        {/* Status Messages - Full Width */}
        <div className="w-full mb-6 space-y-4">
          {pdfSuccess && (
            <div className="w-full bg-green-100 border-l-4 border-green-500 text-green-700 px-6 py-4 rounded-md shadow-sm">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                PDF generated successfully!
              </div>
            </div>
          )}

          {pdfError && (
            <div className="w-full bg-red-100 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-md shadow-sm">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                {pdfError}
              </div>
            </div>
          )}

          {error && (
            <div className="w-full bg-red-100 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-md shadow-sm">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                {error}
              </div>
            </div>
          )}
        </div>

        {/* Filters Section - Full Width */}
        <div className="w-full bg-white rounded-lg shadow-lg mb-8 p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
            <svg
              className="w-6 h-6 mr-3 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z"
              />
            </svg>
            Filter Options
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Faculty Selection
              </label>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                value={faculty}
                onChange={(e) => setFaculty(e.target.value)}
              >
                <option value="computing">Faculty of Computing</option>
                <option value="engineering">Faculty of Engineering</option>
                <option value="business">Faculty of Business</option>
                <option value="nursing">Faculty of Nursing</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Timetable Type
              </label>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                value={timetableType}
                onChange={(e) => setTimetableType(e.target.value)}
              >
                <option value="All">All Types</option>
                <option value="All Semester">All Semester</option>
                <option value="MID Exam">MID Exam</option>
                <option value="Final Exam">Final Exam</option>
                <option value="Peapeat-MID">Repeat-MID</option>
                <option value="Peapeat-Final">Repeat-Final</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div
                  className={`w-3 h-3 rounded-full mr-2 ${
                    loading ? "bg-yellow-500 animate-pulse" : "bg-green-500"
                  }`}
                ></div>
                <span className="text-sm text-gray-600">
                  {loading
                    ? "Loading..."
                    : `${filteredTimetables.length} timetables found`}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Quick Actions
              </label>
              <button
                onClick={() => window.location.reload()}
                className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Refresh Data
              </button>
            </div>
          </div>
        </div>

        {/* Content Area - Full Width */}
        <div className="w-full">
          {loading ? (
            <div className="w-full flex justify-center items-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
                <p className="text-xl text-gray-600">Loading timetables...</p>
                <p className="text-sm text-gray-500 mt-2">
                  Please wait while we fetch the data
                </p>
              </div>
            </div>
          ) : filteredTimetables.length === 0 ? (
            <div className="w-full text-center py-20 bg-white rounded-lg shadow-sm">
              <svg
                className="w-20 h-20 text-gray-400 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                No Timetables Found
              </h3>
              <p className="text-gray-500 mb-6">
                No timetables match the selected criteria. Try adjusting your
                filters.
              </p>
              <div className="space-x-4">
                <button
                  onClick={() => {
                    setFaculty("computing");
                    setTimetableType("All");
                  }}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200"
                >
                  Reset Filters
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-200"
                >
                  Refresh Page
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full space-y-8">
              {filteredTimetables.map((timetable, index) => (
                <div
                  key={timetable._id}
                  className="w-full bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300"
                >
                  {/* Timetable Header */}
                  <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2 lg:mb-0">
                          {timetable.timetableType} - {timetable.faculty}
                        </h3>
                        <div className="flex flex-wrap gap-4 text-blue-100 text-sm">
                          {timetable.semester && (
                            <span className="flex items-center">
                              <svg
                                className="w-4 h-4 mr-1"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Semester: {timetable.semester}
                            </span>
                          )}
                          {timetable.weekType && (
                            <span className="flex items-center">
                              <svg
                                className="w-4 h-4 mr-1"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Week: {timetable.weekType}
                            </span>
                          )}
                          {timetable.examType && (
                            <span className="flex items-center">
                              <svg
                                className="w-4 h-4 mr-1"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Type: {timetable.examType}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="mt-4 lg:mt-0">
                        <button
                          onClick={() => downloadAsPDF(timetable)}
                          className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          Download PDF
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Timetable Content */}
                  <div className="w-full overflow-x-auto">
                    <table className="w-full min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Module Details
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Code
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Instructor
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Schedule
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Venue
                          </th>
                          {timetable.timetableType !== "All Semester" && (
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Exam Type
                            </th>
                          )}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {timetable.modules.map((module, idx) => (
                          <tr
                            key={idx}
                            className={`${
                              idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                            } hover:bg-blue-50 transition-colors duration-200`}
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex flex-col">
                                <div className="text-sm font-medium text-gray-900">
                                  {module.moduleName}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {module.day}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {module.moduleCode}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {module.instructor}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex flex-col text-sm">
                                <span className="text-gray-900 font-medium">
                                  {module.startTime} - {module.endTime}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                {module.venue}
                              </span>
                            </td>
                            {timetable.timetableType !== "All Semester" && (
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                  {module.examType ||
                                    timetable.examType ||
                                    "N/A"}
                                </span>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Timetable Footer */}
                  <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div className="text-sm text-gray-500 mb-2 sm:mb-0">
                        Total modules: {timetable.modules.length}
                      </div>
                      <div className="text-sm text-gray-500">
                        Timetable #{index + 1}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer - Full Width */}
      <div className="w-full mt-auto">
        <ClienFooter />
      </div>
    </div>
  );
};

export default StudentTimetable;
