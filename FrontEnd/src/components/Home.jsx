import React from "react";
import { motion } from "framer-motion";
import {
  FiCalendar,
  FiClock,
  FiBarChart2,
  FiLock,
  FiUser,
  FiBook,
  FiAward,
} from "react-icons/fi";
import { FaGraduationCap } from "react-icons/fa";

// Animation variants
const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const item = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.8 },
  },
};

function Home() {
  const features = [
    {
      icon: <FiCalendar className="w-12 h-12" />,
      title: "Smart Scheduling",
      description:
        "Automatically schedule exams without conflicts based on your availability",
    },
    {
      icon: <FiClock className="w-12 h-12" />,
      title: "Time Management",
      description:
        "Track your exam duration and get reminders for upcoming tests",
    },
    {
      icon: <FiBarChart2 className="w-12 h-12" />,
      title: "Performance Analytics",
      description: "Get detailed reports on your exam performance and progress",
    },
    {
      icon: <FiLock className="w-12 h-12" />,
      title: "Secure Platform",
      description: "Bank-level security to ensure your exams are protected",
    },
  ];

  const steps = [
    {
      icon: <FiUser className="w-6 h-6" />,
      title: "Create Your Account",
      description: "Sign up in seconds and set up your profile",
    },
    {
      icon: <FiBook className="w-6 h-6" />,
      title: "Schedule Your Exams",
      description: "Add your exam details and preferred schedule",
    },
    {
      icon: <FaGraduationCap className="w-6 h-6" />,
      title: "Take Exams & Get Results",
      description: "Complete your exams and view detailed analytics",
    },
  ];

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="w-full py-20 px-4 sm:px-6 lg:px-8 mx-auto">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={container}
          className="text-center w-full"
        >
          <motion.h1
            variants={item}
            className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              ExamSync
            </span>
          </motion.h1>

          <motion.p
            variants={item}
            className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-10"
          >
            The intelligent platform for seamless exam scheduling and management
          </motion.p>

          <motion.div variants={item} className="flex justify-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition-all duration-300"
            >
              Get Started
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white hover:bg-gray-100 text-indigo-600 font-semibold py-3 px-8 rounded-full shadow-lg transition-all duration-300"
            >
              Learn More
            </motion.button>
          </motion.div>

          <motion.div
            variants={item}
            className="mt-16 relative w-full max-w-6xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.5 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="absolute -inset-4 bg-indigo-100 rounded-2xl blur-lg"
            />
            <div className="relative bg-white rounded-xl shadow-2xl overflow-hidden w-full">
              <img
                src="https://images.unsplash.com/photo-1588072432836-e10032774350?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                alt="Dashboard preview"
                className="w-full h-auto"
              />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="w-full py-20 px-4 sm:px-6 lg:px-8 mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={container}
          className="w-full"
        >
          <motion.h2
            variants={item}
            className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4"
          >
            Powerful Features
          </motion.h2>
          <motion.p
            variants={item}
            className="text-xl text-gray-600 text-center max-w-3xl mx-auto mb-16"
          >
            Everything you need to manage your exams efficiently
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={item}
                whileHover={{ y: -10 }}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="text-indigo-600 mb-6 w-12 h-12 mx-auto group-hover:text-indigo-700 transition-colors duration-300"
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-center">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section className="w-full py-20 px-4 sm:px-6 lg:px-8 mx-auto bg-white rounded-3xl shadow-sm mb-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={container}
          className="w-full"
        >
          <motion.h2
            variants={item}
            className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4"
          >
            How It Works
          </motion.h2>
          <motion.p
            variants={item}
            className="text-xl text-gray-600 text-center max-w-3xl mx-auto mb-16"
          >
            Get started in just a few simple steps
          </motion.p>

          <div className="flex flex-col space-y-12 md:space-y-0 md:flex-row md:space-x-12 w-full">
            {steps.map((step, index) => (
              <motion.div key={index} variants={item} className="flex-1 w-full">
                <div className="flex items-center mb-6">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 font-bold text-xl mr-4"
                  >
                    {step.icon}
                  </motion.div>
                  {index < steps.length - 1 && (
                    <div className="hidden md:block h-1 w-16 bg-indigo-100"></div>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-20 px-4 sm:px-6 lg:px-8 mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-3xl p-12 shadow-xl w-full"
        >
          <motion.h2
            whileInView={{ scale: [1, 1.02, 1] }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-white mb-6"
          >
            Ready to Transform Your Exam Experience?
          </motion.h2>
          <motion.p
            whileInView={{ opacity: [0.8, 1] }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xl text-indigo-100 mb-8 max-w-3xl mx-auto"
          >
            Join thousands of students and educators who trust ExamSync for
            their exam scheduling needs.
          </motion.p>
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0 10px 25px -5px rgba(255,255,255,0.1)",
            }}
            whileTap={{ scale: 0.95 }}
            className="bg-white hover:bg-gray-100 text-indigo-600 font-bold py-4 px-10 rounded-full shadow-lg transition-all duration-300"
          >
            Start Free Trial
          </motion.button>
        </motion.div>
      </section>
    </div>
  );
}

export default Home;
