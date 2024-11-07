export const setInputValue = (
  target: HTMLInputElement | null,
  value: string
) => {
  if (target) target.value = value;
};
