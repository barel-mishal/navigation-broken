import { component$, type QwikIntrinsicElements, useSignal, useResource$, Resource, useTask$, useContext, useComputed$, type Signal, createContextId, useContextProvider } from "@builder.io/qwik";
import { IngredientsFilters } from "../index@account";
import { useNavigate } from "@builder.io/qwik-city";
import { Surreal } from "surrealdb.js";
import { type UserFoodRecord } from "~/utiles/types_rust_bindings_fitness/UserFoodRecord";
import { type Ingredient } from "~/utiles/types_rust_bindings/Ingredient";
import { type ResponseUserFoodRecord, userSelectedFoods } from "~/routes/layout-account";

export default component$(() => {
    const navigation = useNavigate();
    const items = useContext(userSelectedFoods);
    return <>
    <IngredientsFiltersSearchArea divAtrr={{class: `--tw w-full bg-white flex gap-4 flex-col p-2 flex-grow h-full`}} />
    <div class={'sticky bottom-5 left-0 flex justify-between'}>
        <button disabled={items.countItems.value <= 0} onClick$={async () => {
            if (items.countItems.value <= 0) return;
            await navigation("/nutrition-playground/selectedItems/");
        }}  class={[
            'min-[450px]:text-xl px-2 py-2 min-[450px]:px-10 min-[410px]:px-5 m-2 bg-emerald-500 text-sky-50 rounded-md shadow-lg shadow-emerald-950',
            'disabled:bg-emerald-300 disabled:text-sky-50 disabled:shadow-none disabled:pointer-events-none disabled:cursor-not-allowed ',
            "justify-self-start"
        ]}>המשך לבחירת כמויות</button>
        <button onClick$={async () => {
            await navigation("/nutrition-playground/");
        }}  class='min-[450px]:text px-2 py-2 min-[450px]:px-10 italic underline min-[410px]:px-5 m-2 text-sky-950 rounded-md justify-self-end'>חזרה</button>
    </div>
    </>
});
export const SearchProvider = createContextId<Signal<string>>("searchProvider");
export const IngredientsFiltersSearchArea = component$((props: {divAtrr: QwikIntrinsicElements['div']}) => {
    const searchSignal = useSignal('');
    useContextProvider(SearchProvider, searchSignal);
    const debouncedValue = useSignal('');
    useTask$(({ track, cleanup }) => {
      track(() => searchSignal.value);
   
      const debounced = setTimeout(() => {
        debouncedValue.value = searchSignal.value;
      }, 200);
   
      cleanup(() => clearTimeout(debounced));
    });

    const ingredientsResource = useResource$<Ingredient[]>(async ({track, cleanup}) => {
        const search = track(() => debouncedValue.value);
        
        if (!search) return [];
        const abortController = new AbortController();
        cleanup(() => abortController.abort("cleanup"));
        const response = await fetch(`http://localhost/rustapi/searchFood/${search}`, {
            signal: abortController.signal,
        });
        const result = await response.json()
        return result
    });
    const signalInputRef = useSignal<HTMLInputElement>();


  return <div {...props.divAtrr}>
        <div class={'flex flex-row-reverse gap-4'}>
            <input type="text" bind:value={searchSignal} ref={signalInputRef} class={[
                'w-full outline outline-sky-200 rounded-md px-2 py-2 focus-visible:outline-yellow-700',
                "disabled:bg-sky-50 disabled:text-sky-950 disabled:outline-none disabled:pointer-events-none disabled:cursor-not-allowed"
            ]} />
        </div>
        <IngredientsSelected />
        <Resource 
            onResolved={(ingredients) => {
                return <>{ingredients.length ? <IngredientsFilters
                    key={'search-ingredients-list'} 
                    ingredients={ingredients} 
                    search={searchSignal}
                    inputRef={signalInputRef.value}
                    divAtrr={{class: `--tw text-sky-950`}} /> : <IngredientsFiltersHistory search={searchSignal} divAtrr={{class: `--tw `}} />}</>
                
            }}
            onPending={() => {
                return <>טוען</>
            }}
            value={ingredientsResource}
            onRejected={() => <>משהו קרה מצטערים</>}
        /> 
  </div>
});

export const IngredientsFiltersHistory = component$((props: {divAtrr: QwikIntrinsicElements['div'], search: Signal<string>}) => {
    const context = useContext(userSelectedFoods);
    const cumputeLastFilters = useComputed$(() => {
        const sortedItems = context.userFoodsHistory.value.reduceRight((acc, item) => {
            const key = item.filter;
            if (acc.has(key)) {
                acc.set(key, acc.get(key) + 1);
            } else {
                acc.set(key, 1);
            }
            return acc;
        }, new Map());
        return Array.from(sortedItems.keys()) as string[];
    });
    return <div {...props.divAtrr}>
    {/* {props.search.value === "" ? <div class={'flex flex-col gap-4'}>
        <h2 class={'text-xl font-bold px-2'}>חיפושים אחרונים</h2>
            <ul class={'flex flex-col'}>
                {cumputeLastFilters.value.map((item) => <FiltesForUser key={item} filter={item} search={props.search}/>)}
            </ul>
        </div> : <></>} */}
     {(props.search.value === "" && context.userFoodsHistory.value.length > 0) ? <div class={'flex flex-col gap-4'}>
        <h2 class={'text-xl font-bold px-2'}>חיפושים אחרונים</h2>
            <ul class={'flex flex-col'}>
                {cumputeLastFilters.value.map((item) => <FiltesForUser key={item} filter={item} search={props.search}/>)}
            </ul>
        </div> : <div>
        <h2 class={'text-xl font-bold px-2'}>עבור <span class={'bg-sky-200 text-sky-950 rounded-md'}>"{props.search.value}"</span> לא נמצאו תוצאות</h2>
        <h2 class={'text-xl font-bold px-2'}>חיפושים אחרונים</h2>
        <ul class={'flex flex-col'}>
            {cumputeLastFilters.value.map((item) => <FiltesForUser key={item} filter={item} search={props.search}/>)}
        </ul>
     </div>}
    </div>
});

export const FiltesForUser = component$((props: {filter: string, search: Signal<string>}) => {
    return <li class={'odd:bg-sky-50'}>
        <button class={'text-right px-2 py-4 w-full'} onClick$={() => {
            props.search.value = props.filter;
        }}>
            {props.filter}
        </button>
    </li>
});

export type selectedIngredient = {moh_id: number, hebrew_name: string}

export const IngredientsSelected = component$(() => {
    const context = useContext(userSelectedFoods);
    const selectedItems = useComputed$(async () => {
        if (context.computeSelectedItems.value.length <= 0) return [];
        const fetchItems = await fetch(`http://localhost/rustapi/get_ingredients?ids=${context.computeSelectedItems.value.join(',')}`)
        return await fetchItems.json() as selectedIngredient[]
    });
    return <ul class={'flex gap-3 overflow-auto'}>
        {selectedItems.value.map((item) => {
            return <SelectedIngredients key={item.moh_id} ingredient={item} />
        })}
    </ul>
});

export const SelectedIngredients = component$((props: {ingredient: selectedIngredient}) => {
    const context = useContext(userSelectedFoods);
    const session = context.session.value!;
    const search = useContext(SearchProvider);

    const signalItem = useSignal(context.userFoodsRecords.value[props.ingredient.moh_id.toString()]);
    return <li  class={'border border-indigo-400 p-3 rounded-full whitespace-nowrap flex flex-row-reverse justify-end gap-3 items-center w-[230px] '}>
        <button class={'truncate text-indigo-400'} onClick$={() => {
              search.value = signalItem.value.filter;          
        }}>
            {props.ingredient.hebrew_name}
        </button>
        <button onClick$={async () => {
            const db = new Surreal();
            await db.connect(session?.rpc, session?.key);
            const rest = await db.query(`DELETE $toDelete RETURN (SELECT * FROM TempUserFoodRecord);`, {
                toDelete: signalItem.value?.id
            }) as unknown as ResponseUserFoodRecord[];
            rest[0].result[0]['(SELECT * FROM TempUserFoodRecord)'];
            context.userFoodsRecords.value = rest[0].result[0]['(SELECT * FROM TempUserFoodRecord)'].reduce((acc, curr) => {
                acc[curr.moh_food_id!] = curr;
                return acc;
            }, {} as Record<string, UserFoodRecord>);
        }}>
            <svg xmlns="http://www.w3.org/2000/svg" class={'w-3 h-3 fill-indigo-800'} viewBox="0 0 256 256">
            <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z">
            </path>
            </svg>
        </button>
        
    </li>
});