import { type WeightLossInputType } from "./FittnessSchema";

export function calculateWeightLossTime(input: WeightLossInputType): number {
  let dailyDeficit = input.dailyDeficit;

  // Ensure the calorie deficit is within the safe range
  if (dailyDeficit < 500) dailyDeficit = 500;
  if (dailyDeficit > 1000) dailyDeficit = 1000;

  // Calculate the total weight loss needed (in kilograms)
  const totalWeightLoss = (input.currentWeight - input.targetWeight) * 7700;

  // Calculate the time needed to reach the target weight (in days)
  const timeInDays = totalWeightLoss / dailyDeficit;

  return timeInDays;
}
