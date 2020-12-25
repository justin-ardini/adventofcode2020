import readlines from './util/readlines';

function findLoopSize(subject: number, target: number) {
  let val = 1;
  let i = 0;
  while (val !== target) {
    val *= subject;
    val = val % 20201227;
    ++i;
  }
  return i;
}

function transform(subject: number, loopSize: number) {
  let val = 1;
  for (let i = 0; i < loopSize; ++i) {
    val *= subject;
    val = val % 20201227;
  }
  return val;
}

export async function solve(): Promise<number> {
  const lines = await readlines('./data/25.txt');
  const [keyA, keyB] = lines.map(Number);

  // Part 1:
  const loopA = findLoopSize(7, keyA);
  const loopB = findLoopSize(7, keyB);
  return transform(keyA, loopB);
}
