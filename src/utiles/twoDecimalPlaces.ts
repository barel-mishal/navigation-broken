export default (value: number | string | null) => {
  if (value === null) return null;
  if (typeof value === "string") {
    if (value.length === 0) return null;
  }
  return Math.round(Number(value) * 100) / 100;
};
