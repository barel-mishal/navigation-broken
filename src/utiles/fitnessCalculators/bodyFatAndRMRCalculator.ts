// Add this function to calculate lean body mass
export function calculateLeanBodyMass(
  weight: number,
  bodyFatPercentage: number
) {
  const bodyFatWeight = (weight * bodyFatPercentage) / 100;
  return weight - bodyFatWeight;
}

// Add this function to calculate RMR using the Cunningham equation
export function restingMetabolicRateCunningham(leanBodyMass: number) {
  return 500 + 22.5 * leanBodyMass;
}
