
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

/** Recursively copies an N-dimensional array of primitives. */
export function copyRec(arr: any[]): any[] {
  return arr.map((a) => Array.isArray(a) ? copyRec(a) : a);
}

/** Recursively sums an N-dimensional array of primitives. */
export function sumRec(arr: any[]): any {
  return arr.reduce((a, b) => a + (Array.isArray(b) ? sumRec(b) : b), 0);
}
