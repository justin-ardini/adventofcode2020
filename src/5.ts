import readlines from './util/readlines';

function search(input: string, min: number, max: number): number {
  if (min >= max) {
    return min;
  }
  const size = (max - min + 1);
  if (input.charAt(0) === 'F' || input.charAt(0) === 'L') {
    return search(input.substring(1), min, max - size / 2);
  } else {
    return search(input.substring(1), min + size / 2, max);
  }
}

function seatId(line: string): number {
  const row = search(line.substring(0, 7), 0, 127);
  const col = search(line.substring(7), 0, 7);
  return row * 8 + col;
}

function findMissingSeat(seats: number[]): number {
  const sorted = [...seats];
  sorted.sort((a, b) => a - b);
  for (let i = 1; i < sorted.length; ++i) {
    if (sorted[i] - sorted[i - 1] !== 1) {
      return sorted[i - 1] + 1;
    }
  }
  return -1;
}

export async function solve(): Promise<number> {
  const lines = await readlines('./data/5.txt');
  const seats = lines.map(seatId);

  // Part 1:
  // return seats.reduce((a, b) => a > b ? a : b);

  // Part 2:
  return findMissingSeat(seats);
}
