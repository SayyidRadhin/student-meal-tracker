// utils/missedMeals.js
const mealTimes = {
  breakfast: "08:00",
  lunch: "12:00",
  dinner: "18:00",
};

const parseTime = (timeString: any) => {
  const [hours, minutes] = timeString.split(":").map(Number);
  return { hours, minutes };
};

const calculateMissedMeals = (departure: Date, arrival: Date) => {
  const missedMeals = [];
  console.log(departure, arrival);

  let currentDate = new Date(departure);
  currentDate.setHours(0, 0, 0, 0);
  const endDate = new Date(arrival);
  endDate.setHours(23, 59, 59, 999);

  while (currentDate <= endDate) {
    const dayMissedMeals = {
      date: currentDate.toDateString(),
      breakfast: 0,
      lunch: 0,
      dinner: 0,
    };

    if (currentDate.toDateString() === arrival.toDateString()) {
       console.log("iam here");
      
      const { hours: arrHours, minutes: arrMinutes } = parseTime(
        arrival.toTimeString().substr(0, 5)
      );
      const arrivalDate = new Date(arrival);
      arrivalDate.setHours(arrHours, arrMinutes, 0, 0);
      console.log("ARR" + arrHours);

      if (arrHours >= 8 && arrHours < 12) {
        dayMissedMeals.breakfast += 1;
        console.log("ARR" + arrHours);

      }
      if (arrHours >= 12 && arrHours < 18) {
        dayMissedMeals.breakfast += 1;
        dayMissedMeals.lunch += 1;
      }
      if (arrHours >= 18) {
        dayMissedMeals.breakfast += 1;
        dayMissedMeals.lunch += 1;
        dayMissedMeals.dinner += 1;
      }
    } else if (currentDate.toDateString() === departure.toDateString()) {
      const { hours: depHours, minutes: depMinutes } = parseTime(
        departure.toTimeString().substr(0, 5)
      );
      const departureDate = new Date(departure);
      departureDate.setHours(depHours, depMinutes, 0, 0);
      if (depHours < 9) dayMissedMeals.breakfast += 1;
      if (depHours < 13) dayMissedMeals.lunch += 1;
      dayMissedMeals.dinner += 1;
    } else {
      dayMissedMeals.breakfast += 1;
      dayMissedMeals.lunch += 1;
      dayMissedMeals.dinner += 1;
    }

    missedMeals.push(dayMissedMeals);

    // Move to the next day
    currentDate.setDate(currentDate.getDate() + 1);
    currentDate.setHours(0, 0, 0, 0); // Reset to the start of the day
  }

  return missedMeals;
};

export default calculateMissedMeals;
