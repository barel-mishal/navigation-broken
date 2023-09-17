import { component$, useStylesScoped$, Slot } from "@builder.io/qwik";

interface Props {
  onInput: (e: Event, element: HTMLInputElement) => void;
  value: string;
  inputId: string;
}

export default component$((props: Props) => {
  useStylesScoped$(`
    input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        background-color: #1f2937;
        width: 10px;
        height: 10px;
        border-radius: 50%;
    }`);
  return (
    <>
      <div class={"py-2"}>
        <Slot name="title" key={"title"} />
        <input
          type="range"
          min={200}
          max={1000}
          step={10}
          class="transparent h-1.5 w-full cursor-pointer appearance-none rounded-lg border-transparent bg-sky-200"
          id={props.inputId}
          onInput$={props.onInput}
          value={props.value}
        />
      </div>
      <Slot name="sub-title" key={"sub-title"} />
    </>
  );
});
