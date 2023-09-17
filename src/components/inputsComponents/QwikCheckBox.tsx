import { type QRL, type QwikChangeEvent, component$ } from "@builder.io/qwik";

type onInput = QRL<
  (
    _e: Event | QwikChangeEvent<HTMLInputElement>,
    element: HTMLInputElement
  ) => void
>;

export default component$(
  (props: {
    title: string;
    param: string;
    value: number | readonly string[] | FormDataEntryValue | null | undefined;
    onInputQRL: onInput;
    checked: boolean;
    inputStyle?: string;
    labelStyle?: string;
    labelTitleStyle?: string;
  }) => {
    return (
      <>
        <div class="inline-flex items-center">
          <label
            class={[
              "relative flex cursor-pointer items-center rounded-full p-3",
              props.labelStyle,
            ]}
            for={`${props.param}-checkbox`}
            data-ripple-dark="true"
          >
            <input
              id={`${props.param}-checkbox`}
              type="checkbox"
              checked={props.checked}
              onChange$={props.onInputQRL}
              value={props.value}
              class={[
                "before:content[''] peer relative h-8 w-8 cursor-pointer appearance-none rounded-md border border-sky-300 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-sky-500 checked:bg-sky-500 checked:before:bg-sky-500 hover:before:opacity-10",
                props.inputStyle,
              ]}
            />
            <div class="pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
                stroke="currentColor"
                stroke-width="1"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </div>
          </label>
          <label
            class={[
              "cursor-pointer select-none font-bold leading-none text-sky-700 text-2xl",
              props.labelTitleStyle,
            ]}
            for={`${props.param}-checkbox`}
          >
            {props.title}
          </label>
        </div>
      </>
    );
  }
);
