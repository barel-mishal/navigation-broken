import {
  type QRL,
  Slot,
  component$,
  type QwikChangeEvent,
  useStylesScoped$,
} from "@builder.io/qwik";

type SelectType = {
  placeholder: string;
  options: { value: string | number; text: string; selected: boolean }[];
  onChnage: QRL<
    (e: QwikChangeEvent<HTMLSelectElement>, element: HTMLSelectElement) => void
  >;
  disabled: boolean;
  id: string;
  name: string;
};

export default component$((props: SelectType) => {
  useStylesScoped$(`
  select {
    -webkit-appearance: none;
  }`);
  return (
    <div class={[""]}>
      <Slot name="title" key={"title"} />
      <div class={`relative`}>
        <select
          class="
          border border-sky-300 rounded-md w-full px-3 py-2
          focus:outline-transparent focus:ring-2 focus:ring-sky-500
          text-sky-900
          "
          name={props.name}
          id={props.id}
          onChange$={props.onChnage}
          disabled={props.disabled}
        >
          {props.options.map((option, uniqueKey) => {
            return (
              <option
                key={uniqueKey}
                value={option.value}
                selected={option.selected}
              >
                {option.text}
              </option>
            );
          })}
        </select>
        <svg
          class={`absolute top-1/4 left-2 w-4 h-4 fill-sky-800 `}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 256 256"
        >
          <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path>
        </svg>
      </div>
      <Slot name="subtitle" key={"subtitle"} />
    </div>
  );
});
