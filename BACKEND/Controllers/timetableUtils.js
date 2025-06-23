// Generate random time between min and max (format: "HH:MM")
const generateRandomTime = (minTime, maxTime) => {
  const [minHour, minMinute] = minTime.split(":").map(Number);
  const [maxHour, maxMinute] = maxTime.split(":").map(Number);

  // Convert to total minutes but ensure we're working with whole hours
  const minTotal = minHour * 60 + (minMinute > 0 ? 60 - minMinute : 0);
  const maxTotal = maxHour * 60;

  // Generate random duration between 2-3 hours (in whole hours)
  const duration = Math.floor(Math.random() * 2 + 2) * 60; // 2 or 3 hours (120 or 180 minutes)

  // Calculate possible start hours
  const possibleStartHours = [];
  for (let hour = minHour; hour <= maxHour - duration / 60; hour++) {
    possibleStartHours.push(hour);
  }

  // If no valid start hours (edge case), use minimum possible
  const startHour =
    possibleStartHours.length > 0
      ? possibleStartHours[
          Math.floor(Math.random() * possibleStartHours.length)
        ]
      : minHour;

  const endHour = startHour + duration / 60;

  const format = (num) => num.toString().padStart(2, "0");

  return {
    startTime: `${format(startHour)}:00`,
    endTime: `${format(endHour)}:00`,
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
