import type { FoodSchemaArrayType, IngredientFields } from "./mohIngredientSchema";

export const loadProducts = async () => {
    const ingredientsPromise = fetch("http://localhost/rustapi/foods").then((res) => res.json());
    const fieldsPromise = fetch("http://localhost/rustapi/fields").then((res) => res.json());
    const [ingredients, fields] = await Promise.all([ingredientsPromise, fieldsPromise]);
    // TODO: add in fields type number, string, boolean and list for each field
    return {ingredients, fields} as {ingredients: FoodSchemaArrayType, fields: IngredientFields};
}