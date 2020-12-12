import readlines from './util/readlines';
import Vec2d from './util/vec2d';

enum Action {
  NORTH = 'N',
  SOUTH = 'S',
  EAST = 'E',
  WEST = 'W',
  LEFT = 'L',
  RIGHT = 'R',
  FORWARD = 'F',
};

enum Dir {
  EAST = 0,
  SOUTH = 90,
  WEST = 180,
  NORTH = 270,
}

function parseLine(line: string): [Action, number] {
  return [line.substring(0, 1) as Action, Number(line.substring(1))];
}

function runActions(actions: [Action, number][]): number {
  let x = 0;
  let y = 0;
  let dir = Dir.EAST;
  for (let [action, value] of actions) {
    switch (action) {
        case Action.NORTH:
          y += value;
          break;
        case Action.SOUTH:
          y -= value;
          break;
        case Action.EAST:
          x += value;
          break;
        case Action.WEST:
          x -= value;
          break;
        case Action.LEFT:  // Fallthrough
        case Action.RIGHT:
          let m = action === Action.RIGHT ? 1 : -1;
          dir = ((dir + value * m) + 360) % 360;
          break;
        case Action.FORWARD:
          switch (dir) {
            case Dir.NORTH:
              y += value;
              break;
            case Dir.SOUTH:
              y -= value;
              break;
            case Dir.EAST:
              x += value;
              break;
            case Dir.WEST:
              x -= value;
              break;
            default:
              throw Error(`Unexpected direction: ${dir}`);
          }
          break;
        default:
          throw Error(`Unexpected action: ${action}`);
    }
  }
  return Math.abs(x) + Math.abs(y);
}

function runActions2(actions: [Action, number][]): number {
  let s = new Vec2d(0, 0);
  let w = new Vec2d(10, 1);
  let dir = Dir.EAST;
  for (let [action, value] of actions) {
    switch (action) {
        case Action.NORTH:
          w = w.add(new Vec2d(0, value));
          break;
        case Action.SOUTH:
          w = w.subtract(new Vec2d(0, value));
          break;
        case Action.EAST:
          w = w.add(new Vec2d(value, 0));
          break;
        case Action.WEST:
          w = w.subtract(new Vec2d(value, 0));
          break;
        case Action.LEFT:
          w = w.rotate(-value);
          break;
        case Action.RIGHT:
          w = w.rotate(value);
          break;
        case Action.FORWARD:
          s = s.add(w.mult(value));
          break;
        default:
          throw Error(`Unexpected action: ${action}`);
    }
  }
  return s.manhattanDistance(new Vec2d(0, 0));
}

export async function solve(): Promise<number> {
  const lines = await readlines('./data/12.txt');
  let actions = lines.map(parseLine);

  // Part 1:
  // return runActions(actions);

  // Part 2:
  return runActions2(actions);
}
