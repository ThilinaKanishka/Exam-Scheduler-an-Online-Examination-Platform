import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiCalendar,
  FiClock,
  FiBarChart2,
  FiLock,
  FiUser,
  FiBook,
  FiAward,
  FiChevronRight,
} from "react-icons/fi";
import { FaGraduationCap, FaChalkboardTeacher } from "react-icons/fa";
import ClientFooter from "./ClientFooter";
import ClientHeader from "./ClientHeader";

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
  // Hero images array
  const heroImages = [
    "https://images.unsplash.com/photo-1588072432836-e10032774350?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto-rotate images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  const features = [
    {
      icon: <FiCalendar className="w-12 h-12" />,
      title: "Smart Scheduling",
      description:
        "Automatically schedule exams without conflicts based on your availability",
      image:
        "https://images.unsplash.com/photo-1571260898930-8a4264a9a8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    },
    {
      icon: <FiClock className="w-12 h-12" />,
      title: "Time Management",
      description:
        "Track your exam duration and get reminders for upcoming tests",
      image:
        "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    },
    {
      icon: <FiBarChart2 className="w-12 h-12" />,
      title: "Performance Analytics",
      description: "Get detailed reports on your exam performance and progress",
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    },
    {
      icon: <FiLock className="w-12 h-12" />,
      title: "Secure Platform",
      description: "Bank-level security to ensure your exams are protected",
      image:
        "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    },
  ];

  const steps = [
    {
      icon: <FiUser className="w-6 h-6" />,
      title: "Create Your Account",
      description: "Sign up in seconds and set up your profile",
      image:
        "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    },
    {
      icon: <FiBook className="w-6 h-6" />,
      title: "Schedule Your Exams",
      description: "Add your exam details and preferred schedule",
      image:
        "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    },
    {
      icon: <FaGraduationCap className="w-6 h-6" />,
      title: "Take Exams & Get Results",
      description: "Complete your exams and view detailed analytics",
      image:
        "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "University Student",
      quote:
        "ExamSync saved me hours of scheduling headaches. The automatic conflict detection is a lifesaver!",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "Michael Chen",
      role: "High School Teacher",
      quote:
        "My students love the reminder system and performance analytics. It's transformed how we prepare for exams.",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      name: "Dr. Emily Wilson",
      role: "College Professor",
      quote:
        "The secure platform gives me peace of mind when administering important exams to my large classes.",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    },
  ];

  return (
    <>
      <ClientHeader />
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
              The intelligent platform for seamless exam scheduling and
              management
            </motion.p>

            <motion.div
              variants={item}
              className="flex justify-center space-x-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition-all duration-300 flex items-center"
              >
                Get Started <FiChevronRight className="ml-1" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white hover:bg-gray-100 text-indigo-600 font-semibold py-3 px-8 rounded-full shadow-lg transition-all duration-300 flex items-center"
              >
                Learn More <FiChevronRight className="ml-1" />
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
              <div className="relative bg-white rounded-xl shadow-2xl overflow-hidden w-full h-96">
                <motion.img
                  key={currentImageIndex}
                  src={heroImages[currentImageIndex]}
                  alt="Dashboard preview"
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                />
              </div>
              {/* Image indicators */}
              <div className="flex justify-center mt-4 space-x-2">
                {heroImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentImageIndex
                        ? "bg-indigo-600"
                        : "bg-gray-300"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
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
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden"
                >
                  <div className="h-48 overflow-hidden">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-6">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="text-indigo-600 mb-4 w-12 h-12 mx-auto group-hover:text-indigo-700 transition-colors duration-300"
                    >
                      {feature.icon}
                    </motion.div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-center">
                      {feature.description}
                    </p>
                  </div>
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
                <motion.div
                  key={index}
                  variants={item}
                  className="flex-1 w-full group"
                  whileHover={{ y: -5 }}
                >
                  <div className="relative overflow-hidden rounded-xl h-64 mb-6">
                    <img
                      src={step.image}
                      alt={step.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                      <div className="flex items-center">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 font-bold text-xl mr-4"
                        >
                          {step.icon}
                        </motion.div>
                        <h3 className="text-xl font-semibold text-white">
                          {step.title}
                        </h3>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 px-2">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Testimonials Section */}
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
              What Our Users Say
            </motion.h2>
            <motion.p
              variants={item}
              className="text-xl text-gray-600 text-center max-w-3xl mx-auto mb-16"
            >
              Trusted by students and educators worldwide
            </motion.p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  variants={item}
                  whileHover={{ y: -5 }}
                  className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center mb-6">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {testimonial.name}
                      </h4>
                      <p className="text-indigo-600 text-sm">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-600 italic">"{testimonial.quote}"</p>
                  <div className="flex mt-4 text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-5 h-5 fill-current"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Stats Section */}
        <section className="w-full py-20 px-4 sm:px-6 lg:px-8 mx-auto bg-indigo-600 rounded-3xl text-white">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={container}
            className="w-full"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <motion.div variants={item} className="p-4">
                <div className="text-4xl md:text-5xl font-bold mb-2">50K+</div>
                <div className="text-indigo-100">Active Users</div>
              </motion.div>
              <motion.div variants={item} className="p-4">
                <div className="text-4xl md:text-5xl font-bold mb-2">120K+</div>
                <div className="text-indigo-100">Exams Scheduled</div>
              </motion.div>
              <motion.div variants={item} className="p-4">
                <div className="text-4xl md:text-5xl font-bold mb-2">98%</div>
                <div className="text-indigo-100">Satisfaction Rate</div>
              </motion.div>
              <motion.div variants={item} className="p-4">
                <div className="text-4xl md:text-5xl font-bold mb-2">24/7</div>
                <div className="text-indigo-100">Support Available</div>
              </motion.div>
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
            className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-3xl p-12 shadow-xl w-full relative overflow-hidden"
          >
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
            </div>
            <div className="relative z-10">
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
                className="bg-white hover:bg-gray-100 text-indigo-600 font-bold py-4 px-10 rounded-full shadow-lg transition-all duration-300 flex items-center mx-auto"
              >
                Start Free Trial <FiChevronRight className="ml-1" />
              </motion.button>
            </div>
          </motion.div>
        </section>
        <ClientFooter />
      </div>
    </>
  );
}

export default Home;
