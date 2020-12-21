export function parseGrid<T>(lines: string[], mapFn: (value: string) => T): T[][] {
  return lines.map((row) => [...row].map(mapFn));
}

/** Reverses each row. */
export function flipGrid(grid: number[][]): number[][] {
  return grid.map(row => [...row].reverse());
}

/** Rotates the grid 90 degrees clockwise. */
export function rotateGrid(grid: number[][]): number[][] {
  return grid[0].map((p, pi) => grid.map(row => row[pi]).reverse());
}

export function gridToString(grid: number[][], mapFn: (value: number) => string) {
  let output = '';
  grid.forEach((row) => {
    output += row.map(mapFn).join('') + '\n';
  });
  return output;
}
