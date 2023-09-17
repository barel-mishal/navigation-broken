import { z } from "zod";

const DRIUnits = [
  "mg/day",
  "g/day",
  "mcg (400 IU)/day",
  "mcg (600 IU)/day",
  "mcg (800 IU)/day",
  "mcg RAE/day",
  "mcg/day",
] as const;
const DRIComments = ["AI", "RDA"] as const;

export const DRIUnitsSchema = z.enum(DRIUnits);
export const DRICommentsSchema = z.enum(DRIComments);

export const nutrientDRISchema = z.object({
  value: z.string(),
  unit: DRIUnitsSchema,
  comment: DRICommentsSchema,
});

export const ageRangesList = [
  "Infants 0-6 months",
  "Infants 7-12 months",
  "Children 1-3 years",
  "Children 4-8 years",
  "Males 9-13 years",
  "Males 14-18 years",
  "Males 19-30 years",
  "Males 31-50 years",
  "Males 51-70 years",
  "Males >70 years",
  "Females 9-13 years",
  "Females 14-18 years",
  "Females 19-30 years",
  "Females 31-50 years",
  "Females 51-70 years",
  "Females >70 years",
  "Pregnancy <18 years",
  "Pregnancy 19-30 years",
  "Pregnancy 31-50 years",
  "Lactation <18 years",
  "Lactation 19-30 years",
  "Lactation 31-50 years",
] as const;
export const ageRangesListHebrew = [
  "תינוקות 0-6 חודשים",
  "תינוקות 7-12 חודשים",
  "ילדים 1-3 שנים",
  "ילדים 4-8 שנים",
  "גברים 9-13 שנים",
  "גברים 14-18 שנים",
  "גברים 19-30 שנה",
  "גברים 31-50 שנה",
  "גברים 51-70 שנים",
  "גברים >70 שנה",
  "נשים  9-13 שנים",
  "נשים  14-18 שנים",
  "נשים  19-30 שנה",
  "נשים  31-50 שנה",
  "נשים  51-70 שנים",
  "נשים  >70 שנה",
  "הריון <18 שנה",
  "הריון 19-30 שנה",
  "הריון 31-50 שנה",
  "הנקה <18 שנה",
  "הנקה 19-30 שנה",
  "הנקה 31-50 שנה",
] as const;

export const DRIageRangeSchemaEnum = z.enum(ageRangesList);

export const DRISchema = z.record(DRIageRangeSchemaEnum, z.object({
  calcium: nutrientDRISchema,
  vitaminD: nutrientDRISchema,
  iron: nutrientDRISchema,
  vitaminA: nutrientDRISchema,
  magnesium: nutrientDRISchema,
  sodium: nutrientDRISchema,
  iodine: nutrientDRISchema,
}));

export type DRISchemaType = z.infer<typeof DRISchema>;


export const nutrientsEnglishNames = [
  "calcium",
  "vitaminD",
  "iron",
  "vitaminA",
  "magnesium",
  "sodium",
  "iodine",
] as const;

export const hebrewNutrientsNames = [
  "סִידָן",
  "ויטמין D",
  "בַּרזֶל",
  "ויטמין A",
  "מגנזיום",
  "נתרן",
  "יוֹד",
];
