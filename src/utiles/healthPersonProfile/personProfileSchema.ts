import { z } from "zod";
import { fitnessShape } from "../fitnessCalculators/FittnessSchema";
import { NutritionPreferenceShape } from "../nutritionPreference/NutritionPreferenceSchema";

// make a enum for bmiCategory
export const bmiCategories = [
    "No bmi category for ages below 18",
    "Underweight",
    "Normal weight",
    "Overweight",
    "Obese",
  ] as const;
  
"Underweight"

export const profileSchema = z.object({
    age: fitnessShape.age,
    gender: fitnessShape.gender,
    weight: fitnessShape.weight,
    height: fitnessShape.height,
    activityLevel: fitnessShape.activityLevel,
    dailyCalorieIntake: fitnessShape.dailyCaloriesIntake,
    dailyCalorieDifference: fitnessShape.daliyCalorieDifference.default(0),
    bmi: z.number(),
    bmiCategory: z.enum(bmiCategories),
    specificDiet: NutritionPreferenceShape.dietType.default(""),
    religiousDiet: NutritionPreferenceShape.religiousDiet.default(""),
    dislikes: NutritionPreferenceShape.dislikes.default([]),
    weightGoal: fitnessShape.personalGoal.default("maintainAndImproveWeight"),
    targetDate: fitnessShape.personalGoalDate.or(z.string()).default(""),
    daysToGoal: z.number().or(z.string()).default(""),
    tdee: fitnessShape.totalDailyEnergyExpenditure,
  }).required();

export type ProfileType = z.infer<typeof profileSchema>;
  
