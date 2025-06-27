import { useState, useEffect } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

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

      doc.text(`Faculty: ${timetable.faculty || "N/A"}`, 15, 45);
      if (timetable.semester) {
        doc.text(`Semester: ${timetable.semester}`, 15, 52);
      }
      if (timetable.weekType) {
        doc.text(`Week Type: ${timetable.weekType}`, 15, 59);
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div>
      <h2>Student Timetable View</h2>

      {pdfSuccess && (
        <div style={{ color: "green", marginBottom: "10px" }}>
          PDF generated successfully!
        </div>
      )}
      {pdfError && (
        <div style={{ color: "red", marginBottom: "10px" }}>{pdfError}</div>
      )}

      <div style={{ marginBottom: "20px" }}>
        <label>Faculty: </label>
        <select value={faculty} onChange={(e) => setFaculty(e.target.value)}>
          <option value="computing">Computing</option>
          <option value="engineering">Engineering</option>
          <option value="business">Business</option>
          <option value="nursing">Nursing</option>
        </select>

        <label style={{ marginLeft: "10px" }}>Timetable Type: </label>
        <select
          value={timetableType}
          onChange={(e) => setTimetableType(e.target.value)}
        >
          <option value="All">All Types</option>
          <option value="All Semester">All Semester</option>
          <option value="MID Exam">MID Exam</option>
          <option value="Final Exam">Final Exam</option>
          <option value="Peapeat-MID">Peapeat-MID</option>
          <option value="Peapeat-Final">Peapeat-Final</option>
        </select>
      </div>

      {filteredTimetables.length === 0 ? (
        <div>No timetables found for the selected criteria</div>
      ) : (
        <div>
          {filteredTimetables.map((timetable) => (
            <div
              key={timetable._id}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                margin: "10px 0",
              }}
            >
              <h3>
                {timetable.timetableType} - {timetable.faculty}
                {timetable.semester && ` - ${timetable.semester}`}
                {timetable.weekType && ` - ${timetable.weekType}`}
                {timetable.examType && ` - ${timetable.examType}`}
              </h3>

              <table border="1" style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th>Module Name</th>
                    <th>Module Code</th>
                    <th>Instructor</th>
                    <th>Venue</th>
                    <th>Day</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                    {timetable.timetableType !== "All Semester" && (
                      <th>Exam Type</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {timetable.modules.map((module, idx) => (
                    <tr key={idx}>
                      <td>{module.moduleName}</td>
                      <td>{module.moduleCode}</td>
                      <td>{module.instructor}</td>
                      <td>{module.venue}</td>
                      <td>{module.day}</td>
                      <td>{module.startTime}</td>
                      <td>{module.endTime}</td>
                      {timetable.timetableType !== "All Semester" && (
                        <td>
                          {module.examType || timetable.examType || "N/A"}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>

              <button
                onClick={() => downloadAsPDF(timetable)}
                style={{ marginTop: "10px" }}
              >
                Download as PDF
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentTimetable;
