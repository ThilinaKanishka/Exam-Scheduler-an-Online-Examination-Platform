import React from "react";
import {
  FaCalendarAlt,
  FaClock,
  FaGraduationCap,
  FaBook,
  FaChalkboardTeacher,
  FaUserShield,
  FaHeadset,
  FaTwitter,
  FaFacebook,
  FaLinkedin,
  FaInstagram,
} from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import { BsTelephone } from "react-icons/bs";
import { motion } from "framer-motion";

function AdminFooter() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Exam Scheduling",
      links: [
        { name: "Create Exam", icon: <FaCalendarAlt className="mr-2" /> },
        { name: "Time Slots", icon: <FaClock className="mr-2" /> },
        { name: "Exam Templates", icon: <FaBook className="mr-2" /> },
      ],
    },
    {
      title: "Management",
      links: [
        { name: "Student Portal", icon: <FaGraduationCap className="mr-2" /> },
        {
          name: "Instructor Access",
          icon: <FaChalkboardTeacher className="mr-2" />,
        },
        { name: "Admin Controls", icon: <FaUserShield className="mr-2" /> },
      ],
    },
    {
      title: "Support",
      links: [
        { name: "Help Center", icon: <FaHeadset className="mr-2" /> },
        { name: "Contact Us", icon: <HiOutlineMail className="mr-2" /> },
        { name: "System Status", icon: <BsTelephone className="mr-2" /> },
      ],
    },
  ];

  const socialLinks = [
    { icon: <FaTwitter />, name: "Twitter" },
    { icon: <FaFacebook />, name: "Facebook" },
    { icon: <FaLinkedin />, name: "LinkedIn" },
    { icon: <FaInstagram />, name: "Instagram" },
  ];

  return (
    <footer className="w-full bg-gradient-to-r from-blue-900 to-indigo-900 text-white pt-12 pb-6">
      <div className="w-full px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8 max-w-7xl mx-auto">
          {/* Platform Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="col-span-1"
          >
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <FaGraduationCap className="mr-2 text-blue-300" />
              Exam Scheduler Pro
            </h2>
            <p className="text-gray-300 mb-4">
              The ultimate online examination platform for educational
              institutions and certification providers.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href="#"
                  className="text-gray-300 hover:text-white text-xl transition-colors duration-300"
                  whileHover={{ y: -3, scale: 1.1 }}
                  aria-label={social.name}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Footer Links */}
          {footerLinks.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="col-span-1"
            >
              <h3 className="text-lg font-semibold mb-4 border-b border-blue-700 pb-2">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <motion.li
                    key={linkIndex}
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <a
                      href="#"
                      className="text-gray-300 hover:text-white flex items-center transition-colors duration-300"
                    >
                      {link.icon}
                      {link.name}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Newsletter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-blue-800 bg-opacity-30 rounded-lg p-6 mb-8 max-w-7xl mx-auto"
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-semibold mb-2">Stay Updated</h3>
              <p className="text-gray-300">
                Subscribe to our newsletter for the latest features and updates.
              </p>
            </div>
            <div className="flex w-full md:w-auto min-w-[300px]">
              <input
                type="email"
                placeholder="Your email address"
                className="px-4 py-2 rounded-l-lg focus:outline-none text-gray-800 w-full"
              />
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-r-lg transition-colors duration-300 font-medium">
                Subscribe
              </button>
            </div>
          </div>
        </motion.div>

        {/* Copyright */}
        <div className="border-t border-blue-800 pt-6 flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto">
          <p className="text-gray-400 mb-4 md:mb-0">
            &copy; {currentYear} Exam Scheduler Pro. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors duration-300"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors duration-300"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors duration-300"
            >
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default AdminFooter;
