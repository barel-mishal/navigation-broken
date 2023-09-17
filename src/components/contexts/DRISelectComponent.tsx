import { component$, useContext, useComputed$, useVisibleTask$, type QwikChangeEvent, createContextId } from "@builder.io/qwik";
import { type DRISchemaType, ageRangesList, ageRangesListHebrew, nutrientsEnglishNames, hebrewNutrientsNames } from "~/utiles/fitnessCalculators/DRISchema";
import { FitnessContext } from "./useFitnessContext";

export type keyofDRISchemaType = keyof DRISchemaType;

export default component$(() => {
  const fitness = useContext(FitnessContext);
  const dri = useContext(contextDRI);
  const computeSelectedDriValue = useComputed$(
    (): keyofDRISchemaType | undefined => {
      const { age, gender, selectedDriValue } = fitness.store ?? {};

      if (selectedDriValue) {
        return selectedDriValue;
      }
  
      if (age !== undefined) {
        const ageGenderRanges: { [key: string]: [number, number, string][] } = {
          female: [
            [31, 50, 'Females 31-50 years'],
            [14, 18, 'Females 14-18 years'],
            [19, 30, 'Females 19-30 years'],
            [51, 70, 'Females 51-70 years'],
            [9, 13, 'Females 9-13 years'],
            [70, Infinity, 'Females >70 years'],
          ],
          male: [
            [14, 18, 'Males 14-18 years'],
            [19, 30, 'Males 19-30 years'],
            [31, 50, 'Males 31-50 years'],
            [51, 70, 'Males 51-70 years'],
            [70, Infinity, 'Males >70 years'],
          ],
          children: [
            [0, 7, 'Children 1-3 years' as keyofDRISchemaType],
            [6, 13, 'Children 4-8 years' as keyofDRISchemaType],
          ],
          infant: [
            [0, 6 / 12, 'Infants 0-6 months'],
            [7 / 12, 12 / 12, 'Infants 7-12 months'],
          ],
        };
  
        const groups = gender ? [gender, 'infant'] : ['infant'];
  
        for (const group of groups) {
          if (ageGenderRanges[group]) {
            for (const [min, max, value] of ageGenderRanges[group]) {
              if (min <= age && age < max) {
                return value as keyofDRISchemaType;
              }
            }
          }
        }
      }
  
      return undefined;
    }
  );
  useVisibleTask$(async () => {
    if (fitness.store.selectedDriValue === undefined) {
      fitness.store.selectedDriValue = "Infants 0-6 months";
    }
  });
  
  return <div class={'px-4'}>    
    <div class={'mx-auto max-w-screen-xl flex flex-col gap-4 mt-4'}>
      <select class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6" onChange$={(event: QwikChangeEvent<HTMLSelectElement>, element: HTMLSelectElement) => {
      fitness.store.selectedDriValue = element.value as keyofDRISchemaType;
    }} name="dri-select-input" id="dri-select-input">
      {ageRangesList.map((ageRange, index) => {
        return <option selected={computeSelectedDriValue.value === ageRange} value={ageRange} key={index}>{ageRangesListHebrew[index]}</option>
      })}
    </select>
    {computeSelectedDriValue.value && <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
      <h2 class={'font-bold text-2xl text-sky-950 tracking-wider'}>ערכי יחוס של צריכה תזונתית - DRI</h2>
            <table class="w-full text-sm text-left text-sky-500 ">
              <thead class="text-xs text-sky-700 uppercase bg-sky-50">
                <tr>
                  <th class="px-6 py-3">Nutrient</th>
                  <th class="px-6 py-3">Value</th>
                  <th class="px-6 py-3">Unit</th>
                  <th class="px-6 py-3">Comment</th>
                </tr>
              </thead>
              <tbody>
        {nutrientsEnglishNames.map((nutri, index) => (
                  <tr key={nutri} class="bg-white border-b ">
                    <th class="px-6 py-4 font-medium text-sky-900 whitespace-nowrap">{hebrewNutrientsNames[index]}</th>
                    <td class="px-6 py-4">{dri[computeSelectedDriValue.value!]![nutri].value}</td>
                    <td class="px-6 py-4">{dri[computeSelectedDriValue.value!]![nutri].unit}</td>
                    <td class="px-6 py-4">{dri[computeSelectedDriValue.value!]![nutri].comment}</td>
                  </tr>
        ))}
              </tbody>
            </table>
      </div>}
    </div> 
  </div>
});


export const contextDRI = createContextId<DRISchemaType>('DRISchemaType');


