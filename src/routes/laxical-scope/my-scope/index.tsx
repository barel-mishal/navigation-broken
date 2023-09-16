import { component$ } from "@builder.io/qwik";
import { routeLoader$, routeAction$, zod$, z } from "@builder.io/qwik-city";

export const useLoadSomething = routeLoader$(() => {
    return {
        myText: 'Some link'
    }
});

export const useMyAction = routeAction$((data) => {
    return {
        myText: data.myText
    }
}, zod$(z.object({
    myText: z.string(),
})));

export default component$(() => {
    return <div>
        something good
    </div>
});