import readlines from './util/readlines';
import {sortNumeric, sum} from './util/arrays';

function isValid(numbers: number[], i: number, preambleLength: number) {
  for (let j = i - preambleLength; j < i; ++j) {
    for (let k = j + 1; k < i; ++k) {
      if (numbers[j] + numbers[k] === numbers[i]) {
        return true;
      }
    }
  }
  return false;
}

function findError(numbers: number[], preambleLength = 25): number {
  for (let i = preambleLength; i < numbers.length; ++i) {
    if (!isValid(numbers, i, preambleLength)) {
      return numbers[i];
    }
  }
  return -1;
}

function findWeakness(numbers: number[], target: number): number {
  for (let i = 0; i < numbers.length; ++i) {
    let range = [numbers[i]];
    for (let j = i + 1; j < numbers.length; ++j) {
      range.push(numbers[j]);
      const rangeSum = sum(range);
      if (rangeSum === target) {
        let sorted = sortNumeric(range);
        return sorted[0] + sorted[sorted.length - 1];
      }
      if (rangeSum > target) {
        break;
      }
    }
  }
  return -1;
}

export async function solve(): Promise<number> {
  const lines = await readlines('./data/9.txt');
  const numbers = lines.map(Number);

  // Part 1:
  const error = findError(numbers);
  // return error;

  // Part 2:
  return findWeakness(numbers, error);
}
