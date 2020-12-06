
export function min<T>(arr: T[], defaultVal: T): T {
  return arr.reduce((a, b) => a <= b ? a : b, defaultVal);
}

export function max<T>(arr: T[], defaultVal: T): T {
  return arr.reduce((a, b) => a >= b ? a : b, defaultVal);
}

export function sum(arr: number[]): number {
  return arr.reduce((a, b) => a + b, 0);
}
