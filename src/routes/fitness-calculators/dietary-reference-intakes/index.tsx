import { component$, useContextProvider } from "@builder.io/qwik";
import DRISelectComponent, { contextDRI } from "~/components/contexts/DRISelectComponent";

import { routeLoader$ } from "@builder.io/qwik-city";
import { type DRISchemaType } from "~/utiles/fitnessCalculators/DRISchema";
import { FitnessContext, useFitness } from "~/components/contexts/useFitnessContext";
export const useDRI = routeLoader$(async () => {
  return await fetch("http://localhost/rustapi/dri").then((res) => res.json()) as DRISchemaType;
});

export default component$(() => {
    const dri = useDRI();
    useContextProvider(contextDRI, dri.value);
    const fitness = useFitness();
    useContextProvider(FitnessContext, fitness);

    return <DRISelectComponent key={'dri-component'} />
}); 