import { $, type QRL, Slot, component$ } from "@builder.io/qwik";

type InputType = {
  placeholder: string;
  value: string | number | undefined;
  onInput: QRL<(e: Event, element: HTMLInputElement) => void>;
  inputMode?:
    | "text"
    | "none"
    | "tel"
    | "url"
    | "email"
    | "numeric"
    | "decimal"
    | "search"
    | undefined;
};

export const Input = component$((props: InputType) => {
  return (
    <div>
      <Slot name="title" key={"title"} />
      <input
        inputMode={props.inputMode || "text"}
        class="
            border border-sky-300 rounded-md w-full px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sky-900
            "
        placeholder={props.placeholder}
        value={props.value}
        onInput$={props.onInput || $(() => {})}
      />
      <Slot name="subtitle" key={"subtitle"} />
    </div>
  );
});
