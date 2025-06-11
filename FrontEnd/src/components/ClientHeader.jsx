import React, { useState } from "react";
import {
  Bell,
  Home,
  BookOpen,
  ClipboardList,
  Settings,
  LogOut,
  ChevronDown,
  User,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function ClientHeader() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("Home");

  const navItems = [
    { name: "Home", icon: Home },
    { name: "Course", icon: BookOpen },
    { name: "Exam", icon: ClipboardList },
    { name: "Settings", icon: Settings },
  ];

  const dropdownItems = [
    { name: "Profile", icon: User },
    { name: "Settings", icon: Settings },
    { name: "Notifications", icon: Bell },
  ];

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo with unicorn animation */}
        <motion.div
          className="flex items-center"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="mr-2"
          >
            🦄
          </motion.div>
          <motion.span
            className="text-2xl font-bold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-pink-400"
            whileHover={{ scale: 1.05 }}
          >
            ExamSync
          </motion.span>
        </motion.div>

        {/* Navigation Links with icons */}
        <nav className="hidden md:flex space-x-6 text-base font-medium">
          {navItems.map((item) => (
            <motion.a
              key={item.name}
              href="#"
              className={`flex items-center hover:text-blue-200 transition ${
                activeNav === item.name ? "text-yellow-300" : ""
              }`}
              onClick={() => setActiveNav(item.name)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <item.icon className="w-5 h-5 mr-2" />
              {item.name}
            </motion.a>
          ))}
        </nav>

        {/* Right Icons & User Dropdown */}
        <div className="flex items-center space-x-4">
          {/* Notification Icon with badge */}
          <motion.button
            className="hover:text-blue-200 relative"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Bell className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              3
            </span>
          </motion.button>

          {/* User Dropdown */}
          <div className="relative">
            <motion.button
              className="flex items-center space-x-1 hover:text-blue-200"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </motion.button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
                >
                  {dropdownItems.map((item) => (
                    <a
                      key={item.name}
                      href="#"
                      className="flex items-center px-4 py-2 text-gray-800 hover:bg-blue-50 transition"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <item.icon className="w-4 h-4 mr-2 text-blue-500" />
                      {item.name}
                    </a>
                  ))}
                  <div className="border-t border-gray-200 my-1"></div>
                  <a
                    href="#"
                    className="flex items-center px-4 py-2 text-red-500 hover:bg-red-50 transition"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Log Out
                  </a>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Mobile menu button (hidden on desktop) */}
      <div className="md:hidden flex justify-center py-2">
        <div className="flex space-x-6">
          {navItems.map((item) => (
            <motion.a
              key={item.name}
              href="#"
              className={`flex flex-col items-center text-xs ${
                activeNav === item.name ? "text-yellow-300" : ""
              }`}
              onClick={() => setActiveNav(item.name)}
              whileTap={{ scale: 0.9 }}
            >
              <item.icon className="w-5 h-5 mb-1" />
              {item.name}
            </motion.a>
          ))}
        </div>
      </div>
    </header>
  );
}

export default ClientHeader;
