import {
  type QRL,
  type QwikChangeEvent,
  component$,
  $,
} from "@builder.io/qwik";

type onInput = QRL<
  (
    _e: Event | QwikChangeEvent<HTMLSelectElement>,
    element: HTMLInputElement | HTMLSelectElement
  ) => void
>;

export default component$(
  (props: {
    title: string;
    param: string;
    value: string | number;
    onInputQRL: onInput;
  }) => {
    const onFocused = $(
      (_e: QwikChangeEvent<HTMLInputElement>, element: HTMLInputElement) => {
        element.select();
      }
    );
    return (
      <>
        <label for={`${props.param}-id"`}>
          <h6
            class={["font-bold leading-none tracking-wide text-sky-800 py-2"]}
          >
            {props.title}
          </h6>
          <input
            class={[{}]}
            id={`${props.param}-input-id`}
            name={`${props.param}-input-name`}
            type="text"
            onFocus$={onFocused}
            value={props.value}
            onInput$={props.onInputQRL}
          />
        </label>
      </>
    );
  }
);
