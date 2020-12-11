import readlines from './util/readlines';
import {sortNumeric} from './util/arrays';

function multDifferences(joltages: number[]): number {
  let ones = 0;
  let threes = 0;
  for (let i = 1; i < joltages.length; ++i) {
    let diff = joltages[i] - joltages[i - 1];
    if (diff === 1) {
      ++ones;
    } else if (diff === 3) {
      ++threes;
    } else {
      throw Error(`Unexpected joltage diff: ${diff}`);
    }
  }
  return ones * threes;
}

function searchPaths(joltages: number[], cache: Map<number, number>): number {
  if (joltages.length === 1) {
    return 1;
  }

  const start = joltages[0];
  const cachedPaths = cache.get(start);
  if (cachedPaths) {
    return cachedPaths;
  }

  let numPaths = 0;
  for (let i = 1; i <= 3; ++i) {
    if (joltages[i] - start <= 3) {
      numPaths += searchPaths([...joltages.slice(i)], cache);
    }
  }
  cache.set(start, numPaths);
  return numPaths;
}

export async function solve(): Promise<number> {
  const lines = await readlines('./data/10.txt');
  const joltages = sortNumeric(lines.map(Number));
  // Add socket to the start.
  joltages.unshift(0);
  // Add device to the end.
  joltages.push(joltages[joltages.length - 1] + 3);

  // Part 1:
  // return multDifferences(joltages);

  // Part 2:
  return searchPaths(joltages, new Map());
}
