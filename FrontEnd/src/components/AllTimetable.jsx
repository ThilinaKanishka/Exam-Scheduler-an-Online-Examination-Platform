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
      setError("Please fill all module fields");
      return;
    }

    setEditedTimetable({
      ...editedTimetable,
      modules: [...editedTimetable.modules, { ...newModule }],
    });
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

  const removeModule = (index) => {
    const updatedModules = editedTimetable.modules.filter(
      (_, i) => i !== index
    );
    setEditedTimetable({ ...editedTimetable, modules: updatedModules });
  };

  const saveChanges = async () => {
    try {
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
      setError(err.response?.data?.error || "Failed to update timetable");
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
      const doc = new jsPDF({ orientation: "landscape" });

      doc.text(
        `${timetable.timetableType} Timetable - ${timetable.faculty}` +
          `${timetable.semester ? ` - ${timetable.semester}` : ""}` +
          `${timetable.weekType ? ` - ${timetable.weekType}` : ""}`,
        14,
        20
      );

      const tableData = timetable.modules.map((module) => [
        module.day,
        module.moduleName,
        module.moduleCode,
        module.venue,
        module.startTime,
        module.endTime,
        module.instructor,
      ]);

      autoTable(doc, {
        head: [
          [
            "Day",
            "Module Name",
            "Module Code",
            "Venue",
            "Start Time",
            "End Time",
            "Instructor",
          ],
        ],
        body: tableData,
        startY: 30,
      });

      doc.save(`${timetable.timetableType}_${timetable.faculty}_timetable.pdf`);
    } catch (err) {
      setError("Failed to generate PDF: " + err.message);
      setTimeout(() => setError(""), 3000);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>All Generated Timetables</h2>
      {success && <div className="success-message">{success}</div>}

      {timetables.length === 0 ? (
        <div>No timetables found</div>
      ) : (
        <div>
          {timetables.map((timetable) => (
            <div key={timetable._id} className="timetable-container">
              <h3>
                {timetable.timetableType} - {timetable.faculty}
                {timetable.semester && ` - ${timetable.semester}`}
                {timetable.weekType && ` - ${timetable.weekType}`}
              </h3>

              {editingId === timetable._id ? (
                <>
                  <table border="1" className="edit-table">
                    <thead>
                      <tr>
                        <th>Day</th>
                        <th>Module Name</th>
                        <th>Module Code</th>
                        <th>Venue</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                        <th>Instructor</th>
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
                          <td>
                            <button onClick={() => removeModule(idx)}>
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="add-module-form">
                    <h4>Add New Module</h4>
                    <div>
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
                      <button onClick={addNewModule}>Add Module</button>
                    </div>
                  </div>

                  <div className="edit-actions">
                    <button onClick={saveChanges}>Save Changes</button>
                    <button onClick={() => setEditingId(null)}>Cancel</button>
                  </div>
                </>
              ) : (
                <>
                  <table border="1" className="view-table">
                    <thead>
                      <tr>
                        <th>Day</th>
                        <th>Module Name</th>
                        <th>Module Code</th>
                        <th>Venue</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                        <th>Instructor</th>
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
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="timetable-actions">
                    <button onClick={() => generatePDF(timetable)}>
                      Download PDF
                    </button>
                    <button onClick={() => handleEdit(timetable)}>Edit</button>
                    <button onClick={() => handleDelete(timetable._id)}>
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
