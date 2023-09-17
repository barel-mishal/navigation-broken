import {
  $,
  createContextId,
  useComputed$,
  useSignal,
  useStore,
} from "@builder.io/qwik";
import {
  numberOrStringFloat,
  type FittnessType,
  type KeyofFittnessType,
  FittnessSchema,
  BodyMeasurementsSchema,
  BasicInfoSchema,
  WeightTargetSchema,
  ActivityLevelSchema,
} from "../../utiles/fitnessCalculators/FittnessSchema";
import calculateFitnessData, {
  type TypeFitnessDataResult,
} from "../../utiles/fitnessCalculators/calculateFitnessData";
import { getLocalStorageWithExpiry } from "~/utiles/localStorage";

// eslint-disable-next-line prefer-const
let example: Partial<FittnessType> | undefined = undefined;
example = {
  age: undefined,
  weight: undefined,
  height: undefined,
  activityLevel: undefined,
  createdAt: undefined,
  dailyCaloriesIntake: undefined,
  daliyCalorieDifference: undefined,
  gender: undefined,
  personalGoal: undefined,
  personalGoalWeight: undefined,
  totalDailyEnergyExpenditure: undefined,
  hips: undefined,
  waist: undefined,
  neck: undefined,
  id: undefined,
  menuId: undefined,
  userId: undefined,
  name: undefined,
  personalGoalDate: undefined,
  selectedDriValue: undefined,
  updateAt: undefined,
  useCentimeters: undefined,
};

export const useFitness = () => {
  const store = useStore<Partial<FittnessType>>(example || {});
  const userDecideHisCalorie = useSignal<boolean>(false);

  useComputed$(() => {
    const {
      daliyCalorieDifference,
      totalDailyEnergyExpenditure,
      personalGoal,
    } = store;

    const validDailyCalorie = numberOrStringFloat.safeParse(
      daliyCalorieDifference
    );

    const validTotalEE = numberOrStringFloat.safeParse(
      totalDailyEnergyExpenditure
    );

    if (!validDailyCalorie.success || !validTotalEE.success || !personalGoal)
      return;

    if (personalGoal === "loseWeight") {
      store.dailyCaloriesIntake = validTotalEE.data - validDailyCalorie.data;
    } else if (personalGoal === "gainWeight") {
      store.dailyCaloriesIntake = validTotalEE.data + validDailyCalorie.data;
    } else {
      store.dailyCaloriesIntake = validTotalEE.data;
      store.personalGoalWeight = store.weight;
    }

    return;
  });

  /**
   * @description this function is used to get the fitness data from the local storage and set it to the store
   * @example Usage: useOnDocument('load', fitness.getFitnessFromLocalStorage)
   */

  const updateFitnessParam = $(function <K extends KeyofFittnessType>(
    param: K,
    value: FittnessType[K]
  ) {
    if (value === "") {
      (store[param] as any) = undefined;
      return;
    }
    const parsedValue = FittnessSchema.pick({ [param]: true }).safeParse({
      [param]: value,
    });
    if (!parsedValue.success) return;
    const data = parsedValue.data[param];
    (store[param] as any) = data;
  });

  const result = useComputed$(() => {
    const validPerson = BasicInfoSchema.safeParse(store);
    const validActivityLevelSchema = ActivityLevelSchema.pick({
      activityLevel: true,
    }).safeParse(store);
    const validMeasurements = BodyMeasurementsSchema.safeParse(store);
    const validWeightGoal = WeightTargetSchema.required().safeParse(store);
    if (!validPerson.success) return {} as TypeFitnessDataResult;
    const fitCalc = calculateFitnessData({
      person: validPerson.data,
      activityLevel: validActivityLevelSchema.success
        ? validActivityLevelSchema.data.activityLevel
        : undefined,
      measurements: validMeasurements.success
        ? validMeasurements.data
        : undefined,
      weightGoal: validWeightGoal.success ? validWeightGoal.data : undefined,
    });
    if (fitCalc.averageTDEE && !userDecideHisCalorie.value) {
      store.totalDailyEnergyExpenditure = fitCalc.averageTDEE;
    }
    return fitCalc;
  });

  const getFitnessFromLocalStorage = $(() => {
    const useStorerage = getLocalStorageWithExpiry("fitness");
    const parsedFitness = FittnessSchema.partial().safeParse(useStorerage);
    if (!parsedFitness.success) return; // TODO: handle error
    const data = parsedFitness.data;

    type PascalCaseEventLiteralType = LiteralUnion<KeyofFittnessType, string>;

    Object.entries(data).forEach(
      ([key, value]: [PascalCaseEventLiteralType, any]) => {
        store[key as KeyofFittnessType] = value;
      }
    );
  });

  return {
    store,
    userDecideHisCalorie,
    updateFitnessParam,
    result,
    getFitnessFromLocalStorage,
  };
};

export type FitnessReturnType = ReturnType<typeof useFitness>;

export const FitnessContext = createContextId<FitnessReturnType>("fitness");

export type Primitive =
  | null
  | undefined
  | string
  | number
  | boolean
  | symbol
  | bigint;

export type LiteralUnion<LiteralType, BaseType extends Primitive> =
  | LiteralType
  | (BaseType & Record<never, never>);
