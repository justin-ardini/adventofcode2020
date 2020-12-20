import readlines from './util/readlines';
import {sum} from './util/arrays';

function parseField(line: string): number[][] {
  const parts = line.split(': ');
  const ranges = parts[1].split(' or ');
  const pairs: number[][] = ranges.map(r => {
    const parts = r.split('-');
    return [Number(parts[0]), Number(parts[1])];
  });
  return pairs;
}

function parseTicket(line: string): number[] {
  return line.split(',').map(Number);
}

function errorRate(fields: number[][][], tickets: number[][]): number {
  return sum(tickets.map(t => sumErrors(fields, t)));
}

function sumErrors(fields: number[][][], ticket: number[]): number {
  return sum(ticket.map(t => errorValue(fields, t)));
}

function errorValue(fields: number[][][], n: number): number {
  for (let f of fields) {
    if (isValid(f, n)) {
      return 0;
    }
  }
  return n;
}

function isValid(field: number[][], n: number) {
  for (let r of field) {
    if (n >= r[0] && n <= r[1]) {
      return true;
    }
  }
  return false;
}

function part2(fields: number[][][], tickets: number[][]): number {
  tickets = filterErrors(fields, tickets);
  let possible: number[][] = [];
  for (let i = 0; i < fields.length; ++i) {
    possible.push([]);
    let ns = tickets.map(t => t[i]);
    for (let j = 0; j < fields.length; ++j) {
      let field = fields[j];
      if (tryField(field, ns)) {
        possible[i].push(j);
      }
    }
  }
  let nToIndex: Map<number, number> = new Map();
  for (let i = 0; i < fields.length; ++i) {
    let [n, ni] = narrow(possible, nToIndex);
    if (n >= 0) {
      nToIndex.set(n, ni);
    }
  }

  const yourTicket = tickets[tickets.length - 1];
  return sumDepartures(yourTicket, possible.map(f => f[0]));
}

function narrow(possible: number[][], nToIndex: Map<number, number>): [number, number] {
  let n = -1;
  let ni = -1;
  for (let i = 0; i < possible.length; ++i) {
    if (possible[i].length === 1 && !nToIndex.has(possible[i][0])) {
      n = possible[i][0];
      ni = i;
    }
  }
  if (n >= 0) {
    for (let i = 0; i < possible.length; ++i) {
      if (i === ni) {
        continue;
      }
      possible[i] = possible[i].filter(p => p !== n);
    }
  }
  return [n, ni];
}

function filterErrors(fields: number[][][], tickets: number[][]): number[][] {
  return tickets.filter(t => ticketIsValid(fields, t));
}

function ticketIsValid(fields: number[][][], ticket: number[]): boolean {
  return ticket.every(n => {
    for (let f of fields) {
      if (isValid(f, n)) {
        return true;
      }
    }
    return false;
  });
}

function tryField(field: number[][], ns: number[]): boolean {
  return ns.every(n => isValid(field, n));
}

function sumDepartures(ticket: number[], orderedFields: number[]) {
  let total = 1;
  for (let i = 0; i < ticket.length; ++i) {
    let field = orderedFields[i];
    // First 6 fields have 'Departure'.
    if (field < 6) {
      total *= ticket[i];
    }
  }
  return total;
}

export async function solve(): Promise<number> {
  const lines = await readlines('./data/16.txt');
  const fieldsEnd = lines.indexOf('');
  const fields: number[][][] = lines.slice(0, fieldsEnd).map(parseField);
  const yourTicket = lines.slice(fieldsEnd + 2, fieldsEnd + 3).map(parseTicket);
  const nearbyTickets = lines.slice(fieldsEnd + 5).map(parseTicket);

  // Part 1:
  // return errorRate(fields, nearbyTickets);

  // Part 2:
  return part2(fields, nearbyTickets.concat(yourTicket));
}
