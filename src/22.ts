import readlines from './util/readlines';

function parseLine(line: string): number {
  return Number(line);
}

function playCombat(p1: number[], p2: number[]): number[] {
  while (p1.length > 0 && p2.length > 0) {
    [p1, p2] = playRound(p1, p2);
  }
  return p1.length > 0 ? p1 : p2;
}

function playRound(p1: number[], p2: number[]): [number[], number[]] {
  const c1 = p1.shift();
  const c2 = p2.shift();
  if (c1 > c2) {
    p1 = p1.concat([c1, c2]);
  } else {
    p2 = p2.concat([c2, c1]);
  }
  return [p1, p2];
}

function combatRec(deck1: number[], deck2: number[], cache: Set<string>): [number[], number] {
  let p1 = [...deck1];
  let p2 = [...deck2];
  while (p1.length > 0 && p2.length > 0) {
    if (!cacheRound(p1, p2, cache)) {
      return [p1, 1];
    }
    [p1, p2] = recRound(p1, p2, cache);
  }
  return p1.length > 0 ? [p1, 1] : [p2, 2];
}

function recRound(p1: number[], p2: number[], cache: Set<string>): [number[], number[]] {
  const c1 = p1.shift();
  const c2 = p2.shift();
  let p1Won;
  if (p1.length >= c1 && p2.length >= c2) {
    p1Won = combatRec(p1.slice(0, c1), p2.slice(0, c2), new Set())[1] === 1;
  } else {
    p1Won = c1 > c2;
  }
  if (p1Won) {
    p1 = p1.concat([c1, c2]);
  } else {
    p2 = p2.concat([c2, c1]);
  }
  return [p1, p2];
}

function cacheRound(p1: number[], p2: number[], cache: Set<string>): boolean {
  const key = toKey(p1, p2);
  if (cache.has(key)) {
    return false;
  }
  cache.add(key);
  return true;
}

function toKey(p1: number[], p2: number[]): string {
  return p1.toString() + ';' + p2.toString();
}

function score(deck: number[]): number {
  return deck.reduce((a, b, i) => a + b * (deck.length - i), 0);
}

export async function solve(): Promise<number> {
  const lines = await readlines('./data/22.txt');
  let p1End = lines.indexOf('');
  const [p1, p2] = [lines.slice(1, p1End).map(Number), lines.slice(p1End + 2).map(Number)];

  // Part 1:
  // return score(playCombat(p1, p2));

  // Part 2
  return score(combatRec(p1, p2, new Set())[0]);
}
