import readlines from './util/readlines';

/** Finds the first pair with the target sum. */
function sumPair(numbers: number[], targetSum: number): [number, number] {
  for (let i = 0; i < numbers.length; ++i) {
    for (let j = i + 1; j < numbers.length; ++j) {
      let [x, y] = [numbers[i], numbers[j]];
      if (x + y === targetSum) {
        return [x, y];
      }
    }
  }
  return [-1, -1];
}

/** Finds the first triple with the target sum. */
function sumTriple(numbers: number[], targetSum: number): [number, number, number] {
  for (let i = 0; i < numbers.length; ++i) {
    for (let j = i + 1; j < numbers.length; ++j) {
      for (let k = j + 1; k < numbers.length; ++k) {
        let [x, y, z] = [numbers[i], numbers[j], numbers[k]];
        if (x + y  + z === targetSum) {
          return [x, y, z];
        }
      }
    }
  }
  return [-1, -1, -1];
}

export async function solve(): Promise<number> {
  const lines = await readlines('./data/1.txt');
  const numbers: number[] = lines.map(Number);

  // Part 1:
  // const [x, y] = sumPair(numbers, 2020);
  // return x * y;

  // Part 2:
  const [x, y, z] = sumTriple(numbers, 2020);
  return x * y * z;
}
