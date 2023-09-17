import { useSignal, $, createContextId, useComputed$ } from "@builder.io/qwik";
import { type JSX } from "@builder.io/qwik/jsx-runtime";

type ComponentList = JSX.Element[];

type Options = {
  components: ComponentList;
  initialState: number;
  titles: string[];
  requierdFields: string[][];
  state: any;
};

export const useDynamic = (props: Options) => {
  const state = useSignal<number>(props.initialState);

  const next = $(function () {
    if (state.value === props.components.length - 1) return;
    state.value++;
  });

  const prev = $(function () {
    if (state.value === 0) return;
    state.value--;
  });

  const isBackButtonEnabled = useComputed$(function () {
    return state.value === 0;
  });

  const isNextButtonEnabled = useComputed$(function () {
    const isAllrequierdFilled = props.requierdFields[state.value].every(
      (item) => {
        return props.state[item];
      }
    );
    return !isAllrequierdFilled;
  });

  const isLastStep = useComputed$(function () {
    return state.value === props.components.length - 1;
  });
  return {
    state,
    next,
    prev,
    components: props.components,
    titles: props.titles,
    isBackButtonEnabled,
    isNextButtonEnabled,
    isLastStep,
  };
};

export type DynamicReturnType = ReturnType<typeof useDynamic>;

export const DynamicContext = createContextId<DynamicReturnType>("dynamic");
