import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import {
  FaUserGraduate,
  FaLock,
  FaUniversity,
  FaBookOpen,
} from "react-icons/fa";
import { motion } from "framer-motion";

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
    <div className="fixed inset-0 w-screen h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Floating book icons animation */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-indigo-200 text-2xl"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, Math.random() * 40 - 20, 0],
            rotate: [0, Math.random() * 360],
          }}
          transition={{
            duration: 15 + Math.random() * 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <FaBookOpen />
        </motion.div>
      ))}

      {/* Bubble animations */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-indigo-100 opacity-30"
          style={{
            width: `${50 + Math.random() * 100}px`,
            height: `${50 + Math.random() * 100}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            scale: [1, 1.2 + Math.random(), 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 8 + Math.random() * 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Login Form Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md mx-4"
      >
        <div className="bg-white bg-opacity-30 backdrop-blur-lg rounded-xl shadow-lg overflow-hidden border border-white border-opacity-40">
          {/* Campus Image Section */}
          <motion.div
            className="bg-indigo-600 p-6 text-center relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-30"></div>
            </div>
            <div className="flex items-center justify-center space-x-3 relative z-10">
              <FaUniversity className="text-white text-3xl" />
              <motion.h1
                className="text-2xl font-bold text-white"
                initial={{ x: -10 }}
                animate={{ x: 0 }}
                transition={{ delay: 0.3 }}
              >
                ExamSync
              </motion.h1>
            </div>
            <motion.p
              className="text-indigo-100 mt-2"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Know the Campus
            </motion.p>
          </motion.div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="p-8">
            <motion.div
              className="mb-6"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <label
                className="block text-gray-700 text-sm font-medium mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUserGraduate className="text-gray-500" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-3 py-2 bg-white bg-opacity-70 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent placeholder-gray-400"
                />
              </div>
            </motion.div>

            <motion.div
              className="mb-6"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <label
                className="block text-gray-700 text-sm font-medium mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-500" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-3 py-2 bg-white bg-opacity-70 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent placeholder-gray-400"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <motion.button
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0px 5px 15px rgba(79, 70, 229, 0.3)",
                }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300 shadow-md"
              >
                Login
              </motion.button>
            </motion.div>

            <motion.div
              className="mt-4 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <p className="text-gray-600 text-sm">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200"
                >
                  Register here
                </Link>
              </p>
            </motion.div>
          </form>

          {/* Footer */}
          <motion.div
            className="bg-gray-50 bg-opacity-50 px-6 py-4 text-center border-t border-gray-100"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <p className="text-gray-600 text-xs">
              Copyright © Version - 24.03.01 All Rights Reserved.
              <br />
              Business Application Services Division - ExamSync.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default Logging;
