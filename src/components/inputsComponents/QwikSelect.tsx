import {
  component$,
  Slot,
  type QRL,
  type QwikChangeEvent,
  useStylesScoped$,
} from "@builder.io/qwik";

export default component$(
  (props: {
    param: string;
    onChange: QRL<
      (
        _e: Event | QwikChangeEvent<HTMLSelectElement>,
        element: HTMLInputElement | HTMLSelectElement
      ) => void
    >;
    title: string;
  }) => {
    useStylesScoped$(`
        select {
        -webkit-appearance: none;
        }
    `);

    return (
      <>
        <label for={`${props.param}-select-input-id`}>
          <h6
            class={["font-bold leading-none tracking-wide text-sky-800 py-2"]}
          >
            {props.title}
          </h6>
          <div class="grid items-center justify-items-end">
            <select
              name={`${props.param}-select-input-name`}
              id={`${props.param}-select-input-id`}
              class={["col-start-1 row-start-1"]}
              onChange$={props.onChange}
            >
              <Slot key={"options"} />
            </select>
            <svg
              class={`col-start-1 m-2 row-start-1 w-4 h-4 fill-sky-800 `}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 256 256"
            >
              <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path>
            </svg>
          </div>
        </label>
      </>
    );
  }
);
