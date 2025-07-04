import React from "react";
import {
  FaCalendarAlt,
  FaClock,
  FaGraduationCap,
  FaRegCopyright,
} from "react-icons/fa";
import { FiHeart } from "react-icons/fi";
import { HiOutlineLightningBolt } from "react-icons/hi";
import { RiTeamLine } from "react-icons/ri";

function AdminPanelFooter() {
  return (
    <footer className="w-screen bg-gradient-to-r from-indigo-600 to-purple-800 text-white pt-12 pb-6 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Platform Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <HiOutlineLightningBolt className="h-8 w-8 text-yellow-300 animate-pulse" />
              <span className="text-2xl font-bold">Exam Scheduler</span>
            </div>
            <p className="text-indigo-100">
              The ultimate online examination platform for educational
              institutions and corporate training.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-indigo-100 hover:text-white transition-colors duration-300"
              >
                <span className="sr-only">Facebook</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="#"
                className="text-indigo-100 hover:text-white transition-colors duration-300"
              >
                <span className="sr-only">Twitter</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a
                href="#"
                className="text-indigo-100 hover:text-white transition-colors duration-300"
              >
                <span className="sr-only">GitHub</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Features</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2 group">
                <FaCalendarAlt className="text-purple-300 group-hover:text-yellow-300 transition-colors duration-300 transform group-hover:scale-110" />
                <a
                  href="#"
                  className="text-indigo-100 hover:text-white transition-colors duration-300"
                >
                  Exam Scheduling
                </a>
              </li>
              <li className="flex items-center space-x-2 group">
                <FaClock className="text-purple-300 group-hover:text-yellow-300 transition-colors duration-300 transform group-hover:scale-110" />
                <a
                  href="#"
                  className="text-indigo-100 hover:text-white transition-colors duration-300"
                >
                  Time Management
                </a>
              </li>
              <li className="flex items-center space-x-2 group">
                <FaGraduationCap className="text-purple-300 group-hover:text-yellow-300 transition-colors duration-300 transform group-hover:scale-110" />
                <a
                  href="#"
                  className="text-indigo-100 hover:text-white transition-colors duration-300"
                >
                  Student Analytics
                </a>
              </li>
              <li className="flex items-center space-x-2 group">
                <RiTeamLine className="text-purple-300 group-hover:text-yellow-300 transition-colors duration-300 transform group-hover:scale-110" />
                <a
                  href="#"
                  className="text-indigo-100 hover:text-white transition-colors duration-300"
                >
                  Team Collaboration
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-indigo-100 hover:text-white transition-colors duration-300 hover:underline"
                >
                  Dashboard
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-indigo-100 hover:text-white transition-colors duration-300 hover:underline"
                >
                  Create Exam
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-indigo-100 hover:text-white transition-colors duration-300 hover:underline"
                >
                  Student Management
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-indigo-100 hover:text-white transition-colors duration-300 hover:underline"
                >
                  Reports
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-indigo-100 hover:text-white transition-colors duration-300 hover:underline"
                >
                  Settings
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <address className="not-italic text-indigo-100">
              <p>123 Education Street</p>
              <p>Tech City, TC 10001</p>
              <p className="mt-2">Email: support@examscheduler.com</p>
              <p>Phone: (123) 456-7890</p>
            </address>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-indigo-400 pt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-1 text-indigo-100 mb-4 md:mb-0">
            <FaRegCopyright className="h-4 w-4" />
            <span>
              {new Date().getFullYear()} Exam Scheduler. All rights reserved.
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-indigo-100">Made with</span>
            <FiHeart className="h-4 w-4 text-pink-400 animate-pulse" />
            <span className="text-indigo-100">by Thilina Hettiarachchi</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default AdminPanelFooter;
