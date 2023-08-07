export function roundTwoDecimals(num: number | string): number {
  if (typeof num === 'string') {
    num = Number(num);
    return Number(num.toFixed(2));
  }
  return Number(num.toFixed(2));
}

export const handleCurrencyInput = (
  e: React.KeyboardEvent,
  currentValue: any,
  setNewValue: (newValue: any) => void,
) => {
  if (e.key == 'Backspace') {
    setNewValue(roundTwoDecimals(currentValue / 10));
  }

  const numericKeyRegex = /^[0-9]$/;
  if (numericKeyRegex.test(e.key)) {
    if (currentValue === 0) {
      return setNewValue(Number(Number(e.key) / 100));
    }
    setNewValue(roundTwoDecimals(currentValue * 10 + Number(e.key) / 100));
  }
  console.log('currentValue', currentValue);
  console.log('e.key', e.key);
  console.log(currentValue * 10 + Number(e.key) / 100);
};
