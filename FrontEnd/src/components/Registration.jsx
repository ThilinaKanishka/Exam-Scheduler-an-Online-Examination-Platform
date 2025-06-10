import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // ✅ import useNavigate

function Registration() {
  const [form, setForm] = useState({
    email: "",
    registrationNumber: "",
    phoneNumber: "",
    gender: "",
    password: "",
  });

  const navigate = useNavigate(); // ✅ hook for redirection

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/register", form);
      alert("Registered Successfully");
      navigate("/"); // ✅ redirect to login page
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
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
        name="registrationNumber"
        placeholder="Registration Number"
        onChange={handleChange}
        required
      />
      <input
        name="phoneNumber"
        placeholder="Phone Number"
        onChange={handleChange}
        required
      />
      <input
        name="gender"
        placeholder="Gender"
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
      <button type="submit">Register</button>
    </form>
  );
}

export default Registration;
