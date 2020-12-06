import readlines from './util/readlines';

function foo(seats: number[]): number {
  return 0;
}

/** Returns each group as a Set of either shared 'Yes' answers or all 'Yes' answers. */
function parseGroups(lines: string[], includeAllAnswers: boolean): Set<string>[] {
  let groups: Set<string>[] = [];
  let currAnswers: Set<string> = new Set();
  let addAnswers = true;
  for (let line of lines) {
    if (line.length === 0) {
      groups.push(currAnswers);
      currAnswers = new Set();
      addAnswers = true;
    } else if (addAnswers) {
      for (let answer of line) {
        currAnswers.add(answer);
      }
      addAnswers = includeAllAnswers;
    } else {
      let nextAnswers = [...line]
      for (let answer of currAnswers) {
        if (!nextAnswers.includes(answer)) {
          currAnswers.delete(answer);
        }
      }
    }
  }
  groups.push(currAnswers);
  return groups;
}

export async function solve(): Promise<number> {
  const lines = await readlines('./data/6.txt');

  // Part 1:
  // const groups = parseGroups(lines, true);

  // Part 2:
  const groups = parseGroups(lines, false);

  return groups.reduce((a, b) => a + b.size, 0);
}
