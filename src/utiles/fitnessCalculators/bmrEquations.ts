import type { z } from "zod";
import type { BasicInfoSchema } from "./FittnessSchema";

export type Person = z.infer<typeof BasicInfoSchema>;

export function revisedHarrisBenedictBMR(person: Person) {
  if (person.gender === "male") {
    return (
      88.4 + 13.4 * person.weight + 4.8 * person.height - 5.68 * person.age
    );
  } else if (person.gender === "female") {
    return (
      447.6 + 9.25 * person.weight + 3.1 * person.height - 4.33 * person.age
    );
  }
}

export function mifflinStJeor(person: Person) {
  if (person.gender === "male") {
    return 9.99 * person.weight + 6.25 * person.height - 4.92 * person.age + 5;
  } else if (person.gender === "female") {
    return (
      9.99 * person.weight + 6.25 * person.height - 4.92 * person.age - 161
    );
  }
}
