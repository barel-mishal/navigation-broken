import { component$ } from "@builder.io/qwik";
import { z } from "@builder.io/qwik-city";

const ButtonSchema = z.object({
  text: z.string(),
  onclick: z.function(),
  disabled: z.boolean().default(false).optional(),
});

type ButtonType = z.infer<typeof ButtonSchema>;

export default component$((props: ButtonType) => {
  return (
    <>
      <button
        class={`
      bg-sky-700 hover:bg-sky-800 text-sky-50 font-bold py-2 px-5 rounded-lg
      focus:ring-2 focus:ring-offset-2 text-2xl focus:ring-sky-500 focus:outline-transparent
      disabled:bg-gray-400 disabled:text-gray-200 disabled:cursor-not-allowed 
      transition-all duration-300 ease-in-out delay-100
      lg:w-fit
      `}
        disabled={props.disabled}
        aria-disabled={props.disabled}
        onClick$={props.onclick}
      >
        {props.text}
      </button>
    </>
  );
});
