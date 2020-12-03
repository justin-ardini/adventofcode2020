import readlines from './util/readlines';

class Rule {
  private constructor(private min: number, private max: number, private letter: string) {}

  static parse(s: string) {
    const [minMax, letter] = s.split(' ');
    const [min, max] = minMax.split('-');
    return new Rule(Number(min), Number(max), letter);
  }

  /** Validates that the password has [min, max] occurrences of letter. */
  validate(password: string): boolean {
    const n = [...password].map(c => c === this.letter ? 1 : 0).reduce((a, b) => a + b, 0);
    return n >= this.min && n <= this.max;
  }

  /** Validates that the password has letter at exactly one of the min and max positions. */
  validate2(password: string): boolean {
    const first = password[this.min - 1] === this.letter;
    const second = password[this.max - 1] === this.letter;
    return first && !second || !first && second;
  }
};

/** Parses a line into a rule and a raw password. */
function parseLine(line: string): [Rule, string] {
  const [ruleStr, password] = line.split(': ');
  return [Rule.parse(ruleStr), password];
}

export async function solve(): Promise<number> {
  const lines = await readlines('./data/2.txt');
  const pairs: [Rule, string][] = lines.map(parseLine);

  // Part 1:
  // return pairs.map(([r, s]) => r.validate(s)).map(v => v ? 1 : 0).reduce((a, b) => a + b, 0);

  // Part 2:
  return pairs.map(([r, s]) => r.validate2(s)).map(v => v ? 1 : 0).reduce((a, b) => a + b, 0);
}
