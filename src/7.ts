import readlines from './util/readlines';

interface Bags {
  bag: string;
  n: number;
}

function parseLine(line: string): [string, Bags[]] {
  let [fromBag, toBags] = line.split('contain');
  fromBag = fromBag.replace('bags', '').trim();

  toBags = toBags.replace('.', '').trim();
  if (toBags === 'no other bags') {
    return [fromBag, []];
  }

  return [fromBag, toBags.split(',')
    .map(s => s.replace('bags', ''))
    .map(s => s.replace('bag', '')).map(s => s.trim()).map(s => {
      let parts = s.split(' ');
      const n = Number(parts[0].trim());
      parts.shift();
      return {n, bag: parts.join(' ')};
  })];
}

/** Returns a forwards map from bag name to contained bags and quantities. */
function forwardsMap(pairs: [string, Bags[]][]): Map<string, Bags[]> {
  const result = new Map();
  pairs.forEach(pair => {
    let fromBag = pair[0];
    result.set(fromBag, pair[1]);
  });
  return result;
}

/** Returns a backwards map from bag name to containing bag names. */
function backwardsMap(pairs: [string, Bags[]][]): Map<string, string[]> {
  const result = new Map();
  pairs.forEach(pair => {
    let toBag = pair[0];
    pair[1].forEach(bag => {
      let toBags = result.get(bag.bag);
      if (!toBags) {
        toBags = [];
        result.set(bag.bag, toBags);
      }
      toBags.push(toBag);
    });
  });
  return result;
}

/** bfs over all containing bags. */
function pathsToBag(bag: string, m: Map<string, string[]>): number {
  const added = new Set();
  let q = [...m.get(bag)];
  while (q.length != 0) {
    let currBag = q.shift()!;
    added.add(currBag);
    let next = m.get(currBag);
    if (next) {
      next.forEach(b => { q.push(b); });
    }
  }
  return added.size;
}

/** bfs over all contained bags, keeping track of quantities. */
function totalBags(bag: string, m: Map<string, Bags[]>): number {
  let total = 0;
  let q = [...m.get(bag)];
  while (q.length != 0) {
    let currBag = q.shift()!;
    total += currBag.n;
    let next = m.get(currBag.bag);
    if (next) {
      next.forEach(b => { q.push({bag: b.bag, n: currBag.n * b.n}); });
    }
  }
  return total;
}

export async function solve(): Promise<number> {
  const lines = await readlines('./data/7.txt');
  const pairs: [string, Bags[]][] = lines.map(parseLine);

  // Part 1:
  // return pathsToBag('shiny gold', backwardsMap(pairs));

  // Part 2:
  const graph: Map<string, Bags[]> = forwardsMap(pairs);
  return totalBags('shiny gold', forwardsMap(pairs));
}
