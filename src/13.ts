import readlines from './util/readlines';
import {maxWithIndex} from './util/arrays';

function part1(timestamp: number, ids: number[]): number {
  let target = timestamp;
  let answer = -1;
  while (true) {
    for (let id of ids) {
      if (target % id === 0) {
        answer = id;
        break;
      }
    }
    if (answer >= 0) {
      break;
    }
    ++target;
  }
  return (target - timestamp) * answer;
}

function part2(ids: number[]): number {
  let [m, mi] = maxWithIndex(ids, 0);
  let n = m - mi;
  while (true) {
    let found = true;
    let mult = m;
    for (let i = 0; i < ids.length; ++i) {
      let id = ids[i];
      if (!isNaN(id)) {
        if ((n + i) % id !== 0) {
          found = false;
          break;
        } else if (id !== m) {
          // least common multiple shortcut because inputs are all primes
          mult *= id;
        }
      }
    }
    if (found) {
      return n;
    }
    n += mult;
  }
  return -1;
}

export async function solve(): Promise<number> {
  const lines = await readlines('./data/13.txt');
  let [timestamp, rawIds] = [Number(lines[0]), lines[1].split(',')];
  let ids: number[] = rawIds.map(Number);

  // Part 1:
  // return part1(timestamp, ids.filter(n => !isNaN(n)));

  // Part 2:
  return part2(ids);
}
