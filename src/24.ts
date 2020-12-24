import readlines from './util/readlines';

class Hex {
  constructor(private x: number, private y: number, private z: number) {}

  add(other: Hex): Hex {
    return new Hex(this.x + other.x, this.y + other.y, this.z + other.z);
  }

  neighbor(dir: number): Hex {
    return this.add(hexDirs[dir]);
  }

  copy() {
    return new Hex(this.x, this.y, this.z);
  }

  toString(): string {
    return `${this.x},${this.y},${this.z}`;
  }

  static fromString(s: string): Hex {
    let [x, y, z] = s.split(',').map(Number);
    return new Hex(x, y, z);
  }
}

/** Clockwise order. */
const hexDirs: Hex[] = [
    new Hex(1, 0, -1), new Hex(1, -1, 0), new Hex(0, -1, 1),
    new Hex(-1, 0, 1), new Hex(-1, 1, 0), new Hex(0, 1, -1)
];


class HexMap {
  private readonly map: Map<string, boolean> = new Map();

  get(hex: Hex): boolean|undefined {
    return this.map.get(hex.toString());
  }

  set(hex: Hex, flipped: boolean): HexMap {
    this.map.set(hex.toString(), flipped);
    return this;
  }

  has(hex: Hex): boolean {
    return this.map.has(hex.toString());
  }

  keys(): Hex[] {
    return Array.from(this.map.keys()).map(Hex.fromString);
  }

  values(): boolean[] {
    return Array.from(this.map.values());
  }
}

const dirMap: {[key: string]: Hex} = {
  'ne': hexDirs[0],
  'e': hexDirs[1],
  'se': hexDirs[2],
  'sw': hexDirs[3],
  'w': hexDirs[4],
  'nw': hexDirs[5],
};

function parseLine(line: string): Hex[] {
  let chars = [...line];
  let dirs: Hex[] = [];
  for (let i = 0; i < chars.length; ++i) {
    let c = chars[i];
    if (c === 'e' || c === 'w') {
      dirs.push(dirMap[c]);
    } else {
      dirs.push(dirMap[c + chars[i + 1]]);
      ++i;
    }
  }
  return dirs;
}

function fillGrid(dirs: Hex[][]): HexMap {
  const hexes: HexMap = new HexMap();
  let start = new Hex(0, 0, 0);
  hexes.set(start, false);
  for (let line of dirs) {
    let curr = start;
    for (let dir of line) {
      curr = curr.add(dir);
    }
    let flipped = hexes.get(curr) || false;
    hexes.set(curr, !flipped);
  }
  return hexes;
}

function countFlipped(hexes: HexMap): number {
  return hexes.values().filter(flipped => flipped).length;
}

function runSim(hexes: HexMap): HexMap {
  let grid = hexes;
  for (let i = 0; i < 100; ++i) {
    grid = runStep(grid);
  }
  return grid;
}

function runStep(hexes: HexMap): HexMap {
  let keys = hexes.keys();
  let next = new HexMap();

  for (let hex of keys) {
    let [count, neighbors] = flippedNeighbors(hexes, hex);
    let flipped = hexes.get(hex) || false;
    setFlip(next, hex, flipped, count);
    for (let neighbor of neighbors) {
      let [nCount, _] = flippedNeighbors(hexes, neighbor);
      let nFlipped = hexes.get(neighbor) || false;
      setFlip(next, neighbor, nFlipped, nCount);
    }
  }
  return next;
}

function flippedNeighbors(hexes: HexMap, hex: Hex): [number, Hex[]] {
  let count = 0;
  let neighbors: Hex[] = [];
  for (let i = 0; i < 6; ++i) {
    neighbors.push(hex.neighbor(i));
    let flipped = hexes.get(neighbors[i]) || false;
    if (flipped) {
      ++count;
    }
  }
  return [count, neighbors];
}

function setFlip(hexes: HexMap, hex: Hex, flipped: boolean, nFlipped: number) {
  if (flipped && (nFlipped === 0 || nFlipped > 2)) {
    hexes.set(hex, false);
  } else if (!flipped && nFlipped === 2) {
    hexes.set(hex, true);
  } else {
    hexes.set(hex, flipped);
  }
}

export async function solve(): Promise<number> {
  const lines = await readlines('./data/24s.txt');
  const dirs: Hex[][] = lines.map(parseLine);
  const hexGrid = fillGrid(dirs);

  // Part 1:
  // return countFlipped(hexGrid);

  // Part 2
  return countFlipped(runSim(hexGrid));
}
