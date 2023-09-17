import { $, type QwikChangeEvent, component$, useComputed$, useSignal } from "@builder.io/qwik";
import { type StaticGenerateHandler, routeLoader$ } from "@builder.io/qwik-city";
import { type FoodSchemaType } from "~/utiles/mohIngredients/mohIngredientSchema";
import { type Ingredient } from "~/utiles/types_rust_bindings/Ingredient";


export const onStaticGenerate: StaticGenerateHandler = async () => {
    const ingredientsPromise = await fetch("http://127.0.0.1:8080/foods").then((res) => res.json());
    const ids = ingredientsPromise as FoodSchemaType[];
    return {
      params: ids.map((id) => {
        return { id: id.smlmitzrach.toString() };
      }),
    };
  };

export const useMohIngredient = routeLoader$(async ({params}) => {
    const id = params.mohId;
    const ingredientsPromise = await fetch(`http://127.0.0.1:8080/foods/${id}`).then((res) => res.json());
    return ingredientsPromise as Ingredient;
});

export const IngredientPage = component$(() => {
    const ingredient = useMohIngredient();
    const servingNumber = useSignal(1);
    const unit = useSignal(ingredient.value.units[0]);
    const computeIngredientAmount = useComputed$(() => {
        return servingNumber.value * (unit.value.weight); // TODO: VALIATE AS NUMBER IS CURRECT
    });
    const onChangeUnit = $((event: QwikChangeEvent<HTMLElement>, element: HTMLSelectElement) => {
        const value = element.value;
        unit.value = ingredient.value.units.find((unit) => unit.moh_unit_id === Number(value))!;
    });

    return <div class={[
        'grid lg:max-w-3xl mt-10 m-auto place-content-start'
    ]}>
        
        <h1 class={'text-6xl text-sky-950 font-bold mb-10'}>{computeIngredientAmount.value}</h1>
        <section class={'bg-white p-5 rounded-lg'}>
            <h2 class={'text-3xl text-sky-950 font-semibold leading-loose'}>ערכים תזונתיים</h2>
            <div class={'flex gap-3 py-3'}>
                <h3 class={'font-semibold text-xl'}>שם מצרך:</h3>
                <p class={'text-right text-lg text-sky-950'}>{ingredient.value.basic_info.hebrew_name}</p>
            </div>
            <div class={'grid grid-cols-2 w-fit gap-5'}>
                <h3 class={'font-semibold text-xl'}>כמות המנה:</h3>
                <select  onChange$={onChangeUnit} name="units-select" id="unit-select">
                    {ingredient.value.units.map((u) => {
                        return <option key={u.moh_unit_id} selected={unit.value.moh_unit_id === u.moh_unit_id} value={u.moh_unit_id}>
                        {`${u.name} ${u.weight} גרם`}
                      </option>
                    })}
                </select>
                <h3 class={'font-semibold text-xl'}>אנרגיה:</h3>
                <p class={'text-left text-lg text-sky-950'}>{ingredient.value.macronutrients.food_energy}</p>
                <h3 class={'font-semibold text-xl col-span-2'}>מאקרונוטרינטים</h3>
                <h4 class={'font-medium text-lg text-sky-900 pr-5'}>סך שומן:</h4>
                <p class={'text-left text-lg text-sky-950'}>{ingredient.value.macronutrients.total_fat}</p>
                {/* <h4 class={'font-medium text-lg text-sky-900 pr-10'}>שומן רווי:</h4>
                <p class={'text-left text-lg text-sky-950'}>{ingredient.value.macronutrients.saturated_fat}</p> */}
                <h4 class={'font-medium text-lg text-sky-900 pr-10'}>שומן טראנס:</h4>
                <p class={'text-left text-lg text-sky-950'}>{ingredient.value.macronutrients.trans_fatty_acids}</p>
                <h4 class={'font-medium text-lg text-sky-900 pr-10'}>שומן חד בלתי רווי</h4>
                <p class={'text-left text-lg text-sky-950'}>{ingredient.value.macronutrients.mono_unsaturated_fat}</p>
                <h4 class={'font-medium text-lg text-sky-900 pr-10'}>שומן רב בלתי רווי</h4>
                <p class={'text-left text-lg text-sky-950'}>{ingredient.value.macronutrients.poly_unsaturated_fat}</p>
                {/* <h4 class={'font-medium text-lg text-sky-900 pr-10'}>כולסטרול:</h4>
                <p class={'text-left text-lg text-sky-950'}>{ingredient.value.macronutrients.cholesterol}</p> */}
                <h4 class={'font-medium text-lg text-sky-900 pr-5'}>סך פחמימות:</h4>
                <p class={'text-left text-lg text-sky-950'}>{ingredient.value.macronutrients.carbohydrates}</p>
                <h4 class={'font-medium text-lg text-sky-900 pr-10'}>סוכרים:</h4>
                <p class={'text-left text-lg text-sky-950'}>{ingredient.value.macronutrients.total_sugars}</p>
                <h4 class={'font-medium text-lg text-sky-900 pr-10'}>סיבים תזונתיים:</h4>
                <p class={'text-left text-lg text-sky-950'}>{ingredient.value.macronutrients.total_dietary_fiber}</p>
                <h4 class={'font-medium text-lg text-sky-900 pr-10'}>פרוקטוז:</h4>
                <p class={'text-left text-lg text-sky-950'}>{ingredient.value.macronutrients.fructose}</p>
                <h4 class={'font-medium text-lg text-sky-900 pr-10'}>סוכר אלכוהול:</h4>
                <p class={'text-left text-lg text-sky-950'}>{ingredient.value.macronutrients.sugar_alcohols}</p>
                <h4 class={'font-medium text-lg text-sky-900 pr-5'}>חלבונים:</h4>
                <p class={'text-left text-lg text-sky-950'}>{ingredient.value.macronutrients.protein}</p>
                <h3 class={'font-semibold text-xl col-span-2'}>ויטמינים</h3>
                <h4 class={'font-medium text-lg text-sky-900 pr-5'}>ויטמין A:</h4>
                <p class={'text-left text-lg text-sky-950'}>{ingredient.value.minerals.vitamin_a_iu}</p>
                <h4 class={'font-medium text-lg text-sky-900 pr-5'}>ויטמין B1:</h4>
                <p class={'text-left text-lg text-sky-950'}>{ingredient.value.minerals.biotin}</p>
                <h3 class={'font-semibold text-xl col-span-2'}>מינרלים</h3>
                <h4 class={'font-medium text-lg text-sky-900 pr-5'}>נתרן:</h4>
                <p class={'text-left text-lg text-sky-950'}>{ingredient.value.minerals.sodium}</p>
                <h4 class={'font-medium text-lg text-sky-900 pr-5'}>אשלגן:</h4>
                <p class={'text-left text-lg text-sky-950'}>{ingredient.value.minerals.potassium}</p>
                <h4 class={'font-medium text-lg text-sky-900 pr-5'}>סידן:</h4>
                <p class={'text-left text-lg text-sky-950'}>{ingredient.value.minerals.calcium}</p>
                <h4 class={'font-medium text-lg text-sky-900 pr-5'}>ברזל:</h4>
                <p class={'text-left text-lg text-sky-950'}>{ingredient.value.minerals.iron}</p>
                <h4 class={'font-medium text-lg text-sky-900 pr-5'}>מגנזיום:</h4>
                <p class={'text-left text-lg text-sky-950'}>{ingredient.value.minerals.magnesium}</p>
                <h4 class={'font-medium text-lg text-sky-900 pr-5'}>זרחן:</h4>
                <p class={'text-left text-lg text-sky-950'}>{ingredient.value.minerals.zinc}</p>
                <h4 class={'font-medium text-lg text-sky-900 pr-5'}>נחושת:</h4>
                <p class={'text-left text-lg text-sky-950'}>{ingredient.value.minerals.copper}</p>
                <h4 class={'font-medium text-lg text-sky-900 pr-5'}>מנגן:</h4>
                <p class={'text-left text-lg text-sky-950'}>{ingredient.value.minerals.manganese}</p>
                <h4 class={'font-medium text-lg text-sky-900 pr-5'}>סלניום:</h4>
                <p class={'text-left text-lg text-sky-950'}>{ingredient.value.minerals.selenium}</p>
                <h4 class={'font-medium text-lg text-sky-900 pr-5'}>פוספור:</h4>
                <p class={'text-left text-lg text-sky-950'}>{ingredient.value.minerals.phosphorus}</p>
            </div>
        </section>

    </div>
});

export default IngredientPage;

