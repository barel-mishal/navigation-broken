import { Fragment, component$, createContextId, useComputed$, useContext, useContextProvider, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { routeLoader$, useLocation, useNavigate } from "@builder.io/qwik-city";
import { Surreal } from "surrealdb.js";
import { type MySession, useDatabase } from "~/routes/layout-account";
import { type UserMeal } from "~/utiles/types_rust_bindings_fitness/UserMeal";

export const useLoaderUserMeal = routeLoader$(async ({sharedMap, params, env}) => {
    const session = sharedMap.get("session") as MySession;
    const db = new Surreal();
    await db.connect(env.get("ROUTE")!, {
        auth: session.database.token,
        ns: env.get('NAMESPACE')!,
        db: env.get('DATABASE')!,
      });
    const result: any = await db.query(`
    SELECT *, time::format(eat_datetime, "%FT%X") AS eat_datetime FROM type::thing($tb, $id);
    `, {
        tb: "UserMeal",
        id: params.mealid
    });
    if (result[0].status !== "OK") throw new Error("No meal to display"); // TODO: handle error send error to previous page and display it
    return result[0].result[0] as UserMeal;
});

export const useMealHook = (meal: UserMeal) => {
    const mealDate = useSignal<string>(() => {   
        return meal.eat_datetime as unknown as string;
    });
    const getPossibleMealName = useComputed$(() => {
        const date = new Date(mealDate.value);
        return `${getMealType(date)}, ${date.toLocaleDateString('he-IL', { dateStyle: 'full' })}`
    });
    const mealIngredients = useSignal<string>(() => meal.ingredients);
    const mealDiscription = useSignal<string>(() => meal.description);
    const stringDuration = useSignal<string>(() => parseFloat(meal.duration).toString());
    return {
        mealDate,
        getPossibleMealName,
        mealIngredients,
        mealDiscription,
        stringDuration,
    }
}

export type Meal = ReturnType<typeof useMealHook>;
export const mealContext = createContextId<Meal>("mealContext");

export default component$(() => {
    const loc = useLocation();
    const databaseMeal = useLoaderUserMeal();
    const meal = useMealHook(databaseMeal.value);
    const database = useDatabase();
    useContextProvider(mealContext, meal);
    const submitMeal = useComputed$<Omit<UserMeal, "user_id" | "created_at">>(() => {
        const utcDate = new Date(meal.mealDate.value);
        const offset = new Date().getTimezoneOffset();
        const adjustedTime = new Date(utcDate.getTime() - (offset * 60000));
        return {
            id: databaseMeal.value.id,
            eat_datetime: adjustedTime,
            description: meal.mealDiscription.value,
            duration: `${meal.stringDuration.value}m`,
            name: meal.getPossibleMealName.value,
            ingredients: meal.mealIngredients.value,
            token: database.value?.session.database.token,        
        }
    });
    const disabled = useComputed$(() => {
        return meal.mealDate.value === "" || meal.mealIngredients.value === "" || meal.stringDuration.value === "";
    });

    const nav = useNavigate();
    useVisibleTask$(async ({track, cleanup}) => {
        const submitMealValue = track(() => submitMeal.value);
        if (!submitMealValue) return;
        const db = new Surreal();
        await db.connect(database.value?.rpc, database.value?.key);
        if (!db) return;
        // TODO: handle error AND debounce and show loading and thortle
        await db.query(`update $thing content {
            eat_datetime: $datetime,
            description: $description,
            duration: <duration> $duration,
            name: $name,
            ingredients: $ingredients,
        }`, {
            thing: submitMealValue.id,
            datetime: submitMealValue.eat_datetime,
            description: submitMealValue.description,
            duration: submitMealValue.duration,
            name: submitMealValue.name,
            ingredients: submitMealValue.ingredients,
        })
        cleanup(() => {
            db.close()
        });
     
    });

    
    return <div class={'grid lg:min-w-[300px] p-2 gap-8'}>
        <h1 class={''}>ארוחה חדשה (<RedStar /> חובה)</h1>
        <div class={'flex flex-col space-y-2 bg-white px-2 py-4 rounded-md shadow-sky-900/40 shadow-lg '}>
            <label class={'text-xl font-bold text-sky-900'} for="meal-date">זמן ארוחה<RedStar /></label>
            <input bind:value={meal.mealDate} class={'bg-sky-200 appearance-none lg:max-w-[500px] border-2 border-sky-200 rounded w-full py-2 px-4 text-emerald-800 leading-tight focus:outline-none focus:bg-white focus:border-emerald-800'} 
            type="datetime-local" id="meal-date" />
            <label class={'text font pt-5 text-sky-500'} for="meal-name">שם ארוחה</label>
            <input disabled={true} bind:value={meal.getPossibleMealName} onFocus$={(_, el) => el.select()} class={'bg-sky-200 disabled:bg-white appearance-none lg:max-w-[500px] rounded w-full py-2 px-4 text-sky-600 leading-tight'} 
             type="text" id="meal-name" />
        </div>
        <div class={'flex flex-col space-y-2 bg-white px-2 py-4 rounded-md shadow-sky-900/40 shadow-lg '}>
            <label class={'text-xl font-bold text-sky-900'} for="meal-duration">משך הארוחה<RedStar /></label>
            <FieldSetTimeDuration />
        </div>
        <div class={'flex flex-col space-y-2 bg-white px-2 py-4 rounded-md shadow-sky-900/40 shadow-lg '}>
            <label class={'text-xl font-bold text-sky-900'} for="meal-ingredients">מצרכי הארוחה<RedStar /></label>
            <textarea bind:value={meal.mealIngredients} rows={6} class={'bg-sky-200 placeholder:text-sky-950/70 appearance-none lg:max-w-[500px] border-2 border-sky-200 rounded w-full py-2 px-4 text-emerald-800 leading-tight focus:outline-none focus:bg-white focus:border-emerald-800'} 
            id="meal-ingredients" placeholder={`חציל\nפלפל\nחביתה`}></textarea>
            <label for="meal-ingredients">כל מצרך בשורה חדשה כמו בדוגמה</label>
        </div>
        <div class={'flex flex-col space-y-2 bg-white px-2 py-4 rounded-md shadow-sky-900/40 shadow-lg '}>
            <label class={'text-xl font-bold text-sky-900'} for="meal-discription">תיאור ארוחה</label>
            <textarea bind:value={meal.mealDiscription} rows={6} class={'bg-sky-200 appearance-none lg:max-w-[500px] border-2 border-sky-200 rounded w-full py-2 px-4 text-emerald-800 leading-tight focus:outline-none focus:bg-white focus:border-emerald-800'} 
            id="meal-discription"></textarea>

        </div>
        <div class={['flex fixed bottom-5 flex-col shadow-emerald-900/40 shadow-lg']}>
            <button disabled={disabled.value} onClick$={async () => {
                nav(`/nutrition-playground/new-meal/${loc.params.mealid}/commit-meal`);
            }} class={[
                'grid bg-emerald-900 px-5 text-emerald-50 py-4 rounded-md ',
                "disabled:cursor-not-allowed disabled:shadow-none disabled:bg-emerald-800 disabled:text-emerald-50",
                ]} type="button">המשך לבחירת מצרכים וכמויות</button>
        </div>
    </div>
});

export const FieldSetTimeDuration = component$(() => {
    const meal = useContext(mealContext);
    
    const useComputedDurations = useComputed$(() => {
        if (isNaN(Number(meal.stringDuration.value))) return {
            two: false,
            six: false,
            twelve: false,
            sixteen: false,
            twenty: false,
            thirty: false,
        };
        const value = parseInt(meal.stringDuration.value);
        return {
            two: value === 2,
            six: value === 6,
            twelve: value === 12,
            sixteen: value === 16,
            twenty: value === 20,
            thirty: value === 30,
        };
    });

    return <Fragment key={'duration-key'}>
    <input bind:value={meal.stringDuration} onFocus$={(_, el) => el.select()} class={'bg-sky-200 appearance-none lg:max-w-[500px] border-2 border-sky-200 rounded w-full py-2 px-4 text-emerald-800 leading-tight focus:outline-none focus:bg-white focus:border-emerald-800'} 
            type="duration" id="meal-duration" />    
    <fieldset class={'flex flex-col gap-2'} onChange$={(e) => {
        const inputElement = e.target as unknown as HTMLInputElement;
        const value = inputElement.value;
        meal.stringDuration.value = value;
    }}>
        <legend class={'py-2'}>בחירת זמן מהירה</legend>
        <div class={'flex gap-4 flex-wrap '}>
            <label class={['text-xl bg-sky-600/30 px-2 rounded-md ', useComputedDurations.value.two ? 'bg-sky-950 text-sky-50' : ""]}>
            <input class={'hidden'} checked={useComputedDurations.value.two} type="checkbox" name="duration" value="2"/> 
                2 דקות
            </label>
            <label class={['text-xl bg-sky-600/30 px-2 rounded-md', useComputedDurations.value.six ? 'bg-sky-950 text-sky-50' : ""]}>
                <input class={'hidden'} checked={useComputedDurations.value.six} type="checkbox" name="duration" value="6"/> 6min
            </label>
            <label class={['text-xl bg-sky-600/30 px-2 rounded-md', useComputedDurations.value.twelve ? 'bg-sky-950 text-sky-50' : ""]}>
                <input class={'hidden'} checked={useComputedDurations.value.twelve} type="checkbox" name="duration" value="12"/> 12min
            </label>
            <label class={['text-xl bg-sky-600/30 px-2 rounded-md', useComputedDurations.value.sixteen ? 'bg-sky-950 text-sky-50' : ""]}>
                <input class={'hidden'} checked={useComputedDurations.value.sixteen} type="checkbox" name="duration" value="16"/> 16min
            </label>
            <label class={['text-xl bg-sky-600/30 px-2 rounded-md', useComputedDurations.value.twenty ? 'bg-sky-950 text-sky-50' : ""]}>
                <input class={'hidden'} checked={useComputedDurations.value.twenty} type="checkbox" name="duration" value="20"/> 20min
            </label>
            <label class={['text-xl bg-sky-600/30 px-2 rounded-md', useComputedDurations.value.thirty ? 'bg-sky-950 text-sky-50' : ""]}>
                <input class={'hidden'} checked={useComputedDurations.value.thirty} type="checkbox" name="duration" value="30"/> 30min
            </label>
        </div>
    </fieldset>
    </Fragment>
});

export const RedStar = component$(() => {
    return <span class={
        'text-red-600 font-bold'
    }>*</span>
});

export const getMealType = (date: Date) => {
    const hours = date.getHours();
    if (hours >= 6 && hours < 11) return 'ארוחת בוקר'; // Breakfast
    if (hours >= 11 && hours < 14) return 'ארוחת צהרים'; // Lunch
    if (hours >= 14 && hours < 18) return 'ארוחת ערב'; // Dinner
    if (hours >= 18 && hours < 24) return 'ארוחת לילה מאוחרת'; // Late Night
    if (hours >= 0 && hours < 6) return 'ארוחת לפנות בוקר'; // Early Morning
  
    return 'lkjkljlkjInvalid Time';
  };