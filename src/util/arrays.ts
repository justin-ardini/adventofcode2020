
export function min<T>(arr: T[], defaultVal: T): T {
  return arr.reduce((a, b) => b < a ? b : a, defaultVal);
}

export function max<T>(arr: T[], defaultVal: T): T {
  return arr.reduce((a, b) => b > a ? b : a, defaultVal);
}

export function minWithIndex<T>(arr: T[], defaultVal: T): [T, number] {
  return arr.reduce((acc, b, i) => b < acc[0] ? [b, i] : acc, [defaultVal, -1]);
}

export function maxWithIndex<T>(arr: T[], defaultVal: T): [T, number] {
  return arr.reduce((acc, b, i) =>  b > acc[0] ? [b, i] : acc, [defaultVal, -1]);
}

export function sum(arr: number[]): number {
  return arr.reduce((a, b) => a + b, 0);
}

export function sortNumeric(arr: number[]): number[] {
  return [...arr].sort((a, b) => a - b);
}
