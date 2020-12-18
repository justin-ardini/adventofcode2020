import readlines from './util/readlines';
import {copyRec, sumRec} from './util/arrays';

enum Tile {
  INACTIVE,
  ACTIVE,
};

function parseLine(line: string): Tile[] {
  return [...line].map(c => c === '.' ? Tile.INACTIVE : Tile.ACTIVE);
}

function buildTiles3d(start: Tile[][], steps: number): Tile[][][] {
  const tiles: Tile[][][] = [];
  let size = start.length + steps * 2;
  for (let x = 0; x < size; ++x) {
    tiles.push([]);
    for (let y = 0; y < size; ++y) {
      tiles[x].push([]);
      for (let z = 0; z < size; ++z) {
        if (z === steps) {
          tiles[x][y].push(start[x - steps]?.[y - steps] ?? Tile.INACTIVE);
        } else {
          tiles[x][y].push(Tile.INACTIVE);
        }
      }
    }
  }
  return tiles;
}

function buildTiles4d(start: Tile[][], steps: number): Tile[][][][] {
  const tiles: Tile[][][][] = [];
  let size = start.length + steps * 2;
  for (let x = 0; x < size; ++x) {
    tiles.push([]);
    for (let y = 0; y < size; ++y) {
      tiles[x].push([]);
      for (let z = 0; z < size; ++z) {
        tiles[x][y].push([]);
        for (let w = 0; w < size; ++w) {
          if (z === steps && w == steps) {
            tiles[x][y][z].push(start[x - steps]?.[y - steps] ?? Tile.INACTIVE);
          } else {
            tiles[x][y][z].push(Tile.INACTIVE);
          }
        }
      }
    }
  }
  return tiles;
}

function runSim<T>(tiles: T, steps: number, stepFn: (tiles: T) => T): T {
  let curr = tiles;
  for (let i = 0; i < steps; ++i) {
    curr = stepFn(curr);
  }
  return curr;
}

function runStep3d(curr: Tile[][][]): Tile[][][] {
  const next = copyRec(curr);
  for (let x = 0; x < curr.length; ++x) {
    for (let y = 0; y < curr[x].length; ++y) {
      for (let z = 0; z < curr[x][y].length; ++z) {
        const tile = curr[x][y][z];
        let adj = [];
        for (let xi = -1; xi <= 1; ++xi) {
          for (let yi = -1; yi <= 1; ++yi) {
            for (let zi = -1; zi <= 1; ++zi) {
              if (xi === 0 && yi ===0 && zi === 0) {
                continue;
              }
              adj.push(curr[x + xi]?.[y + yi]?.[z + zi]);
            }
          }
        }
        let numAdj = adj.filter(t => t === Tile.ACTIVE).length;
        if (tile === Tile.ACTIVE && (numAdj < 2 || numAdj > 3)) {
          next[x][y][z] = Tile.INACTIVE;
        } else if (tile === Tile.INACTIVE && numAdj === 3) {
          next[x][y][z] = Tile.ACTIVE;
        }
      }
    }
  }
  return next;
}

function runStep4d(curr: Tile[][][][]): Tile[][][][] {
  const next = copyRec(curr);
  for (let x = 0; x < curr.length; ++x) {
    for (let y = 0; y < curr[x].length; ++y) {
      for (let z = 0; z < curr[x][y].length; ++z) {
        for (let w = 0; w < curr[x][y][z].length; ++w) {
          const tile = curr[x][y][z][w];
          let adj = [];
          for (let xi = -1; xi <= 1; ++xi) {
            for (let yi = -1; yi <= 1; ++yi) {
              for (let zi = -1; zi <= 1; ++zi) {
                for (let wi = -1; wi <= 1; ++wi) {
                  if (xi === 0 && yi ===0 && zi === 0 && wi === 0) {
                    continue;
                  }
                  adj.push(curr[x + xi]?.[y + yi]?.[z + zi]?.[w + wi]);
                }
              }
            }
          }
          let numAdj = adj.filter(t => t === Tile.ACTIVE).length;
          if (tile === Tile.ACTIVE && (numAdj < 2 || numAdj > 3)) {
            next[x][y][z][w] = Tile.INACTIVE;
          } else if (tile === Tile.INACTIVE && numAdj === 3) {
            next[x][y][z][w] = Tile.ACTIVE;
          }
        }
      }
    }
  }
  return next;
}

function countActive(tiles: Tile[][][]): number {
  let total = 0;
  for (let x = 0; x < tiles.length; ++x) {
    for (let y = 0; y < tiles[x].length; ++y) {
      for (let z = 0; z < tiles[x][y].length; ++z) {
        if (tiles[x][y][z] === Tile.ACTIVE) {
          ++total;
        }
      }
    }
  }
  return total;
}

function countActive4d(tiles: Tile[][][][]): number {
  let total = 0;
  for (let x = 0; x < tiles.length; ++x) {
    for (let y = 0; y < tiles[x].length; ++y) {
      for (let z = 0; z < tiles[x][y].length; ++z) {
        for (let w = 0; w < tiles[x][y][z].length; ++w) {
          if (tiles[x][y][z][w] === Tile.ACTIVE) {
            ++total;
          }
        }
      }
    }
  }
  return total;
}

export async function solve(): Promise<number> {
  const lines = await readlines('./data/17.txt');
  const start: Tile[][] = lines.map(parseLine);
  const steps = 6;

  // Part 1:
  // const tiles = buildTiles3d(start, steps);
  // const stepFn = runStep3d;

  // Part 2:
  const tiles = buildTiles4d(start, steps);
  const stepFn = runStep4d;

  return sumRec(runSim(tiles, steps, stepFn));
}
