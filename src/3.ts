import readlines from './util/readlines';

/** Counts the number of trees along the given slope. */
function countTrees(grid: boolean[][], right: number, down: number): number {
  let numTrees = 0;
  let c = 0;
  for (let r = 0; r < grid.length; r += down) {
    if (grid[r][c % grid[r].length]) {
      ++numTrees;
    }
    c += right;
  }
  return numTrees;
}

export async function solve(): Promise<number> {
  const lines = await readlines('./data/3.txt');
  let grid: boolean[][] = [];  // true === tree
  for (let line of lines) {
    let row: boolean[] = [];
    for (let c = 0; c < line.length; ++c) {
      let v = line[c] === '#';
      row.push(v);
    }
    grid.push(row);
  }

  // Part 1:
  // return countTrees(grid, 3, 1);

  // Part 2:
  return countTrees(grid, 1, 1) *
      countTrees(grid, 3, 1) *
      countTrees(grid, 5, 1) *
      countTrees(grid, 7, 1) *
      countTrees(grid, 1, 2);
}