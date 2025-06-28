import { useState, useEffect } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import ClienHeader from "./ClientHeader";
import ClienFooter from "./ClientFooter";
import {
  FiDownload,
  FiFilter,
  FiSearch,
  FiCalendar,
  FiBook,
  FiUser,
  FiClock,
  FiMapPin,
  FiAward,
} from "react-icons/fi";
import { FaUniversity } from "react-icons/fa";

const StudentTimetable = () => {
  const [timetables, setTimetables] = useState([]);
  const [filteredTimetables, setFilteredTimetables] = useState([]);
  const [faculty, setFaculty] = useState("computing");
  const [timetableType, setTimetableType] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pdfSuccess, setPdfSuccess] = useState(false);
  const [pdfError, setPdfError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchTimetables = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/timetables/faculty/${faculty}/${timetableType}`
        );
        setTimetables(response.data);
        setFilteredTimetables(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch timetables");
        setLoading(false);
      }
    };

    fetchTimetables();
  }, [faculty, timetableType]);

  useEffect(() => {
    const results = timetables
      .map((timetable) => ({
        ...timetable,
        modules: timetable.modules.filter(
          (module) =>
            module.moduleName
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            module.moduleCode
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            module.instructor
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            module.venue.toLowerCase().includes(searchTerm.toLowerCase())
        ),
      }))
      .filter((timetable) => timetable.modules.length > 0);

    setFilteredTimetables(results);
  }, [searchTerm, timetables]);

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
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <ClienHeader />

      <div className="w-full px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-indigo-800 mb-2">
            Student Timetable View
          </h2>
          <p className="text-indigo-600">
            View and manage your academic schedules
          </p>
        </div>

        {pdfSuccess && (
          <div className="fixed top-20 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-lg animate-fade-in-out z-50">
            PDF generated successfully!
          </div>
        )}
        {pdfError && (
          <div className="fixed top-20 right-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-lg animate-fade-in-out z-50">
            {pdfError}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="flex items-center space-x-2">
              <FiFilter className="text-indigo-600 text-xl" />
              <h3 className="text-lg font-semibold text-gray-700">Filters</h3>
            </div>

            <div className="relative w-full md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search modules..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <FaUniversity className="inline mr-2 text-indigo-600" />
                Faculty
              </label>
              <select
                value={faculty}
                onChange={(e) => setFaculty(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="computing">Computing</option>
                <option value="engineering">Engineering</option>
                <option value="business">Business</option>
                <option value="nursing">Nursing</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <FiCalendar className="inline mr-2 text-indigo-600" />
                Timetable Type
              </label>
              <select
                value={timetableType}
                onChange={(e) => setTimetableType(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="All">All Types</option>
                <option value="All Semester">All Semester</option>
                <option value="MID Exam">MID Exam</option>
                <option value="Final Exam">Final Exam</option>
                <option value="Peapeat-MID">Peapeat-MID</option>
                <option value="Peapeat-Final">Peapeat-Final</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
            {error}
          </div>
        ) : filteredTimetables.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <FiBook className="mx-auto text-4xl text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No timetables found
            </h3>
            <p className="text-gray-500">
              Try adjusting your filters or search term
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredTimetables.map((timetable) => (
              <div
                key={timetable._id}
                className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
              >
                <div className="bg-indigo-600 px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between">
                  <h3 className="text-xl font-bold text-white">
                    {timetable.timetableType} - {timetable.faculty}
                    {timetable.semester && ` - ${timetable.semester}`}
                    {timetable.weekType && ` - ${timetable.weekType}`}
                    {timetable.examType && ` - ${timetable.examType}`}
                  </h3>
                  <button
                    onClick={() => downloadAsPDF(timetable)}
                    className="mt-2 md:mt-0 px-4 py-2 bg-white text-indigo-600 rounded-lg font-medium flex items-center hover:bg-indigo-50 transition-colors"
                  >
                    <FiDownload className="mr-2" />
                    Download as PDF
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <FiBook className="inline mr-1" />
                          Module
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Code
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <FiUser className="inline mr-1" />
                          Instructor
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <FiMapPin className="inline mr-1" />
                          Venue
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Day
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <FiClock className="inline mr-1" />
                          Time
                        </th>
                        {timetable.timetableType !== "All Semester" && (
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <FiAward className="inline mr-1" />
                            Exam Type
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {timetable.modules.map((module, idx) => (
                        <tr
                          key={idx}
                          className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {module.moduleName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {module.moduleCode}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {module.instructor}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {module.venue}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {module.day}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {module.startTime} - {module.endTime}
                          </td>
                          {timetable.timetableType !== "All Semester" && (
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {module.examType || timetable.examType || "N/A"}
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <ClienFooter />

      {/* Add custom animations to tailwind config */}
      <style jsx global>{`
        @keyframes fadeInOut {
          0%,
          100% {
            opacity: 0;
          }
          10%,
          90% {
            opacity: 1;
          }
        }
        .animate-fade-in-out {
          animation: fadeInOut 3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default StudentTimetable;
