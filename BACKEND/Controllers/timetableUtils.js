// timetableUtils.js

// Generate consistent time slots for both WD and WE
const generateTimeSlots = () => {
  // Define fixed time slots for consistency
  const timeSlots = [
    { startTime: "08:00", endTime: "10:00" },
    { startTime: "10:00", endTime: "12:00" },
    { startTime: "13:00", endTime: "15:00" },
    { startTime: "15:00", endTime: "17:00" },
    { startTime: "17:00", endTime: "19:00" },
  ];

  // Return a random time slot from the predefined slots
  return timeSlots[Math.floor(Math.random() * timeSlots.length)];
};

// Get random days (1-2 days for WD timetable)
const getRandomDays = (days, min, max) => {
  const count = Math.floor(Math.random() * (max - min + 1)) + min;
  const shuffled = [...days].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

module.exports = {
  generateTimeSlots,
  getRandomDays,
};
