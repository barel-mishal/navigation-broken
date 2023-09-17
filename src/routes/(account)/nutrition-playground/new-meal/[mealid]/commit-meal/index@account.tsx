import { Fragment, Resource, type Signal, component$, useComputed$, useResource$, useSignal } from "@builder.io/qwik";
import { useLocation, useNavigate } from "@builder.io/qwik-city";
import { Surreal } from "surrealdb.js";
import { useDatabase } from "~/routes/layout-account";
import { fetchFactory } from "~/utiles/fetchFactory";
import twoDecimalPlaces from "~/utiles/twoDecimalPlaces";
import { type Ingredient } from "~/utiles/types_rust_bindings/Ingredient";
import { type UserMealBuilder } from "~/utiles/types_rust_bindings_fitness/UserMealBuilder";

export default component$(() => {
    const session = useDatabase().value;
    const mealId = useLocation().params.mealid;
    const resource = useResource$<UserMealBuilder>(async () => {
        // send token auth, params
        const send = {
            token: session?.key.auth,
            meal_id: mealId
        }
        const res = await fetchFactory("http://localhost/rustapi/commit-meal", "POST", send);
        const data = await res.json();
        return data;
    });
    const nav = useNavigate();
    return <div>
          <Resource
            value={resource}
            onPending={() => <>Loading...</>}
            onRejected={(error) => <>Error: {error.message}</>}
            onResolved={(repos) => {
            // const foods = "AsIngredients" in repos.foods_eated_ids ? repos.foods_eated_ids.AsIngredients : []
            return <div>
                <h1 class={'text-sky-950 font-semibold mt-6 mb-2 px-2 text-3xl [text-wrap:balance]'}>{repos.meal.name}</h1>
                <SelectedIngredientsRender ingredients={repos.ingredients as any}/>
            </div>
            }}
          />
        <div class={'sticky bottom-5 left-0 flex justify-between'}>
            <button onClick$={async () => {
                // TODO: handle error
                const db = new Surreal();
                await db.connect(session?.rpc, session?.key)
                await db.query(`
                BEGIN TRANSACTION;
                    LET $stuff = SELECT * FROM TempUserFoodRecord;
                    delete TempUserFoodRecord;
                    INSERT INTO UserFoodRecord (SELECT * FROM $stuff);
                COMMIT TRANSACTION;
                `);
                await nav("/nutrition-playground");
            }}  class='min-[450px]:text-xl px-2 py-2 min-[450px]:px-10 min-[410px]:px-5 m-2 bg-emerald-500 text-sky-50 rounded-md shadow-lg shadow-emerald-950'>אכלתי את זה!</button>
            <button onClick$={async () => {
                await nav(`/nutrition-playground/new-meal/${mealId}`);
            }}  class='min-[450px]:text-xl px-2 py-2 min-[450px]:px-10 min-[410px]:px-5 m-2 bg-emerald-500 text-sky-50 rounded-md shadow-lg shadow-emerald-950'>רגע שכחתי משהו</button>
        </div>
    </div>
});

export const SelectedIngredientsRender = component$((props: {ingredients: Ingredient[]}) => {
    
    return <ul class={'flex gap-4 flex-col p-2 flex-grow h-full'}>
        {props.ingredients.map((key) => <SelectedIngredientRender key={key.basic_info.moh_food_id} ingredient={key}/>)}
    </ul>
});

export const SelectedIngredientRender = component$((props: {ingredient: Ingredient}) => {
    const signalShowSearch = useSignal(false);
    const signalAmount = useSignal("1");
    const signalUnitIndex = useSignal("0");
    const computeWeight = useComputed$(async () => {
        const decimalAmount = parseFloat(signalAmount.value)
        return props.ingredient.units[Number(signalUnitIndex.value)].weight*decimalAmount;
    });
    return <li class={'flex flex-col p-2 bg-white rounded-md min-h-[100px] shadow-lg shadow-sky-600/40 gap-6'} >
        {!signalShowSearch.value ? <div class={'md:max-w-[500px] grid gap-4'}>
            <button class={'text-right flex gap-2'} onClick$={() => signalShowSearch.value = !signalShowSearch.value}>
                <svg xmlns="http://www.w3.org/2000/svg" class={'w-8 h-8 min-h-max min-w-max fill-sky-700'} viewBox="0 0 256 256"><path d="M227.32,73.37,182.63,28.69a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31l83.67-83.66,3.48,13.9-36.8,36.79a8,8,0,0,0,11.31,11.32l40-40a8,8,0,0,0,2.11-7.6l-6.9-27.61L227.32,96A16,16,0,0,0,227.32,73.37ZM48,179.31,76.69,208H48Zm48,25.38L51.31,160,136,75.31,180.69,120Zm96-96L147.32,64l24-24L216,84.69Z"></path></svg>
                <h2 class={'text-xl [text-wrap:balance] text-sky-800 '}>{props.ingredient.basic_info.hebrew_name}</h2>
            </button>
            <div class={'flex gap-2 flex-col text-sky-800/80'}>
                <label for="amount-input">כמות</label>
                <input 
                    id="amount-input"
                    type="number" 
                    inputMode="decimal"
                    class={'bg-sky-100 rounded-md text-xl px-3 py-2 text-sky-800 outline-none focus-visible:outline-sky-200 focus-visible:outline-3 m-1 focus-visible:text-sky-900'} 
                    bind:value={signalAmount} 
                    onFocus$={(e, el) => el.select()}
                />
            </div>
            <div class={'flex gap-2 flex-col text-sky-800/80'}>
                <label for="select-unit-input">יחידת מידה</label>
                <SelectedIngredientUnitsRender ingredient={props.ingredient} unitIndex={signalUnitIndex}/>
            </div>
            <p class={'text-sky-700 text-xl p-4'}>סך משקל - {twoDecimalPlaces(computeWeight.value)} גרם</p>     
        </div> : <div><input type="text" value={'מלפפון'} /> <button onClick$={() => signalShowSearch.value = !signalShowSearch.value}>אהה את זה אכלת!</button> </div>}
</li>
});

export const SelectedIngredientUnitsRender = component$((props: {ingredient: Ingredient, unitIndex: Signal<string>}) => {
    return <Fragment>
            {props.ingredient.units.length === 1 ? <p class={'outline-sky-100 rounded-md text-xl px-3 py-2 text-sky-800 outline-none m-2 '}>{`${props.ingredient.units[0].name} ${props.ingredient.units[0].weight} גרם`}</p> : <select name="select-unit-input" id="select-unit-input" bind:value={props.unitIndex}
                class={"bg-sky-100 rounded-md text-xl px-3 py-2 text-sky-800 outline-none disabled:appearance-none focus-visible:outline-sky-200 focus-visible:outline-3 m-1 focus-visible:text-sky-900"}
                >
                    {props.ingredient.units.map((unit, index) => {
                        const name = `${unit.name} ${unit.weight} גרם`
                        return <option 
                            selected={index.toString() === props.unitIndex.value}  
                            key={`${props.ingredient.basic_info.moh_food_id}-${unit.moh_unit_id}`} 
                            value={index}>{name}</option>
                    })}
            </select>}
    </Fragment>
});

