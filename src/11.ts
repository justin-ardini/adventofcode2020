import readlines from './util/readlines';
import {sum} from './util/arrays';

enum Tile {
  FLOOR,
  EMPTY,
  OCCUPIED,
};

function parseLine(line: string): Tile[] {
  return [...line].map(c => c === 'L' ? Tile.EMPTY : c === '#' ? Tile.OCCUPIED : Tile.FLOOR);
}

/** Note: assumes grids of equal size. */
function equals(a: Tile[][], b: Tile[][]): boolean {
  return a.every((r, ri) => r.every((t, ci) => t === b[ri][ci]));
}

function copy(a: Tile[][]): Tile[][] {
  return a.map(r => [...r]);
}

function runSim(tiles: Tile[][], stepFn: (tiles: Tile[][]) => Tile[][]): Tile[][] {
  let next = tiles;
  let curr;
  do {
    curr = next;
    next = stepFn(curr);
  } while (!equals(curr, next));
  return next;
}

function runStep(curr: Tile[][]): Tile[][] {
  const next = copy(curr);
  for (let r = 0; r < curr.length; ++r) {
    for (let c = 0; c < curr[r].length; ++c) {
      const tile = curr[r][c];
      const adj = [curr[r - 1]?.[c - 1],
        curr[r - 1]?.[c],
        curr[r - 1]?.[c + 1],
        curr[r][c - 1],
        curr[r][c + 1],
        curr[r + 1]?.[c - 1],
        curr[r + 1]?.[c],
        curr[r + 1]?.[c + 1]];
      let numAdj = adj.filter(t => t === Tile.OCCUPIED).length;
      if (tile === Tile.EMPTY && numAdj === 0) {
        next[r][c] = Tile.OCCUPIED;
      } else if (tile === Tile.OCCUPIED && numAdj >= 4) {
        next[r][c] = Tile.EMPTY;
      }
    }
  }
  return next;
}

function runStep2(curr: Tile[][]): Tile[][] {
  const next = copy(curr);
  for (let r = 0; r < curr.length; ++r) {
    for (let c = 0; c < curr[r].length; ++c) {
      const tile = curr[r][c];
      const adj = [findSeat(curr, r, c, -1, -1),
        findSeat(curr, r, c, -1, 0),
        findSeat(curr, r, c, -1, 1),
        findSeat(curr, r, c, 0, -1),
        findSeat(curr, r, c, 0, 1),
        findSeat(curr, r, c, 1, -1),
        findSeat(curr, r, c, 1, 0),
        findSeat(curr, r, c, 1, 1)];
      let numAdj = adj.filter(t => t === Tile.OCCUPIED).length;
      if (tile === Tile.EMPTY && numAdj === 0) {
        next[r][c] = Tile.OCCUPIED;
      } else if (tile === Tile.OCCUPIED && numAdj >= 5) {
        next[r][c] = Tile.EMPTY;
      }
    }
  }
  return next;
}

function findSeat(tiles: Tile[][], r: number, c: number, rx: number, cx: number): Tile|null {
  let tile;
  do {
    r += rx;
    c += cx;
    tile = tiles[r]?.[c];
  } while (tile === Tile.FLOOR);
  return tile;
}

function countOccupied(tiles: Tile[][]): number {
  return sum(tiles.map(r => sum(r.map(t => t === Tile.OCCUPIED ? 1 : 0))));
}

export async function solve(): Promise<number> {
  const lines = await readlines('./data/11.txt');
  let tiles = lines.map(parseLine);

  // Part 1:
  // tiles = runSim(tiles, runStep);

  // Part 2:
  tiles = runSim(tiles, runStep2);

  return countOccupied(tiles);
}
