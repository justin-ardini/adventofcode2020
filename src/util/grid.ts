export default function parseGrid<T>(lines: string[], mapFn: (line: string) => T): T[][] {
  return lines.map((row) => [...row].map(mapFn));
}
