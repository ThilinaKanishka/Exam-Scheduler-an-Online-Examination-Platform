import React, { useState, useEffect } from "react";
import {
  FiHome,
  FiCalendar,
  FiBook,
  FiAward,
  FiBell,
  FiUser,
  FiLogOut,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

function ClientHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasNewNotifications, setHasNewNotifications] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", icon: <FiHome className="mr-2" />, path: "/" },
    {
      name: "Schedule",
      icon: <FiCalendar className="mr-2" />,
      path: "/schedule",
    },
    { name: "Courses", icon: <FiBook className="mr-2" />, path: "/courses" },
    { name: "Results", icon: <FiAward className="mr-2" />, path: "/results" },
  ];

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white shadow-lg py-2"
          : "bg-gradient-to-r from-blue-600 to-indigo-700 py-4"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="flex items-center"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                  isScrolled ? "bg-indigo-600" : "bg-white"
                }`}
              >
                <FiBook
                  className={`text-xl ${
                    isScrolled ? "text-white" : "text-indigo-600"
                  }`}
                />
              </div>
              <h1
                className={`text-2xl font-bold ${
                  isScrolled ? "text-gray-800" : "text-white"
                }`}
              >
                Exam
                <span
                  className={isScrolled ? "text-indigo-600" : "text-yellow-300"}
                >
                  Scheduler
                </span>
              </h1>
            </motion.div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link, index) => (
              <motion.a
                key={index}
                href={link.path}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                  isScrolled
                    ? "text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
                    : "text-white hover:text-yellow-300"
                }`}
              >
                {link.icon}
                <span className="font-medium">{link.name}</span>
              </motion.a>
            ))}
          </nav>

          {/* User Controls */}
          <div className="hidden md:flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`relative p-2 rounded-full ${
                isScrolled
                  ? "text-gray-700 hover:bg-gray-100"
                  : "text-white hover:bg-white hover:bg-opacity-20"
              }`}
              onClick={() => setHasNewNotifications(false)}
            >
              <FiBell className="text-xl" />
              {hasNewNotifications && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"
                />
              )}
            </motion.button>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className={`flex items-center space-x-2 px-3 py-2 rounded-full cursor-pointer ${
                isScrolled
                  ? "bg-indigo-50 text-indigo-700"
                  : "bg-white bg-opacity-20 text-white"
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-indigo-600 font-bold">
                JD
              </div>
              <span className="font-medium">John Doe</span>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded-md ${
                isScrolled ? "text-gray-700" : "text-white"
              }`}
            >
              {isMobileMenuOpen ? (
                <FiX className="text-2xl" />
              ) : (
                <FiMenu className="text-2xl" />
              )}
            </button>
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
              className="md:hidden overflow-hidden"
            >
              <div
                className={`pt-4 pb-6 ${
                  isScrolled ? "bg-white" : "bg-indigo-800"
                }`}
              >
                {navLinks.map((link, index) => (
                  <motion.a
                    key={index}
                    href={link.path}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center px-4 py-3 ${
                      isScrolled
                        ? "text-gray-700 hover:bg-gray-100"
                        : "text-white hover:bg-indigo-700"
                    }`}
                  >
                    {link.icon}
                    <span className="font-medium">{link.name}</span>
                  </motion.a>
                ))}

                <div className="mt-4 pt-4 border-t border-opacity-20 border-white px-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-indigo-600 font-bold">
                        JD
                      </div>
                      <span
                        className={`font-medium ${
                          isScrolled ? "text-gray-700" : "text-white"
                        }`}
                      >
                        John Doe
                      </span>
                    </div>
                    <div className="flex space-x-4">
                      <button
                        className={`p-2 rounded-full ${
                          isScrolled
                            ? "text-gray-700 hover:bg-gray-100"
                            : "text-white hover:bg-indigo-700"
                        }`}
                        onClick={() => setHasNewNotifications(false)}
                      >
                        <FiBell className="text-xl" />
                        {hasNewNotifications && (
                          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
                        )}
                      </button>
                      <button
                        className={`p-2 rounded-full ${
                          isScrolled
                            ? "text-gray-700 hover:bg-gray-100"
                            : "text-white hover:bg-indigo-700"
                        }`}
                      >
                        <FiLogOut className="text-xl" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

export default ClientHeader;
