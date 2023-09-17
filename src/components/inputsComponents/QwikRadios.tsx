import { type QRL, type QwikChangeEvent, component$ } from "@builder.io/qwik";

type RadioType = {
  data: {
    name: string;
    id: string;
    value: string;
    title: string;
    subtitle?: string;
    selected: boolean;
  }[];
  onChnage: QRL<
    (
      e: QwikChangeEvent<HTMLFieldSetElement>,
      element: HTMLFieldSetElement
    ) => void
  >;
};

export default component$((props: RadioType) => {
  return (
    <div class={`relative`}>
      <fieldset class={"space-y-2"} onChange$={props.onChnage}>
        <legend></legend>
        {props.data.map((radio, uniqueKey) => {
          return <Child {...radio} key={uniqueKey} />;
        })}
      </fieldset>
    </div>
  );
});

export const Child = component$((props: RadioType["data"][0]) => {
  return (
    <>
      <div class={`relative`}>
        <input
          class={`hidden peer`}
          type="radio"
          name={props.name}
          id={props.id}
          checked={props.selected}
          value={props.value}
        />
        <label
          for={props.id}
          class={`
        border border-sky-300 
        cursor-pointer flex gap-4 p-4 pl-12 rounded-xl bg-white bg-opacity-90 
        backdrop-blur-2xl shadow-xl shadow-sky-900/25 hover:bg-opacity-75 
        delay-100 transition duration-300 ease-in-out flex-col
        peer-checked:bg-blue-900 peer-checked:text-white`}
        >
          <h6
            class={[
              `text-2xl`,
              {
                "text-sky-50": props.selected,
                "text-sky-950": !props.selected,
              },
            ]}
          >
            {props.title}
          </h6>
          <span
            class={[
              `text-sm`,
              {
                "text-sky-50/70": props.selected,
                "text-sky-950/70": !props.selected,
              },
            ]}
          >
            {props.subtitle}
          </span>
        </label>
        <div
          class="flex justify-center items-center
        absolute top-0 left-4 bottom-0 w-7 h-7 my-auto scale-0 rounded-full bg-blue-700 
        peer-checked:scale-100 delay-100 transition duration-300 ease-in-out
        "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class={`fill-sky-300 h-4 w-4`}
            viewBox="0 0 256 256"
          >
            <path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path>
          </svg>
        </div>
      </div>
    </>
  );
});
