import { useState, useEffect } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const AllTimetable = () => {
  const [timetables, setTimetables] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedModules, setEditedModules] = useState([]);
  const [newModule, setNewModule] = useState({
    moduleName: "",
    moduleCode: "",
    instructor: "",
    venue: "",
    day: "Monday",
    startTime: "08:00",
    endTime: "09:00",
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

  // Edit functionality
  const handleEdit = (timetable) => {
    setEditingId(timetable._id);
    setEditedModules([...timetable.modules]);
  };

  // Update module fields
  const handleModuleChange = (index, field, value) => {
    const updatedModules = [...editedModules];
    updatedModules[index][field] = value;
    setEditedModules(updatedModules);
  };

  // Add new module to timetable
  const addNewModule = () => {
    if (
      !newModule.moduleName ||
      !newModule.moduleCode ||
      !newModule.instructor ||
      !newModule.venue
    ) {
      setError("Please fill all module fields");
      return;
    }

    setEditedModules([...editedModules, { ...newModule }]);
    setNewModule({
      moduleName: "",
      moduleCode: "",
      instructor: "",
      venue: "",
      day: "Monday",
      startTime: "08:00",
      endTime: "09:00",
    });
    setError("");
  };

  // Remove module from timetable
  const removeModule = (index) => {
    const updatedModules = [...editedModules];
    updatedModules.splice(index, 1);
    setEditedModules(updatedModules);
  };

  // Save changes to backend
  const saveChanges = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/timetables/${editingId}`,
        {
          modules: editedModules,
        }
      );

      setTimetables(
        timetables.map((t) =>
          t._id === editingId ? { ...t, modules: response.data.modules } : t
        )
      );

      setEditingId(null);
      setSuccess("Timetable updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update timetable");
    }
  };

  // Generate PDF for download
  const generatePDF = (timetable) => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(16);
    doc.text(
      `${timetable.timetableType} Timetable - ${timetable.faculty}` +
        `${timetable.semester ? ` - ${timetable.semester}` : ""}` +
        `${timetable.weekType ? ` - ${timetable.weekType}` : ""}`,
      14,
      20
    );

    // Table data
    const tableData = timetable.modules.map((module) => [
      module.moduleName,
      module.moduleCode,
      module.instructor,
      module.venue,
      module.day,
      module.startTime,
      module.endTime,
    ]);

    // Table headers
    const headers = [
      "Module Name",
      "Module Code",
      "Instructor",
      "Venue",
      "Day",
      "Start Time",
      "End Time",
    ];

    // Generate table
    doc.autoTable({
      head: [headers],
      body: tableData,
      startY: 30,
      styles: {
        fontSize: 10,
        cellPadding: 2,
        valign: "middle",
      },
      headStyles: {
        fillColor: [220, 220, 220],
        textColor: [0, 0, 0],
        fontStyle: "bold",
      },
    });

    // Save the PDF
    doc.save(`${timetable.timetableType}_${timetable.faculty}_timetable.pdf`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div>
      <h2>All Generated Timetables</h2>
      {success && (
        <div style={{ color: "green", marginBottom: "10px" }}>{success}</div>
      )}

      {timetables.length === 0 ? (
        <div>No timetables found</div>
      ) : (
        <div>
          {timetables.map((timetable) => (
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
              </h3>

              {editingId === timetable._id ? (
                <>
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
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {editedModules.map((module, idx) => (
                        <tr key={idx}>
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
                            <button onClick={() => removeModule(idx)}>
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div
                    style={{
                      margin: "10px 0",
                      padding: "10px",
                      border: "1px dashed #ccc",
                    }}
                  >
                    <h4>Add New Module</h4>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(4, 1fr)",
                        gap: "10px",
                      }}
                    >
                      <div>
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
                      <div>
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
                      <div>
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
                      <div>
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
                      <div>
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
                      <div>
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
                      <div>
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
                      <div>
                        <button onClick={addNewModule}>Add Module</button>
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: "10px" }}>
                    <button onClick={saveChanges}>Save Changes</button>
                    <button
                      onClick={() => setEditingId(null)}
                      style={{ marginLeft: "10px" }}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
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
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div style={{ marginTop: "10px" }}>
                    <button onClick={() => generatePDF(timetable)}>
                      Download PDF
                    </button>
                    <button
                      onClick={() => handleEdit(timetable)}
                      style={{ marginLeft: "10px" }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(timetable._id)}
                      style={{ marginLeft: "10px" }}
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
