import { z } from "zod";
import { DRIageRangeSchemaEnum } from "./DRISchema";

export const numberOrString = z.union([
  z.number(),
  z
    .string()
    .refine((s) => s !== "")
    .transform((value) => parseInt(value)),
]);
export const numberOrStringFloat = z.union([
  z.number(),
  z
    .string()
    .refine((s) => s !== "")
    .transform((value) => parseFloat(value)),
]);

export const genders = {
  english: ["male", "female"] as const,
  hebrew: ["גבר", "אישה"] as const,
};
export const enumGender = z.enum(genders.english);

export const listPhysicalActivityLevel = {
  numbers: ["1.2", "1.375", "1.55", "1.725", "1.9"] as const,
  hebrewText: [
    "לא פעיל (כמעט או בלי פעילות גופנית) - 1.2",
    "פעיל באופן קל (ספורט 1-3 ימים בשבוע) - 1.375",
    "פעילות באופן בינונית (ספורט 3-5 ימים בשבוע) - 1.55",
    "פעיל מאוד (כושר קשה או ספורט 6-7 ימים בשבוע) - 1.725",
    "פעיל מאוד (ספורט 6-7 ימים בשבוע) - 1.9",
  ] as const,
};
export const enumPhysicalActivityLevel = z.enum(
  listPhysicalActivityLevel.numbers
);

export const goals = {
  ids: ["loseWeight", "gainWeight", "maintainAndImproveWeight"] as const,
  english: ["Lose weight", "Gain weight", "Maintain Weight"] as const,
  hebrew: ["חיטוב הגוף", "העלת מסה", "לשמר הרכב ומשקל גוף"] as const,
  hwbrewSubText: [
    "אם המטרה שלך היא להפחית משקל, יהיה עליך ליצור גירעון בקלוריות. זה אומר לצרוך פחות קלוריות מה-TDEE שלך. יש לשים דגש שהירידה במשקל צריכה להיות מהשומן בשביל לעודד תהליך של שריפת שומן ליצרוך פחות קלוריות אבל לא פחות מידי. אנחנו מראש מגבילים אותך לעד 1000 קלוריות. ",
    "הוספת משקל: אם המטרה להוסיף משקל, צריך לצרוך יותר קלוריות מה-TDEE שלך. לשים דגש שאנו רוצים להעלות במסת השריר ובשביל כך מומלץ מאוד לבצע תרגילי התנגדות במקביל לתזונה והאכילה.",
    "אם המטרה שלך היא לשמור על משקלך, עליך למטר לצרוך מספר קלוריות ששווה ל-TDEE שלך בכל יום. כדי לשמור באופן איכותי כלומר לשמור על מסת השריר יש לבצע אימונים סדירים במהלך השבוע. ",
  ] as const,
};

const enumGoals = z.enum(goals.ids);

export const FittnessSchema = z.object({
  id: z.string(),
  menuId: z.string().optional(),
  updateAt: z.date().or(z.string()),
  createdAt: z.date().or(z.string()),
  userId: z.string(),
  gender: enumGender,
  weight: numberOrStringFloat,
  height: numberOrStringFloat,
  age: numberOrString,
  activityLevel: z.union([
    enumPhysicalActivityLevel,
    z
      .number()
      .transform((value) => enumPhysicalActivityLevel.parse(value.toString())),
  ]),
  waist: numberOrStringFloat,
  neck: numberOrStringFloat,
  hips: numberOrString.optional(),
  useCentimeters: z.boolean().optional().default(true),
  personalGoal: enumGoals.optional(),
  personalGoalDate: z.string().optional(),
  personalGoalWeight: numberOrStringFloat.optional(),
  name: z.string().default(Date().toLocaleString()),
  daliyCalorieDifference: numberOrStringFloat.optional(),
  dailyCaloriesIntake: numberOrStringFloat.optional(),
  selectedDriValue: DRIageRangeSchemaEnum.optional(),
  totalDailyEnergyExpenditure: z.string().or(z.number()).optional(),
});

export type FittnessType = z.infer<typeof FittnessSchema>;
export type KeyofFittnessType = keyof FittnessType;
export const MOST_HAVE_PARAMETERS = [
  "name",
  "gender",
  "age",
  "activityLevel",
  "height",
  "weight",
  "personalGoal",
  "personalGoalWeight",
  "totalDailyEnergyExpenditure",
  "totalDailyEnergyExpenditure",
  "daliyCalorieDifference",
] as KeyofFittnessType[];

export const checkGoal = FittnessSchema.pick({
  personalGoal: true,
  personalGoalWeight: true,
  weight: true,
})
  .required()
  .transform((value, ctx) => {
    if (
      value.personalGoal === "loseWeight" &&
      value.personalGoalWeight > value.weight
    ) {
      ctx.addIssue({
        code: "custom",
        message: "Goal weight must be less than current weight",
      });
    }
    if (
      value.personalGoal === "gainWeight" &&
      value.personalGoalWeight < value.weight
    ) {
      ctx.addIssue({
        code: "custom",
        message: "Goal weight must be greater than current weight",
      });
    }
    return value;
  });
// Do you have better names for this schemas? (PersonSchema, Person2Schema, MeasurementsSchema, WeightGoalSchema, GoalSchema)
// please give me just the names and I will change it
export const BasicInfoSchema = FittnessSchema.pick({
  gender: true,
  weight: true,
  height: true,
  age: true,
});

export const ActivityLevelSchema = FittnessSchema.pick({
  gender: true,
  weight: true,
  height: true,
  age: true,
  activityLevel: true,
});

export type TypeActivityLevelSchema = z.infer<typeof ActivityLevelSchema>;

export const BodyMeasurementsSchema = FittnessSchema.pick({
  gender: true,
  height: true,
  waist: true,
  neck: true,
  hips: true,
  useCentimeters: true,
});

export const WeightTargetSchema = FittnessSchema.pick({
  personalGoalWeight: true,
  weight: true,
  daliyCalorieDifference: true,
});

export const CalorieIntakeSchema = FittnessSchema.pick({
  dailyCaloriesIntake: true,
  selectedDriValue: true,
  id: true,
});

export type TypeUserFitness = z.infer<typeof FittnessSchema>;
export const PartialUserFitness = FittnessSchema.partial();
export type TypePartialUserFitness = z.infer<typeof PartialUserFitness>;
export const PartialUserFitnessUpdate = FittnessSchema.partial().required({
  id: true,
});
export type TypePartialUserFitnessUpdate = z.infer<
  typeof PartialUserFitnessUpdate
>;

export const WeightLossInput = z.object({
  currentWeight: z.number().min(1, "Current weight must be greater than 0"),
  targetWeight: z.number().min(1, "Target weight must be greater than 0"),
  rmr: z.number().min(1, "Resting metabolic rate must be greater than 0"),
  dailyDeficit: z
    .number()
    .min(500, "Daily calorie deficit must be greater than 0")
    .max(1000, "Daily calorie deficit must be less than 1000"),
});

export type WeightLossInputType = z.infer<typeof WeightLossInput>;

export const WEIGHT = "weight";
export const HEIGHT = "height";
export const GENDER = "gender";
export const ACTIVITY_LEVEL = "activityLevel";
export const AGE = "age";
export const PERSONAL_GOAL = "personalGoal";
export const PERSONAL_GOAL_WEIGHT = "personalGoalWeight";
export const DAILY_CALORIE_INTAKE = "dailyCaloriesIntake";
export const DAILY_CALORIE_DIFFERENCE = "daliyCalorieDifference";


export const fitnessShape = FittnessSchema.shape;
