function runGame(start: number[], limit: number): number {
  const toIndex = new Map();
  for (let i = 0; i < start.length; ++i) {
    toIndex.set(start[i], i);
  }
  let curr = start[start.length - 1];
  for (let i = start.length - 1;; ++i) {
    if (i === limit - 1) {
      return curr;
    }
    let prevIndex = toIndex.get(curr);
    let next = prevIndex === undefined ? 0 : i - prevIndex;
    toIndex.set(curr, i);
    curr = next;
  }
  return -1;
}

export async function solve(): Promise<number> {
  const input = [14,1,17,0,3,20];

  // Part 1:
  // return runGame(input, 2020);

  // Part 2:
  return runGame(input, 30000000);
}
