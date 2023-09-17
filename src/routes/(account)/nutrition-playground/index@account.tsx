import { Resource, type Signal, component$, useResource$, useSignal, type QwikIntrinsicElements, useVisibleTask$, useContext, useComputed$, useTask$, Fragment } from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";
import { type UserFoodRecord } from "~/utiles/types_rust_bindings_fitness/UserFoodRecord";
import { type UserEatedFoodVec } from "~/utiles/types_rust_bindings_fitness/UserEatedFoodVec";
import twoDecimalPlaces from "~/utiles/twoDecimalPlaces";
import { type UserEated } from "~/utiles/types_rust_bindings_fitness/UserEated";
import { type UserData } from "~/utiles/types_rust_bindings_fitness/UserData";
import { Surreal } from "surrealdb.js";
import { type Ingredient } from "~/utiles/types_rust_bindings/Ingredient";
import { type ResponseUserFoodRecord, type UserFoodRecordForDb, userSelectedFoods } from "~/routes/layout-account";
import { fetchFactory } from "~/utiles/fetchFactory";



export const fetchIngredientsResult = async (userData: UserData) => {
    const response = await fetchFactory(`http://localhost/rustapi/user_selected_moh_foods`, "POST", userData);
    const result = await response.json()
    return result
}

export default component$(() => {
    const context = useContext(userSelectedFoods);
    const session = context.session.value;
    useTask$(async () => {
        if (!session) return;
        const db = new Surreal();
        await db.connect(session.rpc, session.key);
        context.userFoodsHistory.value = await db.select<UserFoodRecordForDb>("UserFoodRecord");
    });
    useTask$(async () => {
        if (!session) return;
        const db = new Surreal();
        await db.connect(session.rpc, session.key);
        const something = (await db.query<any>("select * from UserPhysicalMetrics order by datetime desc limit 1"));  
        if (!Array.isArray(something) || !Array.isArray(something[0].result)) return;
        context.person.value = something[0].result[0]
      });
    const userSelectedIngredients = useResource$<UserEated>(async ({track}) => {
        const history = track(() => {
            return {
                ingredients: context.userFoodsHistory.value,
                fitness: null
            }});
        if (history.ingredients.length === 0) return {foods: []}
        const userData: UserData = {
            timezone: "Asia/Jerusalem",//contextIngredients.timezone,
            foods_history: history.ingredients,
            physical_metrics: null
        } 
        return await fetchIngredientsResult(userData)
    });
    
    return <>
        <div class={'space-y-4 flex gap-4 flex-col flex-grow h-full'}>
            <Resource 
                onResolved={
                    (ingredients) => <>{ingredients.foods.length > 0 ? <IngredientsTimeline ingredients={ingredients} /> : <StartState />}</>}
                onPending={() => <div>מעלה את התוכן</div>}
                value={userSelectedIngredients}
                onRejected={(e) => {
                    console.error(e);
                return <>משהו קרה מצטערים</>}}
            />
        </div>
        <NevigationPlayGround />
    </>
});

export const NevigationPlayGround = component$(() => {
    const showOptions = useSignal(false);
    const navigator = useNavigate();
    return  <div class={'sticky bottom-5 left-0 flex flex-col items-start gap-5'}>
        {showOptions.value && <div class={'flex rounded-md bg-indigo-900 shadow-md shadow-indigo-700/40 '}>
            <button onClick$={async () => {
                await navigator("/nutrition-playground/new-meal/");
            }}  class='text-2xl py-4 px-10 text-indigo-50'>אכלתי ארוחה</button>
        </div>}
        <div class={'flex bg-sky-800 rounded-md shadow-md shadow-sky-700/40'}>
            <button onClick$={() => showOptions.value = !showOptions.value}  class='text-xl py-2 px-6 bg-indigo-900 rounded-md shadow-md shadow-indigo-700/40'><span class={''}><VerticalThreeDotsSVG /></span></button>
            <button onClick$={async () => {
                await navigator("/nutrition-playground/search/");
            }}  class='text-xl py-4 px-10 text-sky-50 '><span>אכלתי</span></button>
        </div>
    </div>
});

export const StartState = component$(() => {
    return <div class={'p-2 '}><div class={'rounded-md bg-white'}><div class={'prose p-4'}>
    <h2 class={'text-sky-900'}>העוזרת האישי שלך לאכילה</h2>        
    <p class={'text-sky-950'}>מתחילים לרשום מה שאכלתם ולאט לאט היא תדייק לך את התוזנה לפי סוגי המאכלים שאת/אתה אוהב/ת והצרכים האישיים שלך מבחינה תזונתית</p>        
    <p class={'text-sky-950'}>הוא ימליץ לך על מאכלים שישלמו לך לתזונה בריאה יעדכן אותך שהגעת לכמות שאת/ה צריכ/ה והוא ידריך אותך בדרך לאכילה בריאה יותר שתטיב לך</p>        
    <p class={'text-sky-950'}>הכלי הזה פשוט לשימוש אך מאחורי הקלעים יש מורכבות ומתחשב בכ30 פרמטרים בריאותיים ואני מתכוון להוסיף עוד להתאמה יותר אישית של התזונה.</p>        
</div></div></div>
});

export const IngredientsTimeline = component$((props: {ingredients: UserEated}) => {
    const signalIngredients = useSignal<UserEated>(props.ingredients);
    const context = useContext(userSelectedFoods);
    const computeComputetion = useComputed$(() => {
        const obj = signalIngredients.value;
        return {
            totalEnergy: twoDecimalPlaces(obj.totals[obj.last_date].total_energy),
            totalProtein: twoDecimalPlaces(obj.totals[obj.last_date].total_protein),
            totalCarbohydrates: twoDecimalPlaces(obj.totals[obj.last_date].total_carbohydrates),
            totalTotalFat: twoDecimalPlaces(obj.totals[obj.last_date].total_total_fat),
            // not total sugar but total fiber
            totalFiber: twoDecimalPlaces(obj.totals[obj.last_date].total_dietary_fiber),
            averageEnergy: twoDecimalPlaces(obj.averages.day_average_food_energy),
            averageProtein: twoDecimalPlaces(obj.averages.day_average_protein),
            
            macro: {
                protein: twoDecimalPlaces(obj.macro_precentages?.Protein || 0),
                carbohydrates: twoDecimalPlaces(obj.macro_precentages?.Carbohydrates || 0),
                total_fat: twoDecimalPlaces(obj.macro_precentages?.TotalFat || 0),
                alcohol: twoDecimalPlaces(obj.macro_precentages?.Alcohol || 0),
                fiber: twoDecimalPlaces(obj.macro_precentages?.TotalDietaryFiber || 0),
            }
        }
    });
    useVisibleTask$(() => {
        const fitness = localStorage.getItem("preference");
        if (fitness) {
            context.person.value = JSON.parse(fitness);
        }
    });
    return <div class={''}>
        <div class={'bg-white grid grid-cols-[repeat(auto-fill,minmax(min(10rem,100%),1fr))] gap-6 px-2 py-8'}>
            <h4 class={'col-span-full text-3xl pt-4 text-sky-950'}>קלוריות</h4>
            <p class={'grid grid-rows-2'}>
               <span class={'text-sky-800'}>סה"כ קלוריות היום:</span><span class={'font-semibold leading-none text-2xl text-sky-950'}>{computeComputetion.value.totalEnergy}</span>
            </p>
            <p class={'grid grid-rows-2'}>
                <span class={'text-sky-800'}>ממוצע קלוריות יומי:</span><span class={'font-semibold leading-none text-2xl text-sky-950'}>{computeComputetion.value.averageEnergy}</span>
            </p>
            <h4 class={'col-span-full text-3xl pt-4 text-sky-950'} >אחוז מאקרונוטרים</h4>
            
            <p class={'grid grid-rows-2'}>
                <span class={'text-sky-800'}>% חלבון</span>
                <span class={'font-semibold leading-none text-2xl text-sky-950'}>{computeComputetion.value.macro.protein}</span>
            </p>
            <p class={'grid grid-rows-2'}>
                <span class={'text-sky-800'}>% פחמימה</span>
                <span class={'font-semibold leading-none text-2xl text-sky-950'}>{computeComputetion.value.macro.carbohydrates}</span>
            </p>
            <p class={'grid grid-rows-2'}>
                <span class={'text-sky-800'}>% שומן</span>
                <span class={'font-semibold leading-none text-2xl text-sky-950'}>{computeComputetion.value.macro.total_fat}</span>
            </p>
            <p class={'grid grid-rows-2'}>
                <span class={'text-sky-800'}>% סיבים תזונתיים</span>
                <span class={'font-semibold leading-none text-2xl text-sky-950'}>{computeComputetion.value.macro.fiber}</span>
            </p>
            <h4 class={'col-span-full text-3xl pt-4 text-sky-950'} >סה"כ מאקרונוטרינטים יומי</h4>
            <p class={'grid grid-rows-2'}>
                <span class={'text-sky-800'}>כמות חלבון בגרם</span>
                <span class={'font-semibold leading-none text-2xl text-sky-950'}>{computeComputetion.value.totalProtein}</span>
            </p>
            <p class={'grid grid-rows-2'}>
                <span class={'text-sky-800'}>כמות פחמימה בגרם</span>
                <span class={'font-semibold leading-none text-2xl text-sky-950'}>{computeComputetion.value.totalCarbohydrates}</span>
            </p>
            <p class={'grid grid-rows-2'}>
                <span class={'text-sky-800'}>כמות שומן בגרם</span>
                <span class={'font-semibold leading-none text-2xl text-sky-950'}>{computeComputetion.value.totalTotalFat}</span>
            </p>
            <p class={'grid grid-rows-2'}>
                <span class={'text-sky-800'}>כמות הסיבים בגרם</span>
                <span class={'font-semibold leading-none text-2xl text-sky-950'}>{computeComputetion.value.totalFiber}</span>
            </p>
            <h4 class={'col-span-full text-3xl pt-4 text-sky-950'} >ממוצע חלבון יומי</h4>
            <p class={'grid grid-rows-2'}>
                <span class={'text-sky-800'}>ממוצע חלבון יומי</span>
                <span class={'font-semibold leading-none text-2xl text-sky-950'}>{computeComputetion.value.averageProtein}</span>
            </p>
        </div>
        <RenderIngredients ingredients={signalIngredients.value.foods} />
    </div>
});

export const RenderIngredients = component$((props: {ingredients: UserEatedFoodVec}) => {
    const randomBool = [Math.random() < 0.9, Math.random() < 0.02, Math.random() < 0.02, Math.random() < 0.9, Math.random() < 0.02, Math.random() < 0.02, Math.random() < 0.02, Math.random() < 0.02, Math.random() < 0.02, Math.random() < 0.02]
    return  <div class={'flex flex-col bg-white'}>
    {props.ingredients.map((ingredient, index) => {
        return <Fragment key={ingredient.moh_id}>{randomBool[index] ? <RenderMeal /> : <RenderIngredient key={`${index}-${ingredient.moh_id}`} ingredient={ingredient}/>}</Fragment>
    })}
</div>
});

export const RenderIngredient = component$((props: {ingredient: UserEatedFoodVec[number]}) => {
    const formatDatetime = (datetime: string) => {
        const parsed = datetime.split(' ')
        const time = parsed[1]
        const date = parsed[0]
        return {
            date,
            time
        }
    }
    const formatedDatetime = formatDatetime(props.ingredient.datetime);
    return <div class={'odd:bg-sky-50 flex gap-2 px-2 items-center'}>
    <div class={'text-sky-950/70 flex flex-col-reverse gap-2 text-xs'}>{formatedDatetime.date}<span>{formatedDatetime.time}</span></div>
    <div class={['grid grid-cols-[repeat(auto-fill,minmax(min(10rem,100%),1fr))] gap-2 px-2 py-5 flex-grow']}>
        <p class={'text-xl [text-wrap:balance] col-span-full font-semibold text-sky-950'}>{props.ingredient.hebrew_name}</p>
        <p class={'flex flex-row gap-2 text-sky-950/70'}><span class={''}>{'אנרגיה'}</span><span class={''}>{twoDecimalPlaces(props.ingredient.food_energy)}</span></p>
        <p class={'flex flex-row gap-2 text-sky-950/70'}><span class={''}>{'חלבון'}</span><span class={''}>{twoDecimalPlaces(props.ingredient.protein)}</span></p>
        <p class={'flex flex-row gap-2 text-sky-950/70'}><span class={''}>{'פחמימה'}</span><span class={''}>{twoDecimalPlaces(props.ingredient.carbohydrates)}</span></p>
        <p class={'flex flex-row gap-2 text-sky-950/70'}><span class={''}>{'שומן'}</span><span class={''}>{twoDecimalPlaces(props.ingredient.total_fat)}</span></p>
    </div>
</div>
});

export const RenderMeal = component$(() => {
    const formatDatetime = (datetime: string) => {
        const parsed = datetime.split(' ')
        const time = parsed[1]
        const date = parsed[0]
        return {
            date,
            time
        }
    }
    const dateParsed = formatDatetime(new Date().toLocaleString());
    return <div class={'odd:bg-teal-50 flex gap-2 px-2 items-center'}>
            <div class={'text-teal-950/70 flex flex-col-reverse gap-2 text-xs'}>{dateParsed.date}<span>{dateParsed.time}</span></div>
            <div class={['grid grid-cols-[repeat(auto-fill,minmax(min(10rem,100%),1fr))] gap-2 px-2 py-5 flex-grow']}>
                <p class={'text-xl [text-wrap:balance] col-span-full font-semibold text-teal-950 flex gap-6 items-center'}>{"ארוחה בבית עם שרון"} <span class={'text-teal-800/50 flex items-center gap-2 text-sm'}><ClockCountdownSvg />{30} דקות</span> </p>
                <p class={'flex flex-row gap-2 col-span-full text-teal-950/70'}>שם ארוחה, זמן תחילת הארוחה, משך הארוחה, המאכלים שנאכלו, תיאור כללי, סיכום תזונתי</p>
                <p class={'flex font-semibold flex-row gap-2 text-teal-950/70'}><span class={''}>{'אנרגיה'}</span><span class={''}>{500}</span></p>
                <p class={'flex font-semibold flex-row gap-2 text-teal-950/70'}><span class={''}>{'חלבון'}</span><span class={''}>{500}</span></p>
                <p class={'flex font-semibold flex-row gap-2 text-teal-950/70'}><span class={''}>{'פחמימה'}</span><span class={''}>{500}</span></p>
                <p class={'flex font-semibold flex-row gap-2 text-teal-950/70'}><span class={''}>{'שומן'}</span><span class={''}>{500}</span></p>
            </div>
    </div>
});

export const IngredientsFilters = component$((props: {ingredients: Ingredient[], search: Signal<string>, inputRef: HTMLInputElement | undefined, divAtrr: QwikIntrinsicElements['div']}) => {
    return <div {...props.divAtrr}>
        <ul>
            {props.ingredients.map((ingredient, index) => {
                return <IngredientFilter index={index} ingredient={ingredient} key={ingredient.basic_info.moh_food_id} inputRef={props.inputRef} search={props.search} />
            })}
        </ul>
    </div>
});

export const IngredientFilter = component$((props: {index: number, ingredient: Ingredient, search: Signal<string>, inputRef: HTMLInputElement | undefined}) => {
    const context = useContext(userSelectedFoods);
    const session = context.session.value!;
    const selected = context.computeSelectedItems.value.findIndex((item) => item === props.ingredient.basic_info.moh_food_id.toString()) !== -1;
    return <li class={['odd:bg-sky-50', selected ? "!bg-slate-200 !text-slate-900" : ""]}>
        <button class={' text-right px-2 py-4 w-full [text-wrap:balance] hover:bg-sky-600 hover:text-sky-50'} onClick$={async () => {
            const db = new Surreal();
            await db.connect(session.rpc, session.key);
            const value2: ResponseUserFoodRecord[] = await db.query("CREATE TempUserFoodRecord CONTENT $data RETURN select * from TempUserFoodRecord", {data: {
                amount: 1,
                moh_unit_id: props.ingredient.units[0].moh_unit_id,
                moh_food_id: props.ingredient.basic_info.moh_food_id,
                filter: props.search.value.trim(),
                order_index: 0,
                eat_datetime: new Date().toISOString(),
            }}) as any;
            context.userFoodsRecords.value = value2[0].result[0]["(SELECT * FROM TempUserFoodRecord)"].reduce((acc, curr) => {
                acc[curr.moh_food_id!] = curr;
                return acc;
            }, {} as Record<string, UserFoodRecord>);
            if (props.inputRef) props.inputRef.focus();
            props.search.value = '';
        }}>{props.ingredient.basic_info.hebrew_name}</button>
    </li>
});
  

export const ClockCountdownSvg = component$(() => {
    return <svg xmlns="http://www.w3.org/2000/svg" class={'fill-sky-800/50 w-6 h-6'} viewBox="0 0 256 256"><path d="M232,136.66A104.12,104.12,0,1,1,119.34,24,8,8,0,0,1,120.66,40,88.12,88.12,0,1,0,216,135.34,8,8,0,0,1,232,136.66ZM120,72v56a8,8,0,0,0,8,8h56a8,8,0,0,0,0-16H136V72a8,8,0,0,0-16,0Zm40-24a12,12,0,1,0-12-12A12,12,0,0,0,160,48Zm36,24a12,12,0,1,0-12-12A12,12,0,0,0,196,72Zm24,36a12,12,0,1,0-12-12A12,12,0,0,0,220,108Z"></path></svg>
});

export const VerticalThreeDotsSVG = component$(() => {
    return <svg xmlns="http://www.w3.org/2000/svg" class={'fill-sky-50 w-6 h-6'} viewBox="0 0 256 256"><path d="M128,96a32,32,0,1,0,32,32A32,32,0,0,0,128,96Zm0,48a16,16,0,1,1,16-16A16,16,0,0,1,128,144Zm0-64A32,32,0,1,0,96,48,32,32,0,0,0,128,80Zm0-48a16,16,0,1,1-16,16A16,16,0,0,1,128,32Zm0,144a32,32,0,1,0,32,32A32,32,0,0,0,128,176Zm0,48a16,16,0,1,1,16-16A16,16,0,0,1,128,224Z"></path></svg>
});