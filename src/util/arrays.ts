
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

export function product(arr: number[]): number {
  return arr.reduce((a, b) => a * b, 1);
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

export function permute<T>(arr: T[]): T[][] {
  return permuteRec(arr, new Map());
}

function permuteRec<T>(arr: T[], cache: Map<T[], T[][]>): T[][] {
  if (arr.length <= 1) {
    return [arr];
  }

  const cacheVal = cache.get(arr);
  if (cacheVal) {
    return cacheVal;
  }

  let permutations = [];
  for (let i = 0; i < arr.length; ++i) {
    let val = arr[i];
    let remaining = arr.slice(0, i).concat(arr.slice(i + 1));
    for (let permutation of permuteRec(remaining, cache)) {
      permutations.push([val].concat(permutation));
    }
  }
  cache.set(arr, permutations);
  return permutations;
}
