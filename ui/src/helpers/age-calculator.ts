function calculateAge(birthDate: Date) {
  const now = new Date();
  let age = now.getFullYear() - birthDate.getFullYear();
  let month = now.getMonth() - birthDate.getMonth();
  let day = now.getDay() - birthDate.getDay();

  if (month < 0) {
    age -= 1;
    month += 12;
  }

  if (day < 0) {
    month -= 1;
    day += 30;
  }

  return { age, month, day };
}

export default calculateAge;