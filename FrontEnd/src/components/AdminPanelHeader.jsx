import React, { useState } from "react";
import {
  FaBars,
  FaTimes,
  FaUserCog,
  FaBell,
  FaEnvelope,
  FaChartLine,
  FaCalendarAlt,
  FaGraduationCap,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

function AdminPanelHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const navLinks = [
    {
      name: "Dashboard",
      icon: <FaChartLine className="mr-2" />,
      path: "/dashboard",
    },
    { name: "Exams", icon: <FaCalendarAlt className="mr-2" />, path: "/exams" },
    {
      name: "Students",
      icon: <FaGraduationCap className="mr-2" />,
      path: "/students",
    },
    {
      name: "Reports",
      icon: <FaChartLine className="mr-2" />,
      path: "/reports",
    },
  ];

  const notifications = [
    { id: 1, text: "New exam scheduled for tomorrow", time: "10 min ago" },
    { id: 2, text: "3 new student registrations", time: "1 hour ago" },
    { id: 3, text: "System maintenance scheduled", time: "2 days ago" },
  ];

  return (
    <header className="w-full bg-gradient-to-r from-blue-800 to-indigo-900 text-white shadow-lg fixed top-0 left-0 right-0 z-40">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Header */}
        <div className="flex items-center justify-between h-16 w-full">
          {/* Logo and Mobile Menu Button */}
          <div className="flex items-center flex-shrink-0">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-white focus:outline-none mr-4"
            >
              {isMobileMenuOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>

            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="flex items-center"
            >
              <FaGraduationCap className="h-8 w-8 text-blue-300 mr-2" />
              <span className="text-xl font-bold whitespace-nowrap">
                ExamScheduler Pro
              </span>
            </motion.div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex flex-grow justify-center ml-10">
            <div className="flex space-x-2 lg:space-x-8">
              {navLinks.map((link, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to={link.path}
                    className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors duration-300 whitespace-nowrap"
                  >
                    {link.icon}
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>
          </nav>

          {/* Right Side Icons */}
          <div className="flex items-center justify-end space-x-4 ml-auto">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-full hover:bg-blue-700 transition-colors duration-300 relative"
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            >
              <FaBell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-full hover:bg-blue-700 transition-colors duration-300"
            >
              <FaEnvelope className="h-5 w-5" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-full hover:bg-blue-700 transition-colors duration-300 relative"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <FaUserCog className="h-5 w-5" />
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden w-full"
            >
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={index}
                    initial={{ x: -20 }}
                    animate={{ x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={link.path}
                      className="flex items-center px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700 transition-colors duration-300 w-full"
                    >
                      {link.icon}
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Notifications Dropdown */}
      <AnimatePresence>
        {isNotificationOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed right-4 mt-2 w-72 bg-white rounded-md shadow-lg z-50"
          >
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Notifications
              </h3>
            </div>
            <div className="divide-y divide-gray-100">
              {notifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  whileHover={{ backgroundColor: "#f5f5f5" }}
                  className="p-4 cursor-pointer"
                >
                  <p className="text-sm text-gray-800">{notification.text}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {notification.time}
                  </p>
                </motion.div>
              ))}
            </div>
            <div className="p-3 bg-gray-50 text-center">
              <button className="text-sm text-blue-600 hover:text-blue-800">
                View all notifications
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Dropdown */}
      <AnimatePresence>
        {isProfileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed right-4 mt-2 w-48 bg-white rounded-md shadow-lg z-50"
          >
            <div className="py-1">
              <Link
                to="/profile"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Your Profile
              </Link>
              <Link
                to="/settings"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Settings
              </Link>
              <div className="border-t border-gray-100"></div>
              <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Sign out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default AdminPanelHeader;
