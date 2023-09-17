import type { z } from "zod";
import type { WeightTargetSchema } from "./FittnessSchema";

export type WeightGoal = z.infer<typeof WeightTargetSchema>;

export default (weightData: Required<WeightGoal>) => {
  // https://www.omnicalculator.com/health/weight-gain
  // According to the web page context, there are a total of 7700 calories in 1 kilogram of fat. To burn 1 kilogram of fat, you will need to create a calorie deficit of 7700. If you plan on losing 1 kg per week, you will need to reduce your calorie intake by 1100 calories per day. On the other hand, if you want to gain weight, you need to eat at least 500 to 1000 calories more than you normally would eat in a day 1. At this rate, you would have gained 1 kg by the end of 1 or 2 weeks, depending on your intake 1.
  const { weight, personalGoalWeight, daliyCalorieDifference } = weightData;

  const caloriesPerKg = 7700;
  const weightDifference = Math.abs(weight - personalGoalWeight);
  const totalCaloriesToReachGoal = weightDifference * caloriesPerKg;

  const daysToReachGoal = Math.ceil(
    totalCaloriesToReachGoal / daliyCalorieDifference
  );
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + daysToReachGoal);

  const rtf = new Intl.RelativeTimeFormat("he-IL", { numeric: "auto" });
  const daysDifference = Math.floor(
    (targetDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24)
  ); // 1000ms * 3600s * 24h = 1 day
  return `תגיע למשקל היעד שלך בתאריך ${targetDate.toLocaleDateString(
    "he"
  )} (${rtf.format(daysDifference, "day")}).`;
};
