import { type numNullableType } from "./mohIngredients/mohIngredientSchema";

export type KeysOfNumberOrStringProps<T> = { [K in keyof T]: T[K] extends (string | number | numNullableType) ? K : never }[keyof T] ;
