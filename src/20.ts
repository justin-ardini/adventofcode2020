import readlines from './util/readlines';
import {product, sumRec} from './util/arrays';
import {flipGrid, parseGrid, rotateGrid} from './util/grids';

enum Flip {
  FRONT = 0,
  BACK = 1,
}

type Tile = {
  id: number;
  idx: number;
  pixels: number[][];
  edges: Map<Flip, number[][]>;
  edgeMatches?: Map<Flip, Map<number, EdgeRef[]>>;
  rotation?: number;
  flip?: Flip;
}

type EdgeRef = {
  tileIdx: number;
  flip: Flip;
  edgeIdx: number;
}

function parseTiles(lines: string[]): Tile[] {
  const tiles = [];
  let tileStart = 0;
  let idx = 0;
  while (tileStart < lines.length - 1) {
    let tileEnd = lines.indexOf('', tileStart);
    tiles.push(parseTile(lines.slice(tileStart, tileEnd), idx));
    tileStart = tileEnd + 1;
    ++idx;
  }
  return tiles;
}

function parseTile(lines: string[], idx: number): Tile {
  const idStr = lines[0].split(' ')[1];
  const id = Number(idStr.slice(0, idStr.length - 1));  // Strip :

  lines = lines.slice(1);
  const pixels = parseGrid(lines, pixel => pixel === '#' ? 1 : 0);
  // NESW order.
  const edges = new Map();
  edges.set(Flip.FRONT,
    [
      [...pixels[0]],
      pixels.map(r => r[r.length - 1]),
      [...pixels[pixels.length - 1]].reverse(),
      pixels.map(r => r[0]).reverse(),
    ]);
  edges.set(Flip.BACK,
    [
      [...pixels[0]].reverse(),
      pixels.map(r => r[0]),
      [...pixels[pixels.length - 1]],
      pixels.map(r => r[r.length - 1]).reverse(),
    ]);

  return {
    id,
    idx,
    pixels,
    edges,
  };
}

type SortedTiles = {
  corners: Tile[];
  borders: Tile[];
  inners: Tile[];
}

function sortTiles(tiles: Tile[]): SortedTiles {
  let corners = [];
  let borders = [];
  let inners = [];
  for (let i = 0; i < tiles.length; ++i) {
    let tile = tiles[i];
    let matches: Map<Flip, Map<number, EdgeRef[]>> = new Map();
    for (let j = 0; j < tiles.length; ++j) {
      if (i === j) {
        continue;
      }
      let edgesA = tile.edges;
      let edgesB = tiles[j].edges;
      matchEdges(edgesA, edgesB, j, matches);
    }
    if (numMatches(matches) === 4) {
      corners.push(tile);
    } else if (numMatches(matches) === 6) {
      borders.push(tile);
    } else {
      inners.push(tile);
    }
    tile.edgeMatches = matches;
  }
  return {
    corners, borders, inners,
  };
}

function numMatches(matches: Map<Flip, Map<number, EdgeRef[]>>): number {
  let i = 0;
  for (let subMap of matches.values()) {
    i += subMap.size;
  }
  return i;
}

function matchEdges(edgesA: Map<Flip, number[][]>, edgesB: Map<Flip, number[][]>, tileB: number, matches: Map<Flip, Map<number, EdgeRef[]>>) {
  for (let k = 0; k < 2; ++k) {
    let flipA = edgesA.get(k);
    for (let l = 0; l < 2; ++l) {
      let flipB = edgesB.get(l);
      for (let i = 0; i < flipA.length; ++i) {
        let pixelsA = flipA[i];
        let last = pixelsA.length - 1;
        for (let j = 0; j < flipB.length; ++j) {
          let pixelsB = flipB[j];
          if (pixelsA.every((p, pi) => p === pixelsB[last - pi])) {
            let subMap = matches.get(k);
            if (!subMap) {
              subMap = new Map();
              matches.set(k, subMap);
            }
            let refs = subMap.get(i);
            if (!refs) {
              refs = [];
              subMap.set(i, refs);
            }
            refs.push({tileIdx: tileB, edgeIdx: j, flip: l});
          }
        }
      }
    }
  }
}

function buildImage(tiles: Tile[], sortedTiles: SortedTiles): number[][] {
  const numTiles = sortedTiles.corners.length + sortedTiles.borders.length + sortedTiles.inners.length;
  const tilesPerRow = Math.sqrt(numTiles);
  const grid = placeTiles(tiles, sortedTiles);
  return stripEdges(rotateTiles(grid));
}

enum Dir {
  NORTH = 0,
  EAST = 1,
  SOUTH = 2,
  WEST = 3,
};

function placeTiles(tiles: Tile[], sortedTiles: SortedTiles): Tile[][] {
  // Top-left corner
  const corner = sortedTiles.corners[0];
  corner.flip = Flip.FRONT;
  corner.rotation = getStartRotation(corner.edgeMatches.get(corner.flip), [1, 2]);
  let grid: Tile[][] = [[corner]];
  let sideLength = Math.sqrt(tiles.length);

  // Top row
  for (let col = 1; col < sideLength; ++col) {
    let westNeighbor = grid[0][col - 1];
    let tile = nextTile(tiles, westNeighbor, Dir.EAST);
    grid[0].push(tile);
  }

  // All other rows
  for (let row = 1; row < sideLength; ++row) {
    let rowTiles: Tile[] = [];
    grid.push(rowTiles);
    for (let col = 0; col < sideLength; ++col) {
      let northNeighbor = grid[row - 1][col];
      let tile = nextTile(tiles, northNeighbor, Dir.SOUTH);
      rowTiles.push(tile);
    }
  }
  return grid;
}

function nextTile(tiles: Tile[], tile: Tile, dir: Dir): Tile {
  let edgeMatches = tile.edgeMatches.get(tile.flip);
  let nextRef = edgeMatches.get((4 + dir - tile.rotation) % 4)[0];
  let nextTile = tiles[nextRef.tileIdx];
  nextTile.rotation = (6 + dir - nextRef.edgeIdx) % 4;
  nextTile.flip = nextRef.flip;
  return nextTile;
}

function getStartRotation(edgeMatches: Map<number, EdgeRef[]>, expected: number[]) {
  if (edgeMatches.has(0) && edgeMatches.has(1)) {
    return expected[0];
  }
  if (edgeMatches.has(1) && edgeMatches.has(2)) {
    return (expected[0] + 3) % 4;
  }
  if (edgeMatches.has(2) && edgeMatches.has(3)) {
    return (expected[0] + 2) % 4;
  }
  if (edgeMatches.has(3) && edgeMatches.has(1)) {
    return (expected[0] + 1) % 4;
  }
}

function rotateTiles(tiles: Tile[][]): Tile[][] {
  for (let row = 0; row < tiles.length; ++row) {
    for (let col = 0; col < tiles[0].length; ++col) {
      let tile = tiles[row][col];
      if (tile.flip === Flip.BACK) {
        tile.pixels = flipGrid(tile.pixels);
      }
      for (let i = 0; i < tile.rotation; ++i) {
        tile.pixels = rotateGrid(tile.pixels);
      }
    }
  }
  return tiles;
}

function stripEdges(tiles: Tile[][]): number[][] {
  const tileSize = tiles[0][0].pixels.length;
  const strippedSize = tileSize - 2;
  const tilesPerRow = tiles.length;
  let image: number[][] = [];
  for (let x = 0; x < tilesPerRow * strippedSize; ++x) {
    let row: number[] = [];
    image.push(row);
    for (let y = 0; y < tilesPerRow; ++y) {
      let tile = tiles[Math.floor(x / strippedSize)][y];
      for (let ty = 1; ty < tileSize - 1; ++ty) {
        row.push(tile.pixels[(x % strippedSize) + 1][ty]);
      }
    }
  }
  return image;
}

const MONSTER = [
  [...'..................#.'],
  [...'#....##....##....###'],
  [...'.#..#..#..#..#..#...']];

function countRoughness(image: number[][]): number {
  let monsters = 0;
  for (let row = 0; row < image.length - MONSTER.length; ++row) {
    for (let col = 0; col < image[0].length - MONSTER[0].length; ++col) {
      markMonster(image, row, col);
    }
  }
  return sumRec(image.map(row => row.map(v => v === 1 ? 1 : 0)));
}

/** Marks monster tiles as a special value (2). */
function markMonster(image: number[][], row: number, col: number) {
  for (let i = 0; i < MONSTER.length; ++i) {
    for (let j = 0; j < MONSTER[i].length; ++j) {
      const monsterTile = MONSTER[i][j];
      if (monsterTile === '.') {
        continue;
      }
      if (image[row + i][col + j] === 0) {
        return;
      }
    }
  }
  // Confirmed, mark tiles as such.
  for (let i = 0; i < MONSTER.length; ++i) {
    for (let j = 0; j < MONSTER[i].length; ++j) {
      const monsterTile = MONSTER[i][j];
      if (monsterTile === '.') {
        continue;
      }
      image[row + i][col + j] = 2;
    }
  }
}

export async function solve(): Promise<number> {
  const lines = await readlines('./data/20.txt');
  const tiles = parseTiles(lines);
  const sortedTiles = sortTiles(tiles);

  // Part 1:
  // return product(sortedTiles.corners.map(t => t.id));

  // Part 2
  let image = buildImage(tiles, sortedTiles);
  // Different inputs may require different rotations/flips to minimize roughness.
  return countRoughness(rotateGrid(flipGrid(image)));
}
