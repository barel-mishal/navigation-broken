// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { Ingredient } from "../types_rust_bindings/Ingredient";
import type { UserFoodRecord } from "./UserFoodRecord";

export type FoodsType = { "AsIds": Array<string> } | { "AsIngredients": Array<UserFoodRecord> } | { "AsIngredientsIntermediate": Array<Ingredient> };