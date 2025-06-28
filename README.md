
📚 ExamSync - Exam Scheduler Online Exam Platform

ExamSync is an advanced online exam and timetable management platform developed with the MERN stack, Tailwind CSS, and Material UI. It enables campus students and LIC admins to seamlessly manage exam schedules, attend online exams, and generate automated timetables with robust CRUD functionality.

🚀 Technologies Used
MERN Stack

MongoDB (Database)

Express.js (Backend API)

React.js (Frontend)

Node.js (Server)

Tailwind CSS (Utility-first CSS framework)

Material UI (React component library)

Axios (API connection between frontend & backend)

✨ Features
✅ Authentication & Authorization
Unique student & LIC registration

Registration number & campus email (e.g., IT22123456@sliit.lk, LIC22123456@sliit.lk).

Secure login for both student & LIC.

Students can only access the client-side.

LIC Admins can access the admin-side.

✅ Exam Scheduling (Admin / LIC Side)
LIC Admins can:

Create, update, delete (CRUD) MCQ / structured exam questions.

Set total question pool & limit the random questions shown to students (e.g., 50 total ➜ 20 random).

Define correct answers & mark allocations.

Assign exam password & time limit.

View students who attempted the exam.

Download student results as PDF.


✅ Online Exam (Student Side)
Students can:

Log in with valid credentials.

Enter name, IT number & exam password.

Answer scheduled questions with forward/backward navigation.

Auto-submit when time limit ends.

View their marks after submission.

✅ Timetable Generator (Admin Side)
Academic staff can:

Auto-generate timetables for:

All Semester (WD/WE) by faculty (Computing, Engineering, Business, Nursing).

MID Exam, Final Exam, Repeat Exams.

Smart conflict-free allocation (no overbooking lecturers/rooms).

Auto-random day & time generation within campus working hours (8AM - 8PM, 7 days/week).

Insert, update, delete modules/rows.

Download generated timetables as PDF.


✅ Timetable Access (Student Side)
Students can:

Log in and view available timetables.

Download any timetable as a PDF.

View by type: All Semester, MID Exam, Final Exam, Repeat-MID, Repeat-Final.


⚡️ How to Run
1.Clone the repository
2.Install dependencies
    *npm install
3.Start backend
    *node App.js
    *Runs on: http://localhost:5000
4.Start frontend (React Vite)
    *npm run dev

Feel free to fork this project, contribute, or customize it for your campus needs!

