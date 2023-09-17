import type { z } from "zod";
import { type BodyMeasurementsSchema } from "./FittnessSchema";

export type Measurements = z.infer<typeof BodyMeasurementsSchema>;

function calculateMaleBodyFat(measurements: Measurements) {
  const { waist, neck, height, useCentimeters } = measurements;
  if (useCentimeters) {
    return (
      495 /
        (1.0324 -
          0.19077 * Math.log10(waist - neck) +
          0.15456 * Math.log10(height)) -
      450
    );
  } else {
    return (
      86.01 * Math.log10(waist - neck) - 70.041 * Math.log10(height) + 36.76
    );
  }
}

function calculateFemaleBodyFat(measurements: Measurements) {
  const { waist, hips, neck, height, useCentimeters } = measurements;
  if (hips === undefined) return undefined;

  if (useCentimeters) {
    return (
      495 /
        (1.29579 -
          0.35004 * Math.log10(waist + hips - neck) +
          0.221 * Math.log10(height)) -
      450
    );
  } else {
    return (
      163.205 * Math.log10(waist + hips - neck) -
      97.684 * Math.log10(height) -
      78.387
    );
  }
}

export function bodyFatPercentageUSNavy(measurements: Measurements) {
  if (measurements.gender === "male") {
    return calculateMaleBodyFat(measurements);
  } else {
    return calculateFemaleBodyFat(measurements);
  }
}
