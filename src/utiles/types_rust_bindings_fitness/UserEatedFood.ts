// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { IngredientUnitWithName } from "../types_rust_bindings/IngredientUnitWithName";

export interface UserEatedFood { food_index: number, food_filter: string, user_food_record_id: {Id: string, tb: string} | null | string, amount: number, current_weight: number, moh_unit_id: number, units: Array<IngredientUnitWithName>, datetime: string, moh_code: number, moh_ind: number, hebrew_name: string, name: string, moh_id: number, protein: number, carbohydrates: number, alcohol: number, total_fat: number, total_sugars: number, food_energy: number, }