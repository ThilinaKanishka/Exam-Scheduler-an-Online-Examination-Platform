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

  // Raindrop component
  const Raindrop = ({ index }) => {
    const left = `${Math.random() * 100}%`;
    const delay = Math.random() * 2;
    const duration = 0.5 + Math.random() * 0.5;
    const opacity = 0.2 + Math.random() * 0.5;

    return (
      <motion.div
        className="absolute bg-blue-400 rounded-full pointer-events-none"
        style={{
          left,
          top: "-10px",
          width: `${1 + Math.random() * 2}px`,
          height: `${10 + Math.random() * 20}px`,
          opacity,
          zIndex: 0,
        }}
        initial={{ y: -50 }}
        animate={{ y: "100vh" }}
        transition={{
          delay,
          duration,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    );
  };

  // Rain splashes (for when raindrops hit the "ground")
  const RainSplash = ({ index }) => {
    const left = `${Math.random() * 100}%`;
    const delay = 0.5 + Math.random() * 2;
    const duration = 0.2 + Math.random() * 0.3;

    return (
      <motion.div
        className="absolute bg-blue-400 rounded-full pointer-events-none"
        style={{
          left,
          bottom: "0",
          width: `${3 + Math.random() * 4}px`,
          height: `${1 + Math.random() * 2}px`,
          opacity: 0.6,
          zIndex: 0,
        }}
        initial={{ scale: 0 }}
        animate={{ scale: 1.5, opacity: 0 }}
        transition={{
          delay,
          duration,
          repeat: Infinity,
          ease: "easeOut",
        }}
      />
    );
  };

  return (
    <div className="fixed inset-0 w-screen h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-blue-900 relative overflow-hidden">
      {/* Rain animation */}
      {[...Array(100)].map((_, i) => (
        <Raindrop key={`raindrop-${i}`} index={i} />
      ))}

      {/* Rain splashes */}
      {[...Array(30)].map((_, i) => (
        <RainSplash key={`splash-${i}`} index={i} />
      ))}

      {/* Floating bubble background elements - More visible version */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={`bubble-${i}`}
          className="absolute rounded-full bg-white/10 backdrop-blur-sm"
          style={{
            width: `${20 + Math.random() * 80}px`,
            height: `${20 + Math.random() * 80}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            zIndex: 0,
          }}
          animate={{
            y: [0, -50 + Math.random() * 100],
            x: [0, -20 + Math.random() * 40],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 15 + Math.random() * 20,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Colored floating bubbles - More visible */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={`color-bubble-${i}`}
          className="absolute rounded-full bg-blue-400/20 backdrop-blur-sm"
          style={{
            width: `${40 + Math.random() * 120}px`,
            height: `${40 + Math.random() * 120}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            zIndex: 0,
          }}
          animate={{
            y: [0, -30 + Math.random() * 60],
            x: [0, -15 + Math.random() * 30],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 20 + Math.random() * 25,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Floating book icons animation */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`book-${i}`}
          className="absolute text-blue-400/30 text-2xl"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            zIndex: 0,
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

      {/* Login Form Container - Ensure it's above bubbles */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md mx-4 z-10" // Higher z-index than bubbles
      >
        {/* Rest of your login form code remains exactly the same */}
        <div className="bg-gray-800 bg-opacity-70 backdrop-blur-lg rounded-xl shadow-lg overflow-hidden border border-gray-700 border-opacity-50">
          {/* Campus Image Section */}
          <motion.div
            className="bg-blue-800 p-6 text-center relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-30"></div>
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
              className="text-blue-200 mt-2"
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
                className="block text-gray-300 text-sm font-medium mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUserGraduate className="text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-3 py-2 bg-gray-700 bg-opacity-70 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 text-white"
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
                className="block text-gray-300 text-sm font-medium mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-3 py-2 bg-gray-700 bg-opacity-70 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 text-white"
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
                  boxShadow: "0px 5px 15px rgba(59, 130, 246, 0.3)",
                }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300 shadow-md"
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
              <p className="text-gray-400 text-sm">
                Don't have an account?{" "}
                <Link
                  to="/Registration"
                  className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200"
                >
                  Register here
                </Link>
              </p>
            </motion.div>
          </form>

          {/* Footer */}
          <motion.div
            className="bg-gray-900 bg-opacity-50 px-6 py-4 text-center border-t border-gray-700"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <p className="text-gray-400 text-xs">
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
