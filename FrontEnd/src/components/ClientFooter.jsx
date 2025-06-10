import React from "react";
import {
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
  FaYoutube,
  FaRegClock,
  FaHeadset,
  FaShieldAlt,
  FaMobileAlt,
} from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import { BsCalendarCheck } from "react-icons/bs";
import { motion } from "framer-motion";

function ClientFooter() {
  const socialLinks = [
    { icon: <FaFacebook className="text-xl" />, url: "#" },
    { icon: <FaTwitter className="text-xl" />, url: "#" },
    { icon: <FaLinkedin className="text-xl" />, url: "#" },
    { icon: <FaInstagram className="text-xl" />, url: "#" },
    { icon: <FaYoutube className="text-xl" />, url: "#" },
  ];

  const features = [
    {
      icon: <FaRegClock className="text-2xl" />,
      title: "Flexible Scheduling",
      desc: "Schedule exams at your convenience",
    },
    {
      icon: <BsCalendarCheck className="text-2xl" />,
      title: "Real-time Tracking",
      desc: "Monitor exam progress live",
    },
    {
      icon: <FaShieldAlt className="text-2xl" />,
      title: "Secure Platform",
      desc: "Bank-level security for all exams",
    },
    {
      icon: <FaMobileAlt className="text-2xl" />,
      title: "Mobile Friendly",
      desc: "Access exams from any device",
    },
  ];

  return (
    <footer className="w-full bg-gradient-to-r from-blue-900 to-indigo-900 text-white pt-16 pb-8">
      {/* Features Section */}
      <div className="max-w-screen-2xl mx-auto px-4 mb-12 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-indigo-600 rounded-full">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-blue-100">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-screen-2xl mx-auto px-4 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* About Section */}
          <div>
            <h3 className="text-2xl font-bold mb-6 flex items-center">
              <span className="bg-blue-600 p-2 rounded mr-2">
                <BsCalendarCheck />
              </span>
              ExamScheduler
            </h3>
            <p className="text-blue-100 mb-4">
              The leading online examination platform trusted by educators and
              institutions worldwide.
            </p>
            <div className="flex space-x-4 mt-6">
              {socialLinks.map((link, index) => (
                <motion.a
                  key={index}
                  href={link.url}
                  whileHover={{ scale: 1.1 }}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition-all duration-300"
                >
                  {link.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-6 border-b border-blue-700 pb-2">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {["Home", "Features", "Pricing", "About Us", "Contact"].map(
                (item, index) => (
                  <motion.li
                    key={index}
                    whileHover={{ x: 5 }}
                    className="transition-all duration-200"
                  >
                    <a
                      href="#"
                      className="text-blue-100 hover:text-white flex items-center"
                    >
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      {item}
                    </a>
                  </motion.li>
                )
              )}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-xl font-semibold mb-6 border-b border-blue-700 pb-2">
              Resources
            </h3>
            <ul className="space-y-3">
              {["Blog", "Documentation", "Help Center", "Webinars", "API"].map(
                (item, index) => (
                  <motion.li
                    key={index}
                    whileHover={{ x: 5 }}
                    className="transition-all duration-200"
                  >
                    <a
                      href="#"
                      className="text-blue-100 hover:text-white flex items-center"
                    >
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      {item}
                    </a>
                  </motion.li>
                )
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-semibold mb-6 border-b border-blue-700 pb-2">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <HiOutlineMail className="text-xl mr-3 mt-1 text-blue-300" />
                <div>
                  <p className="text-blue-100">Email</p>
                  <a
                    href="mailto:support@examscheduler.com"
                    className="hover:text-white"
                  >
                    support@examscheduler.com
                  </a>
                </div>
              </li>
              <li className="flex items-start">
                <FaHeadset className="text-xl mr-3 mt-1 text-blue-300" />
                <div>
                  <p className="text-blue-100">Support</p>
                  <a href="tel:+18005551234" className="hover:text-white">
                    +1 (800) 555-1234
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="bg-white bg-opacity-10 rounded-xl p-8 mb-12 backdrop-filter backdrop-blur-lg">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4">
              Subscribe to Our Newsletter
            </h3>
            <p className="text-blue-100 mb-6">
              Get the latest updates, exam tips, and special offers directly to
              your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-grow px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300"
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-blue-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-blue-200 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} ExamScheduler. All rights
            reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-blue-200 hover:text-white">
              Privacy Policy
            </a>
            <a href="#" className="text-blue-200 hover:text-white">
              Terms of Service
            </a>
            <a href="#" className="text-blue-200 hover:text-white">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default ClientFooter;
