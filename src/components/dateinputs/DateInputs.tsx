import { useSignal, useComputed$, component$, QwikFocusEvent, $ } from "@builder.io/qwik";
import { z } from "zod";

export const validInputForDate = z.string().regex(/^[0-9]+$/, 'הזן רק מספרים').or(z.string().max(0));

export const validDateSchema = z.object({
    day: z.number().min(1, 'היום לא יכול להיות קטן מאחד').max(31, 'אין יום מעל ל31'),
    month: z.number().min(1, 'החודש לא יכול להיות קטן מאחד').max(12, 'אין חודש מעל ל12'),
    year: z.number().min(1900, 'השנה לא יכולה להיות קטנה מ1900').max(2023, 'השנה לא יכולה להיות גדולה מ2023'),
}).transform((data) => {
    return new Date(data.year, data.month - 1, data.day);
});

export const useDateInputs = () => {
    const signalDayRef = useSignal<HTMLInputElement>();
    const signalMonthRef = useSignal<HTMLInputElement>();
    const signalYearRef = useSignal<HTMLInputElement>();
    const signalDay = useSignal("");
    const signalMonth = useSignal("");
    const signalYear = useSignal("");
    const computeDate = useComputed$<Date | {message: string}[]>(() => {
        const day = validInputForDate.safeParse(signalDay.value);
        const month = validInputForDate.safeParse(signalMonth.value);
        const year = validInputForDate.safeParse(signalYear.value);
        if (day.success === false || month.success === false || year.success === false) {
            return [{message: 'הזן תאריך'}]
        }
        if ([day.data, month.data, year.data].includes('')) return [{message: 'הזן תאריך'}]
        const birthdate = validDateSchema.safeParse({
            day: Number(day.data),
            month: Number(month.data),
            year: Number(year.data),
        });
        const data = birthdate.success ? birthdate.data : birthdate.error.errors.map((error) => {
            return { message: error.message };
        }); 
        return data
    });    
    return {
        signalDayRef,
        signalMonthRef,
        signalYearRef,
        signalDay,
        signalMonth,
        signalYear,
        computeDate: computeDate.value
    }
};

export type DateInputsType = ReturnType<typeof useDateInputs>;

export default component$((props: DateInputsType) => {
    const onFocus = $((event: QwikFocusEvent<HTMLInputElement>, element: HTMLInputElement) => element.select());


    return <div class="sm:col-span-4">
    <label for="birthdate" class="block text-sm font-medium leading-6 text-gray-900">תאריך לידה</label>
    <div class="mt-2">
        <fieldset id="birthdate" class="flex justify-content-between gap-3">
            <div>
                <label for="year" class="mr-2">שנה</label>
                <input onFocus$={onFocus} ref={props.signalDayRef} bind:value={props.signalYear} type="text" id="year" name="year" class="pr-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
            </div>
            <div>
                <label for="month" class="mr-2">חודש</label>
                <input onFocus$={onFocus} ref={props.signalMonthRef} bind:value={props.signalMonth} type="text" id="month" name="month" class="pr-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
            </div>
            <div>
                <label for="day" class="mr-2">יום</label>
                <input onFocus$={onFocus} ref={props.signalYearRef} bind:value={props.signalDay} type="text" id="day" name="day" class="pr-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
            </div>
        </fieldset>
        <div class="text-red-500 text-sm">
                {Array.isArray(props.computeDate) && props.computeDate.map((error, index) => {
                    return <p key={`error-date-${index}`}>{error.message}</p>
                })}
        </div>
    </div>
</div>
});