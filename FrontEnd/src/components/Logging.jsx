import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Logging() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/login", form);
      alert(res.data.message);

      // Check role returned from backend
      if (res.data.role === "admin") {
        navigate("/Adminpanel");
      } else if (res.data.role === "student") {
        navigate("/Home");
      } else {
        alert("Invalid role or user type.");
      }
    } catch (error) {
      alert(error.response?.data?.error || "Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="email"
        placeholder="Email"
        onChange={handleChange}
        required
      />
      <input
        name="password"
        placeholder="Password"
        type="password"
        onChange={handleChange}
        required
      />
      <button type="submit">Login</button>
    </form>
  );
}

export default Logging;
