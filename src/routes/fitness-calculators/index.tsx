import { component$, useContextProvider, useOnDocument } from "@builder.io/qwik";
import {
  useFitness,
  FitnessContext,
} from "~/components/contexts/useFitnessContext";
import { Link } from "@builder.io/qwik-city";

export default component$(() => {
  const fitness = useFitness();
  useContextProvider(FitnessContext, fitness);
  useOnDocument('load', fitness.getFitnessFromLocalStorage);

  return (
    <>
      <div
        class={[
          "mt-10 space-y-10 px-4 xl:max-w-5xl xl:mx-auto xl:px-0",
          { "": true },
        ]}
      >
        <h1 class={["text-6xl font-bold", "text-sky-950", "flex-row", 
        '']}>
          חישובים התזונתיים
        </h1>
        <div class={'grid grid-cols-[repeat(auto-fill,minmax(min(300px,100%),1fr))] mx-auto gap-10'}>
          <Link 
            href="/fitness-calculators/resting-and-basal-metabolic-rate/" 
            class={'bg-white rounded-md shadow-xl shadow-sky-900/30 p-3 min-h-[300px] space-y-4 flex flex-col justify-between'}>
            <div class={''}>
              <h2 class={'[text-wrap:balance] text-3xl font-semibold my-2 text-sky-700'}>חישוב קלוריות למצב מנוחה ובסיסי (RMR/BMR)</h2>
              <p class={'text-xl [text-wrap:balance] text-sky-950'}>
                החישוב מספק מידע על הכמות המינימלית של קלוריות שגופך צריך במצב מנוחה (RMR - Resting Metabolic Rate) ובמצב בסיסי (BMR - Basal Metabolic Rate). 
                המידע יכול לעזור לך לחשב את הצרכים היומיומיים שלך.
              </p>
            </div>
            <div class={'grid justify-end'}>
              <svg xmlns="http://www.w3.org/2000/svg" class={'w-8 h-8 fill-rose-600'} viewBox="0 0 256 256"><path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></path></svg>
            </div>
          </Link>
          <Link 
            href="/fitness-calculators/dietary-reference-intakes" 
            class={'bg-white rounded-md shadow-xl shadow-sky-900/30 p-3 min-h-[250px] space-y-4 flex flex-col justify-between'}>
            <div class={''}>
              <h2 class={'[text-wrap:balance] text-3xl font-semibold my-2 text-sky-700'}>חישוב רפרנס תזונתי <span>Dietary Reference Intakes (DRI)</span></h2>
              <p class={'text-xl [text-wrap:balance] text-sky-950'}>חישוב זה מתבצע כאשר אנו רוצים לדעת את הכמויות המומלצות של ויטמינים ומינרלים כדי לתחזק בריאות טובה ולמנוע מחסורים.</p>
            </div>
            <div class={'grid justify-end'}>
              <svg xmlns="http://www.w3.org/2000/svg" class={'w-8 h-8 fill-rose-600'} viewBox="0 0 256 256"><path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></path></svg>
            </div>
          </Link>
          <Link 
            href="/fitness-calculators/parenteral-nutrition" 
            class={'bg-white rounded-md shadow-xl shadow-sky-900/30 p-3 min-h-[250px] space-y-4 flex flex-col justify-between'}>
            <div class={''}>
              <h2 class={'[text-wrap:balance] text-3xl font-semibold my-2 text-sky-700'}>חישוב הזנה תוך ורידי <span>Parenteral Nutrition Calculations (PN)</span></h2>
              <p class={'text-xl [text-wrap:balance] text-sky-950'}>חישוב זה מתבצע כאשר האדם אינו מקבל תזונה מספקת עקב אי-סבילות מכל סיבה שהיא. כלומר האדם אינו יכול לעכל ולקבל את צרכיו התזונתיים בין אם זה בגלל פציעה, מחלה במערכת העיכול, וכו'. </p>
            </div>
            <div class={'grid justify-end'}>
              <svg xmlns="http://www.w3.org/2000/svg" class={'w-8 h-8 fill-rose-600 '} viewBox="0 0 256 256"><path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></path></svg>
            </div>
          </Link>
          <div class={'bg-white rounded-md shadow-xl shadow-sky-900/30 p-3 min-h-[200px]'}>google</div>
          <div class={'bg-white rounded-md shadow-xl shadow-sky-900/30 p-3 min-h-[200px]'}>google</div>
        </div>
        
        <div class={[""]}>
          <div class="bg-white rounded-lg p-4">

          </div>

        </div>
      </div>
    </>
  );
});

