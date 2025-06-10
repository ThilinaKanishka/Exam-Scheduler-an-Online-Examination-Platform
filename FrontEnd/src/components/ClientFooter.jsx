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
import { BsCalendarCheck, BsArrowRight } from "react-icons/bs";
import { motion } from "framer-motion";

function ClientFooter() {
  const socialLinks = [
    { icon: <FaFacebook className="text-lg" />, url: "#" },
    { icon: <FaTwitter className="text-lg" />, url: "#" },
    { icon: <FaLinkedin className="text-lg" />, url: "#" },
    { icon: <FaInstagram className="text-lg" />, url: "#" },
    { icon: <FaYoutube className="text-lg" />, url: "#" },
  ];

  const features = [
    {
      icon: <FaRegClock className="text-xl" />,
      title: "Flexible Scheduling",
      desc: "Schedule exams at your convenience",
    },
    {
      icon: <BsCalendarCheck className="text-xl" />,
      title: "Real-time Tracking",
      desc: "Monitor exam progress live",
    },
    {
      icon: <FaShieldAlt className="text-xl" />,
      title: "Secure Platform",
      desc: "Bank-level security for all exams",
    },
    {
      icon: <FaMobileAlt className="text-xl" />,
      title: "Mobile Friendly",
      desc: "Access exams from any device",
    },
  ];

  return (
    <footer className="w-full bg-gray-900 text-white pt-16 pb-8 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-20 left-10 w-40 h-40 bg-purple-600 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-10 right-20 w-60 h-60 bg-blue-600 rounded-full filter blur-3xl"></div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 mb-16 w-full relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              className="bg-gray-800 rounded-lg p-6 text-center border border-gray-700 hover:border-blue-400 transition-all duration-300 group"
            >
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg group-hover:rotate-6 transition-transform duration-300">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 w-full relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* About Section */}
          <div>
            <h3 className="text-2xl font-bold mb-6 flex items-center">
              <span className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg mr-3">
                <BsCalendarCheck />
              </span>
              ExamScheduler
            </h3>
            <p className="text-gray-400 mb-4">
              The leading online examination platform trusted by educators and
              institutions worldwide.
            </p>
            <div className="flex space-x-3 mt-6">
              {socialLinks.map((link, index) => (
                <motion.a
                  key={index}
                  href={link.url}
                  whileHover={{ y: -3 }}
                  className="bg-gray-700 hover:bg-gray-600 rounded-lg p-3 transition-all duration-300"
                >
                  {link.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 pb-2 relative inline-block">
              Quick Links
              <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600"></span>
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
                      className="text-gray-400 hover:text-white flex items-center group"
                    >
                      <BsArrowRight className="mr-2 text-blue-400 opacity-0 group-hover:opacity-100 transition-all duration-200" />
                      <span>{item}</span>
                    </a>
                  </motion.li>
                )
              )}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-6 pb-2 relative inline-block">
              Resources
              <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600"></span>
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
                      className="text-gray-400 hover:text-white flex items-center group"
                    >
                      <BsArrowRight className="mr-2 text-blue-400 opacity-0 group-hover:opacity-100 transition-all duration-200" />
                      <span>{item}</span>
                    </a>
                  </motion.li>
                )
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-6 pb-2 relative inline-block">
              Contact Us
              <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600"></span>
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="bg-gray-800 p-2 rounded-lg mr-3">
                  <HiOutlineMail className="text-lg text-blue-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Email</p>
                  <a
                    href="mailto:support@examscheduler.com"
                    className="hover:text-white text-sm"
                  >
                    support@examscheduler.com
                  </a>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-gray-800 p-2 rounded-lg mr-3">
                  <FaHeadset className="text-lg text-blue-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Support</p>
                  <a
                    href="tel:+18005551234"
                    className="hover:text-white text-sm"
                  >
                    +1 (800) 555-1234
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-8 mb-12 border border-gray-700 relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-blue-600 rounded-full filter blur-3xl opacity-20"></div>
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <h3 className="text-2xl font-bold mb-3">
              Stay Updated with ExamScheduler
            </h3>
            <p className="text-gray-400 mb-6">
              Get the latest updates, exam tips, and special offers directly to
              your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-grow px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-gray-100"
              />
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg"
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 mb-4 md:mb-0 text-sm">
            &copy; {new Date().getFullYear()} ExamScheduler. All rights
            reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            <a href="#" className="text-gray-400 hover:text-white text-sm">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-sm">
              Terms of Service
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-sm">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default ClientFooter;
