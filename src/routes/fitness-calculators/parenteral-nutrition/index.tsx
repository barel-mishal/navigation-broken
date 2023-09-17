import { component$, useComputed$, useSignal } from "@builder.io/qwik";

export default component$(() => {
    const name = useSignal("");
    const caseDescription = useSignal("");
    const height = useSignal("");
    const weight = useSignal("");
    const bmi = useSignal("");
    const dygistiveSystemState = useSignal("");
    const personCanEatDate = useSignal("");
    const manualFillingState = useSignal(false);
    const assessFluidsWeightFactor = useSignal("25");
    const assessCaloriesNeededCalorieFactor = useSignal("30");
    const proteinRequirements = useSignal("1");
    const carbohydrateRequirements = useSignal("3");
    const proteinCaloriesFactor = useSignal("4");
    const carbohydrateCaloriesFactor = useSignal("3.4");
    const minsInDay = useSignal("1440");
    const results = useComputed$(() => {
        const calorieFromProtein = parseFloat(proteinCaloriesFactor.value) * parseFloat(weight.value) || 0;
        const calorieFromCarbohydrate = parseFloat(carbohydrateCaloriesFactor.value) * parseFloat(weight.value) || 0;
        const calories = parseFloat(assessCaloriesNeededCalorieFactor.value) * parseFloat(weight.value) || 0;
        return {
            fluids: parseFloat(assessFluidsWeightFactor.value) * parseFloat(weight.value) || 0,
            calories,
            protein: parseFloat(proteinRequirements.value) * parseFloat(weight.value) || 0,
            carbohydrate: parseFloat(carbohydrateRequirements.value) * parseFloat(weight.value) || 0,
            calorieFromProtein,
            calorieFromCarbohydrate,
            calorieFromFat: calories - calorieFromProtein + calorieFromCarbohydrate,
        }
    });
    return <div class={'space-y-8 mt-5 p-2'}>
        <h1 class={'text-6xl text-sky-950 mt-3 font-semibold [text-wrap:balance]'}>מחולל מרשם להזנה פארנטלית</h1>
        <div class={'bg-white shadow-xl shadow-sky-950/30 text-sky-900 p-3 rounded-lg'}>
            <div class={'min-w-[400px]'}>
                <h2 class={'text-4xl font-semibold text-sky-950 my-3'}>נתונים</h2>
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="name">
                        שם מטופל
                    </label>
                    <div class="md:w-2/3">
                        <input inputMode="text" class="bg-sky-200 appearance-none border-2 border-sky-200 rounded w-full py-2 px-4 text-green-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500" id="name" type="text" bind:value={name}/>
                    </div>            
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="name">
                        תיאור מקרה
                    </label>
                    <div class="md:w-2/3">
                        <textarea class="bg-sky-200 appearance-none border-2 border-sky-200 rounded w-full py-2 px-4 text-green-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500" id="case-description" bind:value={caseDescription}></textarea>
                    </div>            
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="'bmi'">
                        תיאור תפקוד מערכת העיכול:
                    </label>
                    <div class="md:w-2/3">
                        <textarea class="bg-sky-200 appearance-none border-2 border-sky-200 rounded w-full py-2 px-4 text-green-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500" id="case-description" bind:value={dygistiveSystemState}></textarea>
                    </div>            
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="'bmi'">
                        הערכה מתי יוכל לאכול רגיל
                    </label>
                    <div class="md:w-2/3">
                        <input type="date" class="bg-sky-200 appearance-none border-2 border-sky-200 rounded w-full py-2 px-4 text-green-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500" id="bmi" bind:value={personCanEatDate}/>
                    </div>            
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="height">
                        גובה במטרים
                    </label>
                    <div class="md:w-2/3">
                        <input inputMode="decimal" class="bg-sky-200 appearance-none border-2 border-sky-200 rounded w-full py-2 px-4 text-green-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500" id="height" bind:value={height}/>
                    </div>            
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="'weight'">
                        משקל ובקילוגרם
                    </label>
                    <div class="md:w-2/3">
                        <input inputMode="decimal" class="bg-sky-200 appearance-none border-2 border-sky-200 rounded w-full py-2 px-4 text-green-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500" id="weight" bind:value={weight}/>
                    </div>            
                </div>
                <div class="mb-4 space-y-2">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="bmi">מדד מסת הגוף BMI</label>
                    <div class="md:w-2/3">
                        <input disabled={!manualFillingState.value} inputMode="decimal" class="bg-sky-200 appearance-none border-2 border-sky-200 rounded w-full py-2 px-4 text-green-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500 disabled:bg-white disabled:border-none" id="bmi" bind:value={bmi}/>
                    </div>    
                    <div class={'flex items-center gap-3'}>
                        <input type="checkbox" name="menual-filling-bmi" id="menual-filling-bmi-input-checkbox" bind:checked={manualFillingState} />
                        <label for="menual-filling-bmi-input-checkbox">חישוב באופן ידני BMI</label>
                    </div>        
                </div>
            </div>
        </div>
        <div class={'bg-white shadow-xl shadow-sky-950/30 text-sky-900 p-3 rounded-lg'}>
            <h2 class={'text-4xl font-semibold text-sky-950 my-3'}>דרישות נוזלים וקלוריות</h2>
            <div class="mb-4 space-y-2">
                <h3 class={'text-xl font-semibold text-sky-950 my-3'}>נוזלים</h3>
                <span class="flex gap-4 text-gray-700 text-sm font-bold mb-2" ><label for="weight">משקל הגוף בקילוגרמים</label><MultilicationSvgComponent /><label for="assess-fluids-weight-factor">פאקטור נוזלים למשקל גוף ליום</label></span>
                <div class="md:w-2/3 flex gap-4 items-center">
                    <p class="appearance-none border-2 border-sky-200 rounded text-center w-20 py-2 px-4 text-green-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500 bg-white border-none">{weight.value === "" ? 0 : weight.value}</p>
                    <span><MultilicationSvgComponent /></span>
                    <input inputMode="decimal" class="bg-sky-200 appearance-none border-2 border-sky-200 rounded text-center w-32 py-2 px-4 text-green-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500 disabled:bg-white disabled:border-none" id="assess-fluids-weight-factor" bind:value={assessFluidsWeightFactor}/>
                    <span><EqualSvgComponent /></span>
                    <p class="appearance-none font-bold rounded w-full py-2 px-4 text-green-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500" id="assess-fluids-weight-factor">{results.value.fluids}</p>
                </div>   
            </div>
            <div class="mb-4 space-y-2">
                <h3 class={'text-xl font-semibold text-sky-950 my-3'}>קלוריות</h3>
                <span class="flex gap-4 text-gray-700 text-sm font-bold mb-2" >
                    <label for="weight">משקל הגוף בקילוגרמים</label><MultilicationSvgComponent />
                    <label for="assess-caloriesneeded-calorie-factor">פאקטור קלוריות לקילוגרם משקל גוף ליום</label>
                </span>
                <div class="md:w-2/3 flex gap-4 items-center">
                    <p class="appearance-none border-2 border-sky-200 rounded text-center w-20 py-2 px-4 text-green-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500 bg-white border-none">{weight.value === "" ? 0 : weight.value}</p>                   
                    <span><MultilicationSvgComponent /></span>
                    <input inputMode="decimal" class="bg-sky-200 appearance-none border-2 border-sky-200 rounded text-center w-32 py-2 px-4 text-green-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500 disabled:bg-white disabled:border-none" id="assess-caloriesneeded-calorie-factor" bind:value={assessCaloriesNeededCalorieFactor}/>
                    <span><EqualSvgComponent /></span>
                    <p class="appearance-none font-bold rounded w-full py-2 px-4 text-green-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500" id="assess-caloriesneeded-calorie-factor">{results.value.fluids}</p>
                </div>   
            </div>
        </div>
        <div class={'bg-white shadow-xl shadow-sky-950/30 text-sky-900 p-3 rounded-lg'}>
            <h2 class={'text-4xl font-semibold text-sky-950 my-3'}>דרישות חלבון ופחמימה</h2>
            <div class="mb-4 space-y-2">
                <h3 class={'text-xl font-semibold text-sky-950 my-3'}>חלבון</h3>
                <span class="flex gap-4 text-gray-700 text-sm font-bold mb-2" >
                    <label for="weight">משקל הגוף בקילוגרמים</label><MultilicationSvgComponent />
                    <label for="assess-proteinneeded-protein-factor">פאקטור חלבון גרם לקילוגרם משקל גוף ליום</label>
                </span>
                <div class="md:w-2/3 flex gap-4 items-center">
                    <p class="appearance-none border-2 border-sky-200 rounded text-center w-20 py-2 px-4 text-green-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500 bg-white border-none">{weight.value === "" ? 0 : weight.value}</p>      
                    <span><MultilicationSvgComponent /></span>
                    <input inputMode="decimal" class="bg-sky-200 appearance-none border-2 border-sky-200 rounded text-center w-32 py-2 px-4 text-green-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500 disabled:bg-white disabled:border-none" id="assess-proteinneeded-protein-factor" bind:value={proteinRequirements}/>
                    <span><EqualSvgComponent /></span>
                    <p class="appearance-none font-bold rounded w-full py-2 px-4 text-green-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500">{results.value.protein}</p>
                </div>   
            </div>
            <div class="mb-4 space-y-2">
                <h3 class={'text-xl font-semibold text-sky-950 my-3'}>פחמימה</h3>
                <span class="flex gap-4 text-gray-700 text-sm font-bold mb-2" >
                    <label for="weight">משקל הגוף בקילוגרמים</label><MultilicationSvgComponent />
                    <label for="mins-in-day" >דקות ביום</label><MultilicationSvgComponent />
                    <label for="carbohydrate-needed-factor">פאקטור פחמימה מיליגרם לקילוגרם משקל גוף <span class={'text-rose-800'}>לדקה</span>
                    </label>
                </span>
                <div class="md:w-2/3 flex gap-4 items-center">
                    <p class="appearance-none text-center border-2 border-sky-200 rounded w-20 py-2 px-4 text-green-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500 bg-white border-none">{weight.value === "" ? 0 : weight.value}</p>     
                    <span><MultilicationSvgComponent /></span>
                    <p class="appearance-none rounded text-center w-full py-2 px-4 text-green-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500">{minsInDay.value}</p>
                    <span><MultilicationSvgComponent /></span>
                    <input inputMode="decimal" class="bg-sky-200 appearance-none border-2 border-sky-200 rounded text-center w-32 py-2 px-4 text-green-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500 disabled:bg-white disabled:border-none" id="carbohydrate-needed-factor" bind:value={carbohydrateRequirements}/>
                    <span><EqualSvgComponent /></span>
                    <p class="appearance-none font-bold rounded w-full py-2 px-4 text-green-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500">{results.value.carbohydrate}</p>
                </div>
            </div>
        </div>
        <div class={'bg-white shadow-xl shadow-sky-950/30 text-sky-900 p-3 rounded-lg'}>
            <h2 class={'text-4xl font-semibold text-sky-950 my-3'}>דרישות קלוריות מחלבון ופחמימה</h2>
            <div class="mb-4 space-y-2">
                <h3 class={'text-xl font-semibold text-sky-950 my-3'}>חלבון קלוריות</h3>
                <span class="flex gap-4 text-gray-700 text-sm font-bold mb-2" ><label for="weight">כמות חלבון בגרם</label><MultilicationSvgComponent /><label for="carbohydrate-needed-factor">פאקטור חלבון גרם לקלוריות</label></span>
                <div class="md:w-2/3 flex gap-4 items-center">
                    <p class="appearance-none text-center border-2 border-sky-200 rounded w-20 py-2 px-4 text-green-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500 bg-white border-none">{weight.value === "" ? 0 : weight.value}</p>     
                    <span><MultilicationSvgComponent /></span>
                    <input inputMode="decimal" class="bg-sky-200 appearance-none border-2 border-sky-200 rounded text-center w-32 py-2 px-4 text-green-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500 disabled:bg-white disabled:border-none" id="carbohydrate-needed-factor" bind:value={proteinCaloriesFactor}/>
                    <span><EqualSvgComponent /></span>
                    <p class="appearance-none font-bold rounded w-full py-2 px-4 text-green-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500" >{results.value.carbohydrate}</p>
                </div>
            </div>
            <div class="mb-4 space-y-2">
                <h3 class={'text-xl font-semibold text-sky-950 my-3'}>פחמימה קלוריות</h3>
                <span class="flex gap-4 text-gray-700 text-sm font-bold mb-2" ><label for="weight">כמות פחמימה בגרם</label><MultilicationSvgComponent /><label for="carbohydrate-needed-factor">פאקטור פחמימה גרם לקלוריות</label></span>
                <div class="md:w-2/3 flex gap-4 items-center">
                    <p class="appearance-none text-center border-2 border-sky-200 rounded w-20 py-2 px-4 text-green-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500 bg-white border-none">{weight.value === "" ? 0 : weight.value}</p>     
                    <span><MultilicationSvgComponent /></span>
                    <input inputMode="decimal" class="bg-sky-200 appearance-none border-2 border-sky-200 rounded text-center w-32 py-2 px-4 text-green-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500 disabled:bg-white disabled:border-none" id="carbohydrate-needed-factor" bind:value={carbohydrateCaloriesFactor}/>
                    <span><EqualSvgComponent /></span>
                    <p class="appearance-none font-bold rounded w-full py-2 px-4 text-green-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500" >{results.value.carbohydrate}</p>
                </div>   
            </div>
        </div>
        <div class={'bg-white shadow-xl shadow-sky-950/30 text-sky-900 p-3 rounded-lg'}>
            <h2 class={'text-4xl font-semibold text-sky-950 my-3'}>דרישת שומן</h2>
            <div class="mb-4 space-y-2">
                <h3 class={'text-xl font-semibold text-sky-950 my-3'}>פחמימה קלוריות</h3>
                <span class="flex gap-4 text-gray-700 text-sm font-bold mb-2" >
                    <label for="weight">פחמימה קלוריות</label>
                    <span><PlusSvgComponent /></span>
                    <label for="carbohydrate-needed-factor">חלבון קלוריות</label>
                    <span><MinusSvgComponent /></span>
                    <label for="carbohydrate-needed-factor">סך קלוריות</label>
                    <span><EqualSvgComponent /></span>
                    <label for="carbohydrate-needed-factor">שומן בקלוריות</label>
                </span>
                <div class="md:w-2/3 flex gap-4 items-center">
                    <p class="appearance-none text-center border-2 border-sky-200 rounded w-20 py-2 px-4 text-green-700 leading-tight bg-white border-none">{results.value.calorieFromProtein}</p>     
                    <span><PlusSvgComponent /></span>
                    <p class="appearance-none text-center border-2 border-sky-200 rounded w-20 py-2 px-4 text-green-700 leading-tight bg-white border-none">{results.value.calorieFromCarbohydrate}</p>     
                    <span><MinusSvgComponent /></span>
                    <p class="appearance-none text-center border-2 border-sky-200 rounded w-20 py-2 px-4 text-green-700 leading-tight bg-white border-none" >{results.value.calories}</p>
                    <span><EqualSvgComponent /></span>
                    <p class="appearance-none text-center border-2 border-sky-200 rounded w-20 py-2 px-4 text-green-700 leading-tight bg-white border-none font-bold" >{results.value.calorieFromFat}</p>

                </div>   
            </div>
        </div>
        <div class={'bg-white shadow-xl shadow-sky-950/30 text-sky-900 p-3 rounded-lg'}>
            <div class={'min-w-[400px]'}>
                <h2 class={'text-4xl font-semibold text-sky-950 my-3'}>בחירת ריכוז אמולסיה/תמיסה</h2>
                <p>משהו לכתוב</p>
                <input type="text" />
                <p>משהו כתוב</p>
            </div>
        </div>
        <div class={'bg-white shadow-xl shadow-sky-950/30 text-sky-900 p-3 rounded-lg'}>
            <div class={'min-w-[400px]'}>
                <h2 class={'text-4xl font-semibold text-sky-950 my-3'}>נפח מאקרונוטרינטים</h2>
                <p>משהו לכתוב</p>
                <input type="text" />
                <p>משהו כתוב</p>
            </div>
        </div>
        <div class={'bg-white shadow-xl shadow-sky-950/30 text-sky-900 p-3 rounded-lg'}>
            <div class={'min-w-[400px]'}>
                <h2 class={'text-4xl font-semibold text-sky-950 my-3'}>דרישות נוזלים ואנרגיה</h2>
                <p>משהו לכתוב</p>
                <input type="text" />
                <p>משהו כתוב</p>
            </div>
        </div>
        <div class={'bg-white shadow-xl shadow-sky-950/30 text-sky-900 p-3 rounded-lg'}>
            <div class={'min-w-[400px]'}>
                <h2 class={'text-4xl font-semibold text-sky-950 my-3'}>מרשם</h2>
                <p>משהו לכתוב</p>
                <input type="text" />
                <p>משהו כתוב</p>
            </div>
        </div>
    </div>
});

export const MultilicationSvgComponent = component$(() => {
    return <svg xmlns="http://www.w3.org/2000/svg" class={'w-3 h-3 fill-sky-800'} viewBox="0 0 256 256"><path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path></svg>
});

export const EqualSvgComponent = component$(() => {
    return <svg xmlns="http://www.w3.org/2000/svg" class={'w-3 h-3 fill-sky-800'} viewBox="0 0 256 256"><path d="M224,160a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,160ZM40,104H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16Z"></path></svg>
});

export const MinusSvgComponent = component$(() => {
    return <svg xmlns="http://www.w3.org/2000/svg" class={'w-3 h-3 fill-sky-800'} viewBox="0 0 256 256"><path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128Z"></path></svg>
});

export const PlusSvgComponent = component$(() => {
    return <svg xmlns="http://www.w3.org/2000/svg" class={'w-3 h-3 fill-sky-800'} viewBox="0 0 256 256"><path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"></path></svg>
});