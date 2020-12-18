import readlines from './util/readlines';
import {sum} from './util/arrays';

type Token = '(' | ')' | '+' | '*' | number;

function scanLine(line: string): Token[] {
  const parts = line.split(' ');
  let tokens: Token[] = [];
  for (let part of parts) {
    let chars = [...part];
    while (chars[0] === '(') {
      tokens.push('(');
      chars.shift();
    }
    let endTokens: Token[] = [];
    while (chars[chars.length - 1] === ')') {
      endTokens.push(')');
      chars.pop();
    }
    if (chars.length === 1 && (chars[0] === '+' || chars[0] === '*')) {
      tokens.push(chars[0] as Token);
      chars.shift();
    }
    if (chars.length > 0) {
      tokens.push(Number(chars.join('')) as Token);
    }
    tokens = tokens.concat(endTokens);
  }
  return tokens;
}

class Add {
  constructor(readonly lhs: Expr, readonly rhs: Expr) {}
}

class Mult {
  constructor(readonly lhs: Expr, readonly rhs: Expr) {}
}

class Group {
  constructor(readonly expr: Expr) {}
}

class Value {
  constructor(readonly value: number) {}
}

type Expr = Add | Mult | Group | Value;

// Expr = Op
// Op = Primary ((+ | *) Primary)*
// Primary = Group | number
class Parser {
  private curr = 0;
  private addFirst = false;
  constructor(private readonly tokens: Token[]) {}

  parse(addFirst = false): Expr {
    this.addFirst = addFirst;
    return this.expr();
  }

  private expr(): Expr {
    return this.addFirst ? this.mult() : this.op();
  }

  private op(): Expr {
    let expr = this.primary();

    while (this.match('+') || this.match('*')) {
      const op = this.tokens[this.curr - 1];
      if (op === '+') {
        expr = new Add(expr, this.primary());
      } else {
        expr = new Mult(expr, this.primary());
      }
    }

    return expr;
  }

  private mult(): Expr {
    let expr = this.add();

    while (this.match('*')) {
      expr = new Mult(expr, this.add());
    }

    return expr;
  }

  private add(): Expr {
    let expr = this.primary();

    while (this.match('+')) {
      expr = new Add(expr, this.primary());
    }

    return expr;
  }

  private primary(): Expr {
    if (this.match('(')) {
      let expr = this.expr();
      if (this.match(')')) {
        return new Group(expr);
      }
      throw Error('Invalid group');
    }
    ++this.curr;
    return new Value(this.tokens[this.curr - 1] as number);
  }

  private match(expected: Token): boolean {
    if (this.tokens[this.curr] === expected) {
      ++this.curr;
      return true;
    }
    return false;
  }
}

function evaluate(expr: Expr): number {
  if (expr instanceof Group) {
    return evaluate(expr.expr);
  } else if (expr instanceof Mult) {
    return evaluate(expr.lhs) * evaluate(expr.rhs);
  } else if (expr instanceof Add) {
    return evaluate(expr.lhs) + evaluate(expr.rhs);
  } else if (expr instanceof Value) {
    return expr.value;
  }
  throw Error('Invalid eval type');
}

export async function solve(): Promise<number> {
  const lines = await readlines('./data/18.txt');
  const tokens: Token[][] = lines.map(scanLine);

  // Part 1:
  // const exprs = tokens.map(t => new Parser(t).parse(false));

  // Part 2:
  const exprs = tokens.map(t => new Parser(t).parse(true));

  return sum(exprs.map(expr => evaluate(expr)));
}
