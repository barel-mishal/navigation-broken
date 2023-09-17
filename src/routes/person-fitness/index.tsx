import { $, type QwikFocusEvent, component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import DateInputs, { useDateInputs } from "~/components/dateinputs/DateInputs";
import { type ActivityLevel } from "~/utiles/types_rust_bindings_fitness/ActivityLevel";
import { type DRI } from "~/utiles/types_rust_bindings/DRI";
import { type Gender } from "~/utiles/types_rust_bindings_fitness/Gender";
import { type Goal } from "~/utiles/types_rust_bindings_fitness/Goal";
import { type UserPhysicalMetrics } from "~/utiles/types_rust_bindings_fitness/UserPhysicalMetrics";

interface UserPhysicalMetricsUse extends UserPhysicalMetrics {
  age: string;
  gender: Gender;
}

export const useFitnessData = () => {
  const fitnessData = useSignal<Partial<UserPhysicalMetricsUse>>();
  const dateInputs = useDateInputs();
  const genderSignal = useSignal<Gender>('None');
  const activityLevelSignal = useSignal<ActivityLevel>('None');
  const DRIsSignal = useSignal<DRI>('None');
  const heightSignal = useSignal<string>();
  const weightSignal = useSignal<string>();
  const neckCircumferenceSignal = useSignal<string>();
  const waistCircumferenceSignal = useSignal<string>();
  const hipCircumferenceSignal = useSignal<string>();
  const goalOptionSignal = useSignal<Goal>('None');
  const ACTIVITY_LEVELS: readonly ActivityLevel[] = ["Sedentary" , "LightlyActive" , "ModeratelyActive" , "VeryActive" , "ExtraActive", "None"];
  const GOALS_OPTIONS: readonly Goal[] = ["LoseWeight" , "MaintainWeight" , "GainWeight", "None"];
  const DRIs: readonly DRI[] = [
    "Infants0_6Months",
    "Infants7_12Months",
    "Children1_3Years",
    "Children4_8Years",
    "Males9_13Years",
    "Males14_18Years",
    "Males19_30Years",
    "Males31_50Years",
    "Males51_70Years",
    "MalesAbove70Years",
    "Females9_13Years",
    "Females14_18Years",
    "Females19_30Years",
    "Females31_50Years",
    "Females51_70Years",
    "FemalesAbove70Years",
    "PregnancyUnder18Years",
    "Pregnancy19_30Years",
    "Pregnancy31_50Years",
    "LactationUnder18Years",
    "Lactation19_30Years",
    "Lactation31_50Years",
    "None",
  ];

  return {
    fitnessData,
    genderSignal,
    DRIsSignal,
    activityLevelSignal,
    dateInputs,
    ACTIVITY_LEVELS,
    DRIs,
    heightSignal,
    weightSignal,
    GOALS_OPTIONS,
    neckCircumferenceSignal,
    waistCircumferenceSignal,
    hipCircumferenceSignal,
    goalOptionSignal,
  }
}


export default component$(() => {
    const fd = useFitnessData();
    const onFocus = $((event: QwikFocusEvent<HTMLInputElement>, element: HTMLInputElement) => element.select());

    useVisibleTask$(({track}) => {
      const data = track(() => fd.fitnessData.value);
      if (!data) return;
      localStorage.setItem('fitnessData', JSON.stringify(data));
    });
    useVisibleTask$(() => {
      const data = localStorage.getItem('fitnessData');
      if (!data) return;
      fd.fitnessData.value = JSON.parse(data);
      if (!fd.fitnessData.value) return ;
      fd.genderSignal.value = fd.fitnessData.value?.gender || "None";
      fd.activityLevelSignal.value = (fd.fitnessData.value?.activity_level || "None") as ActivityLevel;
      fd.DRIsSignal.value = (fd.fitnessData.value?.dri || "None") as DRI;
      fd.heightSignal.value = fd.fitnessData.value?.height?.toString();
      fd.weightSignal.value = fd.fitnessData.value?.weight?.toString();
      fd.neckCircumferenceSignal.value = fd.fitnessData.value?.neck_circumference?.toString();
      fd.waistCircumferenceSignal.value = fd.fitnessData.value?.waist_circumference?.toString();
      fd.hipCircumferenceSignal.value = fd.fitnessData.value?.hip_circumference?.toString();
      fd.goalOptionSignal.value = (fd.fitnessData.value?.goal || "None") as Goal;
      fd.dateInputs.signalDay.value = new Date(fd.fitnessData.value?.age || new Date().toUTCString()).getDate().toString();
      fd.dateInputs.signalMonth.value = new Date(fd.fitnessData.value?.age || new Date().toUTCString()).getMonth().toString();
      fd.dateInputs.signalYear.value = new Date(fd.fitnessData.value?.age || new Date().toUTCString()).getFullYear().toString();
    });
    const onClickSave = $(async () => {    
      const fitness: Omit<UserPhysicalMetricsUse, "user_id"> = {
        activity_level: fd.activityLevelSignal.value,
        gender: fd.genderSignal.value as Gender,
        dri: fd.DRIsSignal.value,
        height: Number(fd.heightSignal.value),
        weight: Number(fd.weightSignal.value), 
        neck_circumference: parseFloat(fd.neckCircumferenceSignal.value || ""),
        waist_circumference: parseFloat(fd.waistCircumferenceSignal.value || ""),
        hip_circumference: parseFloat(fd.hipCircumferenceSignal.value || ""),
        created_at: fd.fitnessData.value?.created_at|| new Date().toUTCString(),
        goal: fd.goalOptionSignal.value,
        updated_at: new Date().toUTCString(),
        age: Array.isArray(fd.dateInputs.computeDate) ? "" : fd.dateInputs.computeDate.toUTCString(),
      }
      fd.fitnessData.value = fitness;
    }); 
    // TODO:when there is valid data, show the result and change color to green
    // TODO:when there is invalid data, show the result and change color to red
    // TODO:when there is no data, show the result and change color to gray
    // TODO:when user click on save, and there is no data, show the result and change color to red
    // TODO:when the user click on save and all data is valid then show the result of that person
    return <div class={'mt-10 prose bg-white mx-auto p-3 rounded-md'}>
        <form>
  <div class="space-y-12">
    <div class="border-b border-gray-900/10 pb-12">
      <h2 class="text-base font-semibold leading-7 text-gray-900">נתונים אישיים שלך:</h2>
      <p class="mt-1 text-sm leading-6 text-gray-600">כדי שנוכל לתת מידע מותאם אישית לך. אנו צריכים לדעת פרטים עליך, ככל שנדע יותר כך ההתאמה תהיה יותר מדוייקת עבורך.</p>
      <p class="mt-1 text-sm leading-6 text-gray-600">ככל שהזמן יעבור תוכל/י לעדכן את הנתונים כדי שהתוצאות שלנו ימשכו להתאים לך. למשל משקל שלנו משתנה אם הזמן אז תוכלו לעדכן באופן שבועי את המשקל כדי לוודא שיש מעקב והתקדמות אחר התוצאות שלכם</p>

      <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
       

        <DateInputs {...fd.dateInputs} />


      </div>
    </div>

    <div class="border-b border-gray-900/10 pb-12">
      <h2 class="text-base font-semibold leading-7 text-gray-900">מידע אנטרופומטרי</h2>
      <p class="mt-1 text-sm leading-6 text-gray-600">ניתן לעדכן את נתונים אלו ולשמור את הנתונים בהיסטוריה</p>

      <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

        <div class="sm:col-span-4">
            <label for="gender" class="block text-sm font-medium leading-6 text-gray-900">מין</label>
            <div class="mt-2">
                <select bind:value={fd.genderSignal} id="gender" name="gender" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6">
                <option selected={fd.genderSignal.value === "None"} value={"None"}>בחירה</option>
                <option selected={fd.genderSignal.value === 'Female'} value={"Female"}>נקבה</option>
                <option selected={fd.genderSignal.value === 'Male'} value={"Male"}>זכר</option>
                </select>
            </div>
        </div>
        
        <div class="sm:col-span-4">
          <label for="height" class="block text-sm font-medium leading-6 text-gray-900">גובה בס"מ</label>
          <div class="mt-2">
            <input bind:value={fd.heightSignal} onFocus$={onFocus} type="text" name="height" id="height" autoComplete="off" class="pr-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
          </div>
        </div>

        <div class="sm:col-span-4">
            <label for="weightKg" class="block text-sm font-medium leading-6 text-gray-900">משקל בק"ג</label>
            <div class="mt-2">
                <input bind:value={fd.weightSignal} onFocus$={onFocus} type="text" name="weightKg" id="weightKg" autoComplete="off" class="pr-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
            </div>
        </div>

        <div class="sm:col-span-4">
            <label for="neckCircumference" class="block text-sm font-medium leading-6 text-gray-900">היקף צוואר ס"מ</label>
            <div class="mt-2">
                <input bind:value={fd.neckCircumferenceSignal} onFocus$={onFocus} id="neckCircumference" name="neckCircumference" type="text" autoComplete="off" class="pr-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
            </div>
        </div>

        
        <div class="sm:col-span-4">
            <label for="waistCircumference" class="block text-sm font-medium leading-6 text-gray-900">היקף מותן ס"מ</label>
            <div class="mt-2">
                <input bind:value={fd.waistCircumferenceSignal} onFocus$={onFocus} id="waistCircumference" name="waistCircumference" type="text" autoComplete="off" class="pr-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
            </div>
        </div>
        
        {fd.genderSignal.value === 'Female' && <div class="sm:col-span-4">
            <label for="hipCircumference" class="block text-sm font-medium leading-6 text-gray-900">היקף אגן ס"מ</label>
            <div class="mt-2">
                <input bind:value={fd.hipCircumferenceSignal} onFocus$={onFocus} id="hipCircumference" name="hipCircumference" type="text" autoComplete="off" class="pr-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
            </div>
        </div>}


        <div class="sm:col-span-4">
            <label for="gender" class="block text-sm font-medium leading-6 text-gray-900">מטרה בקצרה</label>
            <div class="mt-2">
                <select bind:value={fd.goalOptionSignal} id="gender" name="gender" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6">
                <option selected={fd.goalOptionSignal.value === "None"} value={"None"}>בחירה</option>
                <option selected={fd.goalOptionSignal.value === 'LoseWeight'} value={fd.GOALS_OPTIONS[0]}>ירידה במשקל</option>
                <option selected={fd.goalOptionSignal.value === 'MaintainWeight'} value={fd.GOALS_OPTIONS[1]}>שמירה על המשקל</option>
                <option selected={fd.goalOptionSignal.value === 'GainWeight'} value={fd.GOALS_OPTIONS[2]}>עליה במשקל</option>
                </select>
            </div>
        </div>

        <div class="sm:col-span-4">
            <label id="dri" for="dri" class="block text-sm font-medium leading-6 text-gray-900">DRI</label>
            <div class="mt-2">
                <select bind:value={fd.DRIsSignal} name="dri" id="dri" aria-labelledby="dri" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6">
                      <option selected={fd.DRIsSignal.value === "None"} value="None">בחירה</option>
                      <option selected={fd.DRIsSignal.value === fd.DRIs[0]} value="Infants0_6Months">תינוקות 0-6 חודשים</option>
                      <option selected={fd.DRIsSignal.value === fd.DRIs[1]} value="Infants7_12Months">תינוקות 7-12 חודשים</option>
                      <option selected={fd.DRIsSignal.value === fd.DRIs[2]} value="Children1_3Years">ילדים 1-3 שנים</option>
                      <option selected={fd.DRIsSignal.value === fd.DRIs[3]} value="Children4_8Years">ילדים 4-8 שנים</option>
                      <option selected={fd.DRIsSignal.value === fd.DRIs[4]} value="Males9_13Years">גברים 9-13 שנים</option>
                      <option selected={fd.DRIsSignal.value === fd.DRIs[5]} value="Males14_18Years">גברים 14-18 שנים</option>
                      <option selected={fd.DRIsSignal.value === fd.DRIs[6]} value="Males19_30Years">גברים 19-30 שנה</option>
                      <option selected={fd.DRIsSignal.value === fd.DRIs[7]} value="Males31_50Years">גברים 31-50 שנה</option>
                      <option selected={fd.DRIsSignal.value === fd.DRIs[8]} value="Males51_70Years">גברים 51-70 שנים</option>
                      <option selected={fd.DRIsSignal.value === fd.DRIs[9]} value="MalesAbove70Years">גברים &gt;70 שנה</option>
                      <option selected={fd.DRIsSignal.value === fd.DRIs[10]} value="Females9_13Years">נשים  9-13 שנים</option>
                      <option selected={fd.DRIsSignal.value === fd.DRIs[11]} value="Females14_18Years">נשים  14-18 שנים</option>
                      <option selected={fd.DRIsSignal.value === fd.DRIs[12]} value="Females19_30Years">נשים  19-30 שנה</option>
                      <option selected={fd.DRIsSignal.value === fd.DRIs[13]} value="Females31_50Years">נשים  31-50 שנה</option>
                      <option selected={fd.DRIsSignal.value === fd.DRIs[14]} value="Females51_70Years">נשים  51-70 שנים</option>
                      <option selected={fd.DRIsSignal.value === fd.DRIs[15]} value="FemalesAbove70Years">נשים  &gt;70 שנה</option>
                      <option selected={fd.DRIsSignal.value === fd.DRIs[16]} value="PregnancyUnder18Years">הריון &lt;18 שנה</option>
                      <option selected={fd.DRIsSignal.value === fd.DRIs[17]} value="Pregnancy19_30Years">הריון 19-30 שנה</option>
                      <option selected={fd.DRIsSignal.value === fd.DRIs[18]} value="Pregnancy31_50Years">הריון 31-50 שנה</option>
                      <option selected={fd.DRIsSignal.value === fd.DRIs[19]} value="LactationUnder18Years">הנקה &lt;18 שנה</option>
                      <option selected={fd.DRIsSignal.value === fd.DRIs[20]} value="Lactation19_30Years">הנקה 19-30 שנה</option>
                      <option selected={fd.DRIsSignal.value === fd.DRIs[21]} value="Lactation31_50Years">הנקה 31-50 שנה</option>
                </select>
            </div>
        </div>

        <div class="sm:col-span-4">
            <label id="activityLevel" for="activityLevel" class="block text-sm font-medium leading-6 text-gray-900">רמת פעילות</label>
            <div class="mt-2">
              <select bind:value={fd.activityLevelSignal} name="activityLevel" id="activityLevel" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6">
                <option selected={fd.activityLevelSignal.value === undefined}>בחירה</option>
                <option selected={fd.activityLevelSignal.value === fd.ACTIVITY_LEVELS[0]}  value={fd.ACTIVITY_LEVELS[0]}>לא פעיל (כמעט או בלי פעילות גופנית)</option>
                <option selected={fd.activityLevelSignal.value === fd.ACTIVITY_LEVELS[1]}  value={fd.ACTIVITY_LEVELS[1]}>פעיל באופן קל (ספורט 1-3 ימים בשבוע)</option>
                <option selected={fd.activityLevelSignal.value === fd.ACTIVITY_LEVELS[2]}  value={fd.ACTIVITY_LEVELS[2]}>פעילות באופן בינונית (ספורט 3-5 ימים בשבוע)</option>
                <option selected={fd.activityLevelSignal.value === fd.ACTIVITY_LEVELS[3]}  value={fd.ACTIVITY_LEVELS[3]}>פעיל מאוד (כושר קשה או ספורט 6-7 ימים בשבוע)</option>
                <option selected={fd.activityLevelSignal.value === fd.ACTIVITY_LEVELS[4]}  value={fd.ACTIVITY_LEVELS[4]}>פעיל מאוד (ספורט 6-7 ימים בשבוע)</option>
              </select>
            </div>
        </div>
        </div>

    </div>
    <div class="border-b border-gray-900/10 pb-12">
        <h2 class="text-base font-semibold leading-7 text-gray-900">מעולה רק נותר לשמור נתונים</h2>

        <div class="sm:col-span-4">
            <div class="mt-2">
                <button onClick$={onClickSave} type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">שמור</button>
            </div>
        </div>
    </div>
</div>
        </form>
    </div>
});





export const Profile = component$(() => {
  const nameSignal = useSignal<string>();
  const goalSignal = useSignal<string>();
  const onFocus = $((event: QwikFocusEvent<HTMLInputElement>, element: HTMLInputElement) => element.select());
  return <div>
            <div class="col-span-full">

            <div class="sm:col-span-4">
            <label for="username" class="block text-sm font-medium leading-6 text-gray-900">שם שלך</label>
            <div class="mt-2">
                <input type="text" bind:value={nameSignal} onFocus$={onFocus} name="username" id="username" autoComplete={"name"} class="pr-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
            </div>
        </div>
        <div class="col-span-full">
          <label for="about" class="block text-sm font-medium leading-6 text-gray-900">קצרה יעדים ומטרות בתחום הבריאות והפיטנס:</label>
          <div class="mt-2">
            <textarea bind:value={goalSignal} id="about" name="about" rows={3} class="pr-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"></textarea>
          </div>
          <p class="mt-3 text-sm leading-6 text-gray-600">קצת לכתוב על המטרות והיעדים כולל גם הלמה שלך להצליח בתחום הזה</p>
        </div>
          <label for="photo" class="block text-sm font-medium leading-6 text-gray-900">תמונה</label>
          <div class="mt-2 flex items-center gap-x-3">
            <svg class="h-12 w-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clip-rule="evenodd" />
            </svg>
            <button disabled type="button" class="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">שנה</button>
          </div>
        </div>

        <div class="col-span-full">
          <label for="cover-photo" class="block text-sm font-medium leading-6 text-gray-900">תמונת נושא</label>
          <div class="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
            <div class="text-center">
              <svg class="mx-auto h-12 w-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clip-rule="evenodd" />
              </svg>
              <div class="mt-4 flex flex-col text-sm leading-6 text-gray-600">
                <label for="file-upload" class="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
                  <span>העלת קובץ</span>
                  <input id="file-upload" name="file-upload" type="file" class="sr-only"/>
                </label>
                <p class="pl-1">או גרור וזרוק</p>
              </div>
              <p class="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 2MB</p>
            </div>
          </div>
        </div>
  </div>
})






















