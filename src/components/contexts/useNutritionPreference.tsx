import { $, createContextId, useStore } from "@builder.io/qwik";
import { getLocalStorageWithExpiry } from "~/utiles/localStorage";
import NutritionPreferenceSchema, {
  type KeyOfNutritionPreferenceType,
  type NutritionPreferenceType,
} from "~/utiles/nutritionPreference/NutritionPreferenceSchema";
import { type LiteralUnion } from "./useFitnessContext";

type propsOptions = {
  store: Partial<NutritionPreferenceType>;
};

export const useNutritionPreferece = (props: propsOptions) => {
  const store = useStore<Partial<NutritionPreferenceType>>(props.store);

  const updateParam = $(function <K extends KeyOfNutritionPreferenceType>(
    param: K,
    value: NutritionPreferenceType[K]
  ) {
    if (value === "") {
      (store[param] as any) = undefined;
      return;
    }
    const parsedValue = NutritionPreferenceSchema.pick({
      [param]: true,
    }).safeParse({
      [param]: value,
    });
    if (!parsedValue.success) return; // TODO: handle error
    const data = parsedValue.data[param];
    (store[param] as any) = data;
  });

  const getPrefereceFromLocalStorage = $(() => {
    const data = getLocalStorageWithExpiry("preference");
    const parsed = NutritionPreferenceSchema.partial().safeParse(data);
    if (!parsed.success) return; // TODO: handle error
    const preference = parsed.data;
    type PascalCaseEventLiteralType = LiteralUnion<KeyofPreferenceType, string>;
    Object.entries(preference).forEach(
      ([key, value]: [PascalCaseEventLiteralType, any]) => {
        store[key as KeyofPreferenceType] = value;
      }
    );
  });
  return {
    store,
    updateParam,
    getPrefereceFromLocalStorage,
  };
};

export type NutritionPrefereceReturnType = ReturnType<
  typeof useNutritionPreferece
>;

export type KeyofPreferenceType = keyof NutritionPreferenceType;

export const contextNutritionPreferece =
  createContextId<NutritionPrefereceReturnType>("NutritionPreferece");
