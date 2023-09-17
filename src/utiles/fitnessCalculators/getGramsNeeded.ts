export default (bodyWeightKg: number, weightGrams: number) => {
  const gramsNeeded = bodyWeightKg * weightGrams;
  return gramsNeeded;
};
