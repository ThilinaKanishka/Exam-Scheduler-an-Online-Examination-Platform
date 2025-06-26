import { useState, useEffect } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const AllTimetable = () => {
  const [timetables, setTimetables] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedTimetable, setEditedTimetable] = useState(null);
  const [newModule, setNewModule] = useState({
    moduleName: "",
    moduleCode: "",
    instructor: "",
    venue: "",
    day: "Monday",
    startTime: "08:00",
    endTime: "09:00",
    examType: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchTimetables = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/timetables"
        );
        setTimetables(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch timetables");
        setLoading(false);
      }
    };

    fetchTimetables();
  }, []);

  const handleEdit = (timetable) => {
    setEditingId(timetable._id);
    setEditedTimetable({
      ...timetable,
      modules: timetable.modules.map((module) => ({ ...module })),
    });
  };

  const handleModuleChange = (index, field, value) => {
    const updatedModules = editedTimetable.modules.map((module, i) =>
      i === index ? { ...module, [field]: value } : module
    );
    setEditedTimetable({ ...editedTimetable, modules: updatedModules });
  };

  const addNewModule = () => {
    if (
      !newModule.moduleName ||
      !newModule.moduleCode ||
      !newModule.instructor ||
      !newModule.venue
    ) {
      setError("Please fill all required module fields");
      return;
    }

    // Create module without examType by default
    const moduleToAdd = {
      moduleName: newModule.moduleName,
      moduleCode: newModule.moduleCode,
      instructor: newModule.instructor,
      venue: newModule.venue,
      day: newModule.day,
      startTime: newModule.startTime,
      endTime: newModule.endTime,
    };

    // Only add examType if it's an exam timetable and value is provided
    if (
      editedTimetable.timetableType !== "All Semester" &&
      newModule.examType
    ) {
      moduleToAdd.examType = newModule.examType;
    }

    setEditedTimetable({
      ...editedTimetable,
      modules: [...editedTimetable.modules, moduleToAdd],
    });

    setNewModule({
      moduleName: "",
      moduleCode: "",
      instructor: "",
      venue: "",
      day: "Monday",
      startTime: "08:00",
      endTime: "09:00",
      examType: "",
    });
    setError("");
  };

  const removeModule = (index) => {
    const updatedModules = editedTimetable.modules.filter(
      (_, i) => i !== index
    );
    setEditedTimetable({ ...editedTimetable, modules: updatedModules });
  };

  const saveChanges = async () => {
    try {
      // Validate exam types for exam timetables
      if (editedTimetable.timetableType !== "All Semester") {
        const modulesWithoutExamType = editedTimetable.modules.filter(
          (module) => !module.examType
        );
        if (modulesWithoutExamType.length > 0) {
          throw new Error(
            "All modules must have an exam type for exam timetables"
          );
        }
      }

      const response = await axios.put(
        `http://localhost:5000/api/timetables/${editingId}`,
        { modules: editedTimetable.modules }
      );

      setTimetables(
        timetables.map((t) =>
          t._id === editingId ? { ...t, modules: response.data.modules } : t
        )
      );

      setEditingId(null);
      setEditedTimetable(null);
      setSuccess("Timetable updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(
        err.response?.data?.error || err.message || "Failed to update timetable"
      );
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this timetable?"))
      return;

    try {
      await axios.delete(`http://localhost:5000/api/timetables/${id}`);
      setTimetables(timetables.filter((t) => t._id !== id));
      setSuccess("Timetable deleted successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete timetable");
      setTimeout(() => setError(""), 3000);
    }
  };

  const generatePDF = (timetable) => {
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
            ? { 7: { cellWidth: 25, halign: "center" } }
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
    } catch (err) {
      setError("Failed to generate PDF: " + err.message);
      setTimeout(() => setError(""), 3000);
    }
  };
  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="timetable-admin-container">
      <h2>All Generated Timetables</h2>
      {success && <div className="success-message">{success}</div>}

      {timetables.length === 0 ? (
        <div>No timetables found</div>
      ) : (
        <div className="timetable-list">
          {timetables.map((timetable) => (
            <div key={timetable._id} className="timetable-card">
              <h3>
                {timetable.timetableType} - {timetable.faculty}
                {timetable.semester && ` - ${timetable.semester}`}
                {timetable.weekType && ` - ${timetable.weekType}`}
              </h3>

              {editingId === timetable._id ? (
                <>
                  <table className="edit-table">
                    <thead>
                      <tr>
                        <th>Day</th>
                        <th>Module Name</th>
                        <th>Module Code</th>
                        <th>Venue</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                        <th>Instructor</th>
                        {timetable.timetableType !== "All Semester" && (
                          <th>Exam Type</th>
                        )}
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {editedTimetable?.modules?.map((module, idx) => (
                        <tr key={idx}>
                          <td>
                            <select
                              value={module.day}
                              onChange={(e) =>
                                handleModuleChange(idx, "day", e.target.value)
                              }
                            >
                              {[
                                "Monday",
                                "Tuesday",
                                "Wednesday",
                                "Thursday",
                                "Friday",
                                "Saturday",
                                "Sunday",
                              ].map((day) => (
                                <option key={day} value={day}>
                                  {day}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td>
                            <input
                              type="text"
                              value={module.moduleName}
                              onChange={(e) =>
                                handleModuleChange(
                                  idx,
                                  "moduleName",
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={module.moduleCode}
                              onChange={(e) =>
                                handleModuleChange(
                                  idx,
                                  "moduleCode",
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={module.venue}
                              onChange={(e) =>
                                handleModuleChange(idx, "venue", e.target.value)
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="time"
                              value={module.startTime}
                              onChange={(e) =>
                                handleModuleChange(
                                  idx,
                                  "startTime",
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="time"
                              value={module.endTime}
                              onChange={(e) =>
                                handleModuleChange(
                                  idx,
                                  "endTime",
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={module.instructor}
                              onChange={(e) =>
                                handleModuleChange(
                                  idx,
                                  "instructor",
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          {timetable.timetableType !== "All Semester" && (
                            <td>
                              <select
                                value={module.examType || ""}
                                onChange={(e) =>
                                  handleModuleChange(
                                    idx,
                                    "examType",
                                    e.target.value
                                  )
                                }
                              >
                                <option value="">Select Type</option>
                                <option value="physics">Physical</option>
                                <option value="computer base">
                                  Computer Base
                                </option>
                              </select>
                            </td>
                          )}
                          <td>
                            <button
                              onClick={() => removeModule(idx)}
                              className="remove-btn"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="add-module-form">
                    <h4>Add New Module</h4>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Module Name:</label>
                        <input
                          type="text"
                          value={newModule.moduleName}
                          onChange={(e) =>
                            setNewModule({
                              ...newModule,
                              moduleName: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="form-group">
                        <label>Module Code:</label>
                        <input
                          type="text"
                          value={newModule.moduleCode}
                          onChange={(e) =>
                            setNewModule({
                              ...newModule,
                              moduleCode: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="form-group">
                        <label>Instructor:</label>
                        <input
                          type="text"
                          value={newModule.instructor}
                          onChange={(e) =>
                            setNewModule({
                              ...newModule,
                              instructor: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="form-group">
                        <label>Venue:</label>
                        <input
                          type="text"
                          value={newModule.venue}
                          onChange={(e) =>
                            setNewModule({
                              ...newModule,
                              venue: e.target.value,
                            })
                          }
                        />
                      </div>
                      {timetable.timetableType !== "All Semester" && (
                        <div className="form-group">
                          <label>Exam Type:</label>
                          <select
                            value={newModule.examType}
                            onChange={(e) =>
                              setNewModule({
                                ...newModule,
                                examType: e.target.value,
                              })
                            }
                          >
                            <option value="">Select Type</option>
                            <option value="physics">Physical</option>
                            <option value="computer base">Computer Base</option>
                          </select>
                        </div>
                      )}
                      <div className="form-group">
                        <label>Day:</label>
                        <select
                          value={newModule.day}
                          onChange={(e) =>
                            setNewModule({ ...newModule, day: e.target.value })
                          }
                        >
                          {[
                            "Monday",
                            "Tuesday",
                            "Wednesday",
                            "Thursday",
                            "Friday",
                            "Saturday",
                            "Sunday",
                          ].map((day) => (
                            <option key={day} value={day}>
                              {day}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Start Time:</label>
                        <input
                          type="time"
                          value={newModule.startTime}
                          onChange={(e) =>
                            setNewModule({
                              ...newModule,
                              startTime: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="form-group">
                        <label>End Time:</label>
                        <input
                          type="time"
                          value={newModule.endTime}
                          onChange={(e) =>
                            setNewModule({
                              ...newModule,
                              endTime: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <button onClick={addNewModule} className="add-btn">
                      Add Module
                    </button>
                  </div>

                  <div className="edit-actions">
                    <button onClick={saveChanges} className="save-btn">
                      Save Changes
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="cancel-btn"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <table className="view-table">
                    <thead>
                      <tr>
                        <th>Day</th>
                        <th>Module Name</th>
                        <th>Module Code</th>
                        <th>Venue</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                        <th>Instructor</th>
                        {timetable.timetableType !== "All Semester" && (
                          <th>Exam Type</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {timetable.modules.map((module, idx) => (
                        <tr key={idx}>
                          <td>{module.day}</td>
                          <td>{module.moduleName}</td>
                          <td>{module.moduleCode}</td>
                          <td>{module.venue}</td>
                          <td>{module.startTime}</td>
                          <td>{module.endTime}</td>
                          <td>{module.instructor}</td>
                          {timetable.timetableType !== "All Semester" && (
                            <td>{module.examType || "N/A"}</td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="timetable-actions">
                    <button
                      onClick={() => generatePDF(timetable)}
                      className="pdf-btn"
                    >
                      Download PDF
                    </button>
                    <button
                      onClick={() => handleEdit(timetable)}
                      className="edit-btn"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(timetable._id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllTimetable;
