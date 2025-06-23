// Generate random time between min and max (format: "HH:MM")
const generateRandomTime = (minTime, maxTime) => {
  const [minHour, minMinute] = minTime.split(":").map(Number);
  const [maxHour, maxMinute] = maxTime.split(":").map(Number);

  const minTotal = minHour * 60 + minMinute;
  const maxTotal = maxHour * 60 + maxMinute;

  // Generate random duration between 1-3 hours
  const duration = Math.floor(Math.random() * 120 + 60); // 60-180 minutes

  // Make sure the end time doesn't exceed maxTime
  const adjustedMax = Math.min(maxTotal, minTotal + 180);
  const startTotal = Math.floor(
    Math.random() * (adjustedMax - minTotal - duration) + minTotal
  );
  const endTotal = startTotal + duration;

  const startHour = Math.floor(startTotal / 60);
  const startMinute = startTotal % 60;
  const endHour = Math.floor(endTotal / 60);
  const endMinute = endTotal % 60;

  const format = (num) => num.toString().padStart(2, "0");

  return {
    startTime: `${format(startHour)}:${format(startMinute)}`,
    endTime: `${format(endHour)}:${format(endMinute)}`,
  };
};

// Get random days (1-2 days for WD timetable)
const getRandomDays = (days, min, max) => {
  const count = Math.floor(Math.random() * (max - min + 1)) + min;
  const shuffled = [...days].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

module.exports = {
  generateRandomTime,
  getRandomDays,
};
