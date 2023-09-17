import {  $, component$, useOnWindow, useSignal } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";

// TODO: add title in fitnesstrack
// TODO: BACK to fitnesstrack from next step
// TODO: להחליט עלמאמרים לחישובי קלוריות TDEE
// TODO: להוסיף תקציר וכותרת לכל מאמר
// TODO: לעשות מאמר אחד
// TODO: להכניס את המידע של משרד הבריאות ולעשות ניתוח לנתונים שלו בשביל לעשות מנתח מתכונים
// TODO:  להבין איך לעשות קישור פרטי רק למנויים
export type PartialWithRequiredKeys<T, K extends keyof T> = Partial<T> & Required<Pick<T, K>>;

export const useMenuToggle = () => {
  const menu = useSignal(false);
  const navRef = useSignal<HTMLDivElement | undefined>();
  useOnWindow('click', $((event: Event) => {
    if (navRef.value && !navRef.value.contains(event.target as Node)) {
      menu.value = false
    }
  }))
  return {
    menu,
    navRef
  }
}

export default component$((props: {userName: undefined | string | null}) => {
  const { menu, navRef } = useMenuToggle();
  const userText = props.userName ? {
    name: props.userName,
    program: "תוכנית",
  } : {
    name: "כניסה",
    program: "התאמת תוכנית",
  };

  return (
    <>
    <header>
    <nav ref={navRef} class="bg-white border-sky-200 px-4 lg:px-6 py-2.5 dark:bg-sky-800">
        <div class="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl ">
            <Link href="/" class="flex items-center">
              <span class="self-center text-xl font-semibold whitespace-nowrap dark:text-white">FoodIt</span>
            </Link>
            <div class="flex items-center lg:order-2 gap-2">
                <Link href="/login" class="text-sky-800 dark:text-white hover:bg-sky-50 focus:ring-4 focus:ring-sky-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-sky-700 focus:outline-none dark:focus:ring-sky-800">
                  {userText.name}
                </Link>
                <Link href="/" class="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800">
                  {userText.program}
                </Link>
                <button onClick$={() => menu.value = !menu.value} type="button" class="inline-flex items-center p-2  text-sm text-sky-500 rounded-lg lg:hidden hover:bg-sky-100 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:text-sky-400 dark:hover:bg-sky-700 dark:focus:ring-sky-600" aria-controls="mobile-menu-2" aria-expanded="false">
                    <span class="sr-only">Open main menu</span>
                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path></svg>
                    <svg class="hidden w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                </button>
            </div>
            <div class={["hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1", menu.value ? "!block" : ""]}>
                <ul class="flex flex-col mt-4 font-medium lg:flex-row lg:gap-8 lg:mt-0">
                    <li>
                        <Link onClick$={() => menu.value = false} href="/nutrition-playground/" class="block py-2 pr-4 pl-3 text-sky-700 border-b border-sky-100 hover:bg-sky-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-sky-400 lg:dark:hover:text-white dark:hover:bg-sky-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-sky-700">יומן אכילה</Link>
                    </li>
                    <li>
                        <Link onClick$={() => menu.value = false} href="/person-fitness/" class="block py-2 pr-4 pl-3 text-sky-700 border-b border-sky-100 hover:bg-sky-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-sky-400 lg:dark:hover:text-white dark:hover:bg-sky-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-sky-700">הפיטנס שלי</Link>
                    </li>
                    <li>
                        <Link onClick$={() => menu.value = false} href="/fitness-calculators/" class="block py-2 pr-4 pl-3 text-sky-700 border-b border-sky-100 hover:bg-sky-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-sky-400 lg:dark:hover:text-white dark:hover:bg-sky-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-sky-700">חישובים תזונתיים</Link>
                    </li>
                    <li>
                        <Link onClick$={() => menu.value = false} href="/foods/" class="block py-2 pr-4 pl-3 text-sky-700 border-b border-sky-100 hover:bg-sky-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-sky-400 lg:dark:hover:text-white dark:hover:bg-sky-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-sky-700">מאגר התזונה הישראלי</Link>
                    </li>
                    <li>
                        <Link onClick$={() => menu.value = false} href="#" class="block py-2 pr-4 pl-3 text-sky-700 border-b border-sky-100 hover:bg-sky-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-sky-400 lg:dark:hover:text-white dark:hover:bg-sky-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-sky-700">מאגר קבוצות מזון</Link>
                    </li>
                    <li>
                        <Link onClick$={() => menu.value = false} href="/health-jobs" class="block py-2 pr-4 pl-3 text-sky-700 border-b border-sky-100 hover:bg-sky-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-sky-400 lg:dark:hover:text-white dark:hover:bg-sky-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-sky-700">משרות</Link>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</header>
    </>
  );
});

