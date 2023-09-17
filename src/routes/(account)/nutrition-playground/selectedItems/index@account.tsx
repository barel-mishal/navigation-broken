import {  type Signal, component$, useContext, useSignal, useStore, useVisibleTask$, useComputed$, useResource$, Resource } from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";
import twoDecimalPlaces from "~/utiles/twoDecimalPlaces";
import { fetchIngredientsResult } from "../index@account";
import { type UserEated } from "~/utiles/types_rust_bindings_fitness/UserEated";
import { type UserData } from "~/utiles/types_rust_bindings_fitness/UserData";
import { type UserEatedFood } from "~/utiles/types_rust_bindings_fitness/UserEatedFood";
import { Surreal } from "surrealdb.js";
import { userSelectedFoods } from "~/routes/layout-account";

export default component$(() => {
    const context = useContext(userSelectedFoods);
    const session = context.session.value!;
    const navigation = useNavigate();
    const userSelectedIngredients = useResource$<UserEated>(async ({track}) => {
        const history = track(() => {
            return {
                ingredients: Object.values(context.userFoodsRecords.value),
                fitness: null,
            }});
        const userData: UserData = {
            timezone: context.timezone,//contextIngredients.timezone,
            foods_history: history.ingredients,
            physical_metrics: null
        } 
        return await fetchIngredientsResult(userData)
    });
    return <>
        <Resource 
        value={userSelectedIngredients}
        onResolved={(ingredients) => {
                return <ul class={'flex gap-4 flex-col p-2 flex-grow h-full'}> {ingredients.foods.map((key) => <SelectedItemsComponent key={key.moh_id} ingredient={key}/>)}</ul>
        }} />
        <div class={'sticky bottom-5 left-0 flex justify-between'}>
            <button onClick$={async () => {
                // TODO: handle error
                const db = new Surreal();
                await db.connect(session?.rpc, session?.key);
                await db.query(`
                BEGIN TRANSACTION;
                    LET $stuff = SELECT * FROM TempUserFoodRecord;
                    delete TempUserFoodRecord;
                    INSERT INTO UserFoodRecord (SELECT * FROM $stuff);
                COMMIT TRANSACTION;
                `);
                context.userFoodsRecords.value = {};
                await navigation("/nutrition-playground");
            }}  class='min-[450px]:text-xl px-2 py-2 min-[450px]:px-10 min-[410px]:px-5 m-2 bg-emerald-500 text-sky-50 rounded-md shadow-lg shadow-emerald-950'>אכלתי את זה!</button>
            <button onClick$={async () => {
                await navigation("/nutrition-playground/search/");
            }}  class='min-[450px]:text-xl px-2 py-2 min-[450px]:px-10 min-[410px]:px-5 m-2 bg-emerald-500 text-sky-50 rounded-md shadow-lg shadow-emerald-950'>רגע שכחתי משהו</button>
        </div>
    </>
});


export const SelectedItemsComponent = component$((props: {ingredient: UserEatedFood}) => {
    const context = useContext(userSelectedFoods);
    const signalItem = useStore(props.ingredient)
    const foodRecord = context.userFoodsRecords.value[signalItem.moh_id.toString()];
    const amount = useSignal(() => !foodRecord ? 0 : foodRecord.amount);
    const signalUnit = useSignal(() => {
        if (!foodRecord) return signalItem.units[0].moh_unit_id.toString();
        return (signalItem.units.find((unit) => unit.moh_unit_id === foodRecord.moh_unit_id)?.moh_unit_id || signalItem.units[0].moh_unit_id).toString(); 
    });
    const FACTOR = 0.5;
    const errorState = useSignal(false);
    const session = context.session.value!;
    useVisibleTask$(async ({track}) => {
        const amountValue = track(() => amount.value);
        const unitValue = track(() => signalUnit.value);
        if (!amountValue || !unitValue) return;
        const unit = signalItem.units.find((unit) => unit.moh_unit_id.toString() === unitValue);
        if (!unit) return;
        const db = new Surreal();
        await db.connect(session?.rpc, session?.key);
        const id = context.userFoodsRecords.value[signalItem.moh_id.toString()]?.id;
        const created = await db.update(id as string, {
            ...context.userFoodsRecords.value[signalItem.moh_id.toString()],
            amount: amountValue,
            moh_unit_id: Number(unit.moh_unit_id),
            moh_food_id: signalItem.moh_id,
        });
        context.userFoodsRecords.value[signalItem.moh_id.toString()] = created[0];
    });
    const computeAmountView = useComputed$(() => {
        return twoDecimalPlaces(amount.value)
    });
    const computeWeight = useComputed$(() => {
        const unit = signalItem.units.find((unit) => unit.moh_unit_id.toString() === signalUnit.value);
        if (!unit) return;
        return twoDecimalPlaces(amount.value * unit.weight)
    });

    return <li key={props.ingredient.moh_id} class={'bg-white rounded-md p-2'}>
        <h1 class={'text-3xl font-bold [text-wrap:balance] text-sky-900/80'}><span class={''}>{props.ingredient.hebrew_name}</span></h1>
        <div class={'flex flex-wrap'}>
            <div class={'flex gap-2 flex-col p-2 pt-4'}>
                <label for={`amount-input-${signalItem.moh_id}`} class={''}>
                <p class={'text-xl '}>כמות</p>            
                </label>
                <div class={'grid gap-2'}>
                    <select onChange$={(event, element) => {
                        signalUnit.value = (element as HTMLSelectElement).value
                    }} class={'text-xl outline outline-sky-950 rounded-md min-w-[250px] px-4 py-2'} 
                    name={`units-select-inputs-${signalItem.moh_id}`} 
                    id={`select-input-units-${signalItem.moh_id}`}>{signalItem.units.map((unit) => {
                        return <UnitOptionComponent currentUnit={signalUnit} unit={unit} key={`${unit.moh_unit_id}-${signalItem.moh_id}`} />
                    })}
                    </select>
                </div>
            </div>
            <div class={'flex gap-2 flex-col p-2 pt-4'}>
                <label for={`amount-input-${signalItem.moh_id}`} class={''}>
                <p class={'text-xl '}>יחידת מידה</p>            
                </label>
                <div class={['grid grid-cols-[4rem,minmax(6rem,4rem),4rem] gap-2']}>
                    <button onClick$={() => {
                        amount.value += FACTOR
                    }} class={['p-2 text-xl text-sky-50 bg-sky-950 rounded-md', errorState.value ? "bg-pink-700" : ""]}>0.5+</button>
                    <input id={`amount-input-${signalItem.moh_id}`} onInput$={(event, element) => {
                        const parsedFloat = parseFloat(element.value);
                        const isNan = isNaN(parsedFloat);
                        if (isNan || !justNumbersOrFloatRegex(element.value) || parsedFloat <= 0) return errorState.value = true;
                        amount.value = parseFloat(parsedFloat.toFixed(3));
                        errorState.value = false;
                    }} onBlur$={(e, el) => {
                        el.value = amount.value.toString();
                        errorState.value = false;
                    }} onFocus$={(event, element) => element.select()} class={['text-center text-xl outline outline-sky-950 rounded-md', errorState.value ? "outline-pink-700" : ""]} value={computeAmountView.value}/>
                    <button onClick$={() => {
                        if (amount.value <= 0.5) return;
                        amount.value -= FACTOR
                    }} class={['p-2 text-xl text-sky-50 bg-sky-950 rounded-md', errorState.value ? "bg-pink-700" : ""]}>0.5-</button>
                </div>
                <label for={`amount-input-${signalItem.moh_id}`} class={''}>
                    {errorState.value ? <p class={'text-xl '}>הערך צריך להיות מספר גדול מאפס</p> : <></> }          
                </label>
            </div>
            <div class={'flex gap-2 flex-col p-2 pt-4'}>
                <label for={`amount-input-${signalItem.moh_id}`} class={''}>
                    סך משקל
                </label>
                <p>{computeWeight.value} גרם</p>
            </div>
        </div>
    </li>  
})

export const UnitOptionComponent = component$((props: {unit: UserEatedFood['units'][0], currentUnit: Signal<string>}) => {
    const children = `${props.unit.name} ${props.unit.weight} גרם`;
    return <option selected={props.currentUnit.value === props.unit.moh_unit_id.toString()} value={props.unit.moh_unit_id.toString()}>
           {children}
    </option>
});

export function justNumbersOrFloatRegex(value: string) {
    return value.match(/^[0-9]+\.?[0-9]*$/);
}