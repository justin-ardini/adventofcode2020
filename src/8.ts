import readlines from './util/readlines';

function parseLine(line: string): [string, number] {
  const parts = line.split(' ');
  return [parts[0], Number(parts[1])];
}

/** Returns acc value when a loop is found. */
function runUntilLoop(program: [string, number][]): number {
  const visited: Set<number> = new Set();
  let i = 0;
  let acc = 0;
  while (true) {
    visited.add(i);
    let [op, n] = program[i];
    switch (op) {
      case 'acc':
        acc += n;
        i += 1;
        break;
      case 'jmp':
        i += n;
        break;
      case 'nop':
        i += 1;
        break;
    }
    if (visited.has(i)) {
      break;
    }
  }
  return acc;
}

/** Returns acc when done or null if a loop was found. */
function runUntilDone(program: [string, number][]): number|null {
  const visited: Set<number> = new Set();
  let i = 0;
  let acc = 0;
  let end = program.length;
  while (true) {
    visited.add(i);
    let [op, n] = program[i];
    switch (op) {
      case 'acc':
        acc += n;
        i += 1;
        break;
      case 'jmp':
        i += n;
        break;
      case 'nop':
        i += 1;
        break;
    }
    if (i === end) {
      return acc;
    }
    if (visited.has(i)) {
      return null;
    }
  }
  return null;
}

/** Flips a single nop->jmp or jmp->nop and returns acc if it completes. */
function fixProgram(program: [string, number][]): number|null {
  for (let i = 0; i < program.length; ++i) {
    let [op, n] = program[i];
    if (op === 'acc') {
      continue;
    }
    let fixedProgram: [string, number][] = program.map(op => [op[0], op[1]]);
    if (op === 'jmp') {
      fixedProgram[i][0] = 'nop';
    } else {
      fixedProgram[i][0] = 'jmp';
    }
    const acc = runUntilDone(fixedProgram);
    if (acc !== null) {
      return acc;
    }
  }
  return NaN;
}

export async function solve(): Promise<number> {
  const lines = await readlines('./data/8.txt');
  const program = lines.map(parseLine);

  // Part 1:
  // return runUntilLoop(program);

  // Part 2:
  return fixProgram(program);
}
