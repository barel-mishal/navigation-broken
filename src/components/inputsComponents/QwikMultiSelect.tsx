import {
  component$,
  useStore,
  useSignal,
  $,
  type QwikMouseEvent,
  useComputed$,
  useVisibleTask$,
} from "@builder.io/qwik";
import HighlightedText from "../utils/highlighter";

type Item = { id: string; name: string };
type UseMultiSelect<T extends Item> = {
  items: T[];
  fields: (keyof T)[];
};

export function createMultiSelectOptions<T extends Item>(stringArray: T[]) {
  return stringArray.map((item) => {
    return {
      label: item.name,
      value: item.id,
      selected: false,
    };
  });
}

export type MultiSelectOptions = ReturnType<typeof createMultiSelectOptions>;

export function useMultiSelect<T extends Item>(props: UseMultiSelect<T>) {
  const ops = createMultiSelectOptions(props.items);
  const store = useStore({ items: ops }, { deep: true, reactive: true });

  const clear = $((e: any) => {
    e.stopPropagation();
    store.items.forEach((item) => {
      item.selected = false;
    });
  });

  const clearOne = $(
    (e: QwikMouseEvent<HTMLElement, MouseEvent>, element: HTMLLIElement) => {
      e.stopPropagation();
      const value = element.getAttribute("data-value");
      const selectedOption = store.items.find((item) => item.value === value);
      if (!selectedOption) return;
      selectedOption.selected = false;
    }
  );

  const add = $(
    (e: QwikMouseEvent<HTMLElement, MouseEvent>, element: HTMLLIElement) => {
      const value = element.getAttribute("data-value");
      const selectedOption = store.items.find((item) => item.value === value);
      if (!selectedOption) return;
      selectedOption.selected = !selectedOption.selected;
    }
  );

  // new api

  const isShow = useSignal(false);

  const isKeyBoardHover = useSignal(0);

  const onMouseEnterHover = $(
    (index: number) => (isKeyBoardHover.value = index)
  );

  const toggleShow = $(() => (isShow.value = !isShow.value));

  const stopPropagation = $(
    (event: QwikMouseEvent<HTMLInputElement, MouseEvent>) =>
      event.stopPropagation()
  );

  const ulRef = useSignal<HTMLUListElement | undefined>(undefined);

  const searchRef = useSignal<HTMLInputElement | undefined>(undefined);

  const searchQuery = useSignal("");

  const CreateNewOptionAndPush = $(async (query: string) => {
    const newOption = {
      label: query,
      value: "",
      selected: true,
    };
    store.items.push(newOption);
    searchQuery.value = "";
    searchRef.value?.focus();
  });

  const onSearchInput = $((event: Event, element: HTMLInputElement) => {
    searchQuery.value = element.value;
  });

  const computeSearch = useComputed$(() => {
    const query = searchQuery.value.trim();
    if (query === "") return store.items;
    return store.items.filter((item) => {
      const includesQuery = item.label
        .toLowerCase()
        .includes(query.toLowerCase());
      if (!includesQuery) return;
      return <HighlightedText text={item.label} query={query} />;
    });
  });

  const exactMatch = useComputed$(() => {
    const query = searchQuery.value.trim();
    if (query === "") return;
    return store.items.find((item) => item.label === query);
  });

  const onClickCreateNewOption = $(
    (event: QwikMouseEvent<HTMLElement, MouseEvent>) => {
      event.stopPropagation();
      const query = searchQuery.value.trim();
      if (query === "" || query.length < 1) return;
      CreateNewOptionAndPush(query);
    }
  );

  // part of keyboard navigation and focus/click outside logic
  useVisibleTask$(({ track, cleanup }) => {
    track(() => isShow.value);
    if (!isShow.value) return;
    searchRef.value?.focus();
    isKeyBoardHover.value = 0;
    searchQuery.value = "";
    // on click outside
    const listen = function (e: MouseEvent) {
      const isClickedOutside = ulRef.value?.contains(e.target as Node);
      if (isClickedOutside) return;
      isShow.value = false;
    };
    // keyboard navigation logic starts here
    const onKeyDown = function (event: KeyboardEvent) {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        isKeyBoardHover.value = Math.min(
          isKeyBoardHover.value + 1,
          store.items.length - 1
        );
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        isKeyBoardHover.value = Math.max(isKeyBoardHover.value - 1, 0);
      }
      if (event.key === "Enter") {
        event.preventDefault();
        if (computeSearch.value.length === 0) {
          const query = searchQuery.value.trim();
          if (query === "" || query.length < 1) return;
          return CreateNewOptionAndPush(query);
        }
        const selectedOption = store.items[isKeyBoardHover.value];
        if (!selectedOption) return;
        selectedOption.selected = !selectedOption.selected;
      }
      if (event.key === "Escape") {
        event.preventDefault();
        isShow.value = false;
      }
      if (event.key === "Tab") {
        isShow.value = false;
      }
    };

    document.body.addEventListener("click", listen);
    document.body.addEventListener("keydown", onKeyDown);
    cleanup(() => {
      document.body.removeEventListener("click", listen);
      document.body.removeEventListener("keydown", onKeyDown);
    });
  });

  return {
    add,
    clear,
    store,
    ulRef,
    isShow,
    clearOne,
    searchRef,
    toggleShow,
    exactMatch,
    searchQuery,
    computeSearch,
    onSearchInput,
    isKeyBoardHover,
    stopPropagation,
    onMouseEnterHover,
    onClickCreateNewOption,
  };
}

export type MultiSelectProps = ReturnType<typeof useMultiSelect>;

export default component$((props: MultiSelectProps) => {
  // TODO: fix when user click back button and then click back to this component the component looses its state
  return (
    <>
      <div
        tabIndex={0}
        role="button"
        onClick$={props.toggleShow}
        class={[
          "flex max-w-md items-center relative min-h-fit border outline-none rounded-md p-2 gap-2 focus:border-sky-500 text-right ",
        ]}
      >
        <svg
          onClick$={props.clear}
          xmlns="http://www.w3.org/2000/svg"
          class={["min-w-fit max-h-fit  w-5 h-5 fill-pink-600"]}
          viewBox="0 0 256 256"
        >
          <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path>
        </svg>
        <div class={["flex-grow gap-1 flex flex-wrap"]}>
          {props.store.items.map((item) => {
            if (!item.selected) return;
            return (
              <div
                key={item.value}
                class={[
                  "flex place-items-center gap-2 px-2 py-2 rounded-full bg-sky-100 text-sky-900",
                ]}
              >
                <div class={"p-1 bg-white rounded-full"}>
                  <svg
                    onClick$={props.clearOne}
                    data-value={item.value}
                    xmlns="http://www.w3.org/2000/svg"
                    class={[
                      "min-w-fit max-h-fit bg-transparent w-3 h-3 fill-pink-950",
                    ]}
                    viewBox="0 0 256 256"
                  >
                    <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path>
                  </svg>
                </div>
                <span class={[""]}>{item.label}</span>
              </div>
            );
          })}
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class={["min-w-fit max-h-fit w-5 h-5 fill-sky-700"]}
          viewBox="0 0 256 256"
        >
          <path d="M181.66,170.34a8,8,0,0,1,0,11.32l-48,48a8,8,0,0,1-11.32,0l-48-48a8,8,0,0,1,11.32-11.32L128,212.69l42.34-42.35A8,8,0,0,1,181.66,170.34Zm-96-84.68L128,43.31l42.34,42.35a8,8,0,0,0,11.32-11.32l-48-48a8,8,0,0,0-11.32,0l-48,48A8,8,0,0,0,85.66,85.66Z"></path>
        </svg>
        {props.isShow.value ? (
          <ul
            ref={props.ulRef}
            class={[
              "divider",
              "m-0 p-0 absolute list-none max-h-56 overflow-y-auto border border-sky-300 rounded-lg w-full left-0 top-full translate-y-2 z-50 bg-white",
              "block",
            ]}
          >
            <li class={"p-1 sticky min-h-fit top-0 bg-white z-50"}>
              <input
                ref={props.searchRef}
                onInput$={props.onSearchInput}
                onClick$={props.stopPropagation}
                type="text"
                value={props.searchQuery.value}
                class={[
                  "w-full rounded-md p-2 border border-sky-300 focus-visible:outline-sky-400",
                  "",
                ]}
              />
            </li>
            {props.exactMatch.value ? (
              <></>
            ) : (
              <li class={"bg-sky-800 p-2 m-1 rounded-md text-sky-50 font-bold"}>
                <button onClick$={props.onClickCreateNewOption}>
                  צור: {props.searchQuery.value}
                </button>
              </li>
            )}
            {props.computeSearch.value.map((item, index) => {
              return (
                <li
                  key={`index-${item.value}`}
                  onClick$={props.add}
                  onMouseEnter$={() => props.onMouseEnterHover(index)}
                  data-value={item.value}
                  class={[
                    "py-1 px-2 cursor-pointer",
                    "",
                    {
                      "bg-sky-700 text-white":
                        props.isKeyBoardHover.value === index,
                    },
                    {
                      "bg-sky-100":
                        item.selected && props.isKeyBoardHover.value !== index,
                    },
                  ]}
                >
                  {item.label}
                </li>
              );
            })}
          </ul>
        ) : (
          <></>
        )}
      </div>
    </>
  );
});
