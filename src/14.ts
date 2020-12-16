import readlines from './util/readlines';

type Instruction = string | [number, number];

function parseLine(line: string): Instruction {
  if (line.startsWith('mask')) {
    return parseMask(line);
  } else {
    return parseMem(line);
  }
}

function parseMask(line: string): string {
  return line.substr(7);
}

function parseMem(line: string): [number, number] {
  const parts = line.split('] = ');
  const addr = Number(parts[0].substr(4));
  const value = Number(parts[1]);
  return [addr, value];
}

function part1(program: Instruction[]): number {
  const mem: Map<number, number> = new Map();
  let mask = '';
  for (let instruction of program) {
    if (typeof instruction === "string") {
      mask = instruction;
    } else {
      let [addr, value] = instruction;
      mem.set(addr, setMask(mask, value));
    }
  }
  let total = 0;
  for (let v of mem.values()) {
    total += v;
  }
  return total;
}

function setMask(mask: string, value: number): number {
  let result = [...mask];
  const str = value.toString(2);
  const diff = result.length - str.length;
  for (let i = result.length - 1; i >= 0; --i) {
    if (result[i] === 'X') {
      result[i] = str[i - diff] || '0';
    }
  }
  return Number.parseInt(result.join(''), 2);
}

function part2(program: Instruction[]): number {
  const mem: Map<number, number> = new Map();
  let mask = '';
  for (let instruction of program) {
    if (typeof instruction === "string") {
      mask = instruction;
    } else {
      let [addr, value] = instruction;
      let strAddr = addr.toString(2).padStart(mask.length, '0');
      for (let a of allAddrs(mask, strAddr)) {
        mem.set(a, value);
      }
    }
  }
  let tot = 0;
  for (let v of mem.values()) {
    tot += v;
  }
  return tot;
}

function allAddrs(mask: string, addr: string): number[] {
  let addrs: string[][] = [[]];
  for (let i = 0; i < mask.length; ++i) {
    let n = mask[i];
    if (n === '0') {
      for (let a of addrs) {
        a.push(addr.charAt(i));
      }
    } else if (n === '1') {
      for (let a of addrs) {
        a.push('1');
      }
    } else {
      let len = addrs.length;
      for (let i = 0; i < len; ++i) {
        let a = addrs[i];
        let copy = [...a];
        copy.push('0');
        addrs.push(copy);
        a.push('1');
      }
    }
  }
  return addrs.map(a => Number.parseInt(a.join(''), 2));
}

export async function solve(): Promise<number> {
  const lines = await readlines('./data/14.txt');
  const program: Instruction[] = lines.map(parseLine);

  // Part 1:
  // return part1(program);

  // Part 2:
  return part2(program);
}
