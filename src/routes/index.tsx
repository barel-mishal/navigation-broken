import { component$ } from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  // https://tdeecalculator.org/
  return (
    <div class={`min-h-full`}>
      <div class={`p-2 grid gap-6`}>
        <h1
          class={`
        text-8xl bg-gradient-to-tr from-sky-800 to-sky-500 text-transparent bg-clip-text font-bold text-center
        `}
        >
          תזונה מותאמת אישית
        </h1>
        <a
          class={`flex bg-blue-800 text-blue-50 p-4 rounded-lg place-content-center m-auto`}
          href="/person-fitness/"
        >
          צור תוכנית תזונה אישית
        </a>
      </div>
      <div class="gap-4 p-2 m-auto md:max-w-2xl">
        <h1 class={` text-4xl font-bold text-centertext-sky-950 `}>
          מפת דרכים יישום תוכן וכלים:
        </h1>
        <div class={"h-5"}></div>
        <ul
          class={`bg-white p-4 shadow-2xl shadow-sky-950/40 rounded-lg grid gap-4`}
        >
          {ROADMAP.map((item, index) => {
            return (
              <li key={index} class={`flex gap-2 flex-col`}>
                <div class={`flex gap-2`}>
                  {item.icon}
                  <h2 class={`font-bold text-sky-700 text-xl`}>{item.title}</h2>
                </div>
                <p>{item.description}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Qwik",
  meta: [
    {
      name: "description",
      content: "Qwik site description",
    },
  ],
};

const ROADMAP = [
  {
    title: "תוכנית אימונים ותזונה",
    description:
      "פשוט רושמים פרטים אישיים, מצב גופני, מטרות, תזונה יומית ומקבלים תוכנית מותאמת אישית",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class={"h-7 w-7 fill-sky-700"}
        viewBox="0 0 256 256"
      >
        <path d="M103.77,185.94C103.38,187.49,93.63,224,40,224a8,8,0,0,1-8-8c0-53.63,36.51-63.38,38.06-63.77a8,8,0,0,1,3.88,15.53c-.9.25-22.42,6.54-25.56,39.86C81.7,204.48,88,183,88.26,182a8,8,0,0,1,15.51,4Zm93-67.4L192,123.31v58.33A15.91,15.91,0,0,1,187.32,193L153,227.3A15.91,15.91,0,0,1,141.7,232a16.11,16.11,0,0,1-5.1-.83,15.94,15.94,0,0,1-10.78-12.92l-5.37-38.49L76.24,135.55l-38.47-5.37A16,16,0,0,1,28.7,103L63,68.68A15.91,15.91,0,0,1,74.36,64h58.33l4.77-4.77c26.68-26.67,58.83-27.82,71.41-27.07a16,16,0,0,1,15,15C224.6,59.71,223.45,91.86,196.78,118.54ZM40,114.34l37.15,5.18L116.69,80H74.36ZM91.32,128,128,164.68l57.45-57.45a76.46,76.46,0,0,0,22.42-59.16,76.65,76.65,0,0,0-59.11,22.47ZM176,139.31l-39.53,39.53L141.67,216,176,181.64Z"></path>
      </svg>
    ),
  },
  {
    title: "קבוצות מזון",
    description:
      "הוספה של טבלה מגניבה להכרת קבוצות המזון משמעותן וחיפוש תחליפי מזון",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class={"h-7 w-7 fill-sky-700"}
        viewBox="0 0 256 256"
      >
        <path d="M128,0C57.31,0,0,57.31,0,128s57.31,128,128,128,128-57.31,128-128S198.69,0,128,0Zm0,240C66.75,240,16,189.25,16,128S66.75,16,128,16s112,50.75,112,112S189.25,240,128,240Z"></path>
        <path d="M128,64a64,64,0,1,0,64,64A64.07,64.07,0,0,0,128,64Zm0,112a48,48,0,1,1,48-48A48.05,48.05,0,0,1,128,176Z"></path>
      </svg>
    ),
  },
  {
    title: "מחשבוני תזונה",
    description: "dri, bmi, tdee, bmr, amdr, חלבון ועוד... ",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class={"h-7 w-7 fill-sky-700"}
        viewBox="0 0 256 256"
      >
        <path d="M128,0C57.31,0,0,57.31,0,128s57.31,128,128,128,128-57.31,128-128S198.69,0,128,0Zm0,240C66.75,240,16,189.25,16,128S66.75,16,128,16s112,50.75,112,112S189.25,240,128,240Z"></path>
        <path d="M128,64a64,64,0,1,0,64,64A64.07,64.07,0,0,0,128,64Zm0,112a48,48,0,1,1,48-48A48.05,48.05,0,0,1,128,176Z"></path>
      </svg>
    ),
  },
  {
    title: "מתכונים",
    description: "הוספת אתר מתכונים גדול",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class={"h-7 w-7 fill-sky-700"}
        viewBox="0 0 256 256"
      >
        <path d="M128,0C57.31,0,0,57.31,0,128s57.31,128,128,128,128-57.31,128-128S198.69,0,128,0Zm0,240C66.75,240,16,189.25,16,128S66.75,16,128,16s112,50.75,112,112S189.25,240,128,240Z"></path>
        <path d="M128,64a64,64,0,1,0,64,64A64.07,64.07,0,0,0,128,64Zm0,112a48,48,0,1,1,48-48A48.05,48.05,0,0,1,128,176Z"></path>
      </svg>
    ),
  },
  {
    title: "עוזר תזונתי",
    description:
      "בינה מלאכותית שתנהל לך קניות, תזכיר לך לאכול ולתכנן את האכילה",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class={"h-7 w-7 fill-sky-700"}
        viewBox="0 0 256 256"
      >
        <path d="M128,0C57.31,0,0,57.31,0,128s57.31,128,128,128,128-57.31,128-128S198.69,0,128,0Zm0,240C66.75,240,16,189.25,16,128S66.75,16,128,16s112,50.75,112,112S189.25,240,128,240Z"></path>
        <path d="M128,64a64,64,0,1,0,64,64A64.07,64.07,0,0,0,128,64Zm0,112a48,48,0,1,1,48-48A48.05,48.05,0,0,1,128,176Z"></path>
      </svg>
    ),
  },
];