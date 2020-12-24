function playGame(input: number[]): number[] {
  let start = input[0];
  let cups = buildLinkedList(input);
  let current = start;
  for (let round = 0; round < 10000000; ++round) {
    current = playRound(cups, current);
  }
  return cups;
}

function playRound(cups: number[], current: number) {
  // Remove 3 cups.
  let next = cups[current];
  let removed = [];
  for (let i = 0; i < 3; ++i) {
    removed.push(next);
    next = cups[next];
  }
  cups[current] = next;

  // Find target cup.
  let target = current - 1;
  if (target === 0) {
    target += cups.length - 1;
  }
  while (removed.includes(target)) {
    target -= 1;
    if (target === 0) {
      target += cups.length - 1;
    }
  }

  // Re-add removed cups.
  next = cups[target];
  cups[target] = removed[0];
  cups[removed[removed.length - 1]] = next;

  return cups[current];
}

function buildLinkedList(cups: number[]): number[] {
  const list = new Array(cups.length + 1);
  for (let i = 0; i < cups.length; ++i) {
    list[cups[i]] = cups[(i + 1) % cups.length];
  }
  return list;
}

function getOrder(cups: number[]): string {
  let out = '';
  let curr = cups[1];
  while (curr !== 1) {
    out += curr;
    curr = cups[curr];
  }
  return out;
}

function next2Cups(cups: number[]): number {
  let out = 1;
  let curr = cups[1];
  for (let i = 0; i < 2; ++i) {
    out *= curr;
    curr = cups[curr];
  }
  return out;
}

export async function solve(): Promise<number> {
  const cups = [3, 6, 8, 1, 9, 5, 7, 4, 2];

  // Part 1:
  // console.log(getOrder(playGame(cups)));

  // Part 2
  for (let i = 10; i <= 1000000; ++i) {
    cups.push(i);
  }
  return next2Cups(playGame(cups));
}
