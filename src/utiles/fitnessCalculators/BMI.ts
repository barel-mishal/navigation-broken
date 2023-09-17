import type { Person } from "./bmrEquations";

export default (person: Person) => {
  // person.weight is in kg, person.height is in cm
  // BMI = weight (kg) / height (m) ^ 2
  const height = person.height / 100; // convert cm to m
  return person.weight / (height * height);
};
export const getBMICategory = (bmi: number, age: number) => {
  if (age < 18) {
    return 'No bmi category for ages below 18'
  } else if (age >= 18 && age < 30) {
    if (bmi < 18.5) {
      return "Underweight";
    } else if (bmi >= 18.5 && bmi < 24) {
      return "Normal weight";
    } else if (bmi >= 24 && bmi < 30) {
      return "Overweight";
    } else {
      return "Obese";
    }
  } else if (age >= 30 && age < 60) {
    if (bmi < 18.5) {
      return "Underweight";
    } else if (bmi >= 18.5 && bmi < 25) {
      return "Normal weight";
    } else if (bmi >= 25 && bmi < 30) {
      return "Overweight";
    } else {
      return "Obese";
    }
  } else {
    if (bmi < 23) {
      return "Underweight";
    } else if (bmi >= 23 && bmi < 30) {
      return "Normal weight";
    } else {
      return "Overweight";
    }
  }
};