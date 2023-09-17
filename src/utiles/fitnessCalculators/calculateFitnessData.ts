import BMI from "./BMI";
import { type TypeActivityLevelSchema } from "./FittnessSchema";
import {
  type Person,
  mifflinStJeor,
  revisedHarrisBenedictBMR,
} from "./bmrEquations";
import {
  calculateLeanBodyMass,
  restingMetabolicRateCunningham,
} from "./bodyFatAndRMRCalculator";
import {
  type Measurements,
  bodyFatPercentageUSNavy,
} from "./bodyFatCalculator";
import targetDateEstimator, { type WeightGoal } from "./targetDateEstimator";
import { calculateTdee } from "./tdeeCalculator";

const calculateFitnessData = (inputData: {
  person: Person;
  activityLevel: TypeActivityLevelSchema["activityLevel"] | undefined;
  measurements?: Measurements;
  weightGoal?: Required<WeightGoal>;
}) => {
  const hbBMR = revisedHarrisBenedictBMR(inputData.person);
  const msBMR = mifflinStJeor(inputData.person);
  const usNavyFatPercentage = inputData.measurements
    ? bodyFatPercentageUSNavy(inputData.measurements)
    : undefined;
  const leanMass = usNavyFatPercentage
    ? calculateLeanBodyMass(inputData.person.weight, usNavyFatPercentage)
    : undefined;
  const cunninghamRMR = leanMass
    ? restingMetabolicRateCunningham(leanMass)
    : undefined;
  const hbTDEE =
    hbBMR && inputData.activityLevel
      ? calculateTdee(hbBMR, Number(inputData.activityLevel))
      : undefined;
  const msTDEE =
    msBMR && inputData.activityLevel
      ? calculateTdee(msBMR, Number(inputData.activityLevel))
      : undefined;
  const cunninghamTDEE =
    cunninghamRMR && inputData.activityLevel
      ? calculateTdee(cunninghamRMR, Number(inputData.activityLevel))
      : undefined;
  const bodyMassIndex =
    inputData.person.weight && inputData.person.height
      ? BMI(inputData.person)
      : undefined;
  const goalDate = !inputData.weightGoal
    ? undefined
    : targetDateEstimator(inputData.weightGoal);
  const averageTDEE =
    hbTDEE && msTDEE && cunninghamTDEE
      ? (hbTDEE + msTDEE + cunninghamTDEE) / 3
      : hbTDEE && msTDEE
      ? (hbTDEE + msTDEE) / 2
      : undefined;
  return {
    hbBMR,
    msBMR,
    usNavyFatPercentage,
    leanMass,
    cunninghamRMR,
    hbTDEE,
    msTDEE,
    cunninghamTDEE,
    averageTDEE,
    bodyMassIndex,
    goalDate,
  };
};

export type TypeFitnessDataResult = ReturnType<typeof calculateFitnessData>;

export default calculateFitnessData;
