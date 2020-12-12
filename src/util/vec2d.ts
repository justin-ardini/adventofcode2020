export default class Vec2d {
  constructor(public x: number, public y: number) {}

  add(v: Vec2d): Vec2d {
    return new Vec2d(this.x + v.x, this.y + v.y);
  }

  subtract(v: Vec2d): Vec2d {
    return new Vec2d(this.x - v.x, this.y - v.y);
  }

  mult(s: number): Vec2d {
    return new Vec2d(this.x * s, this.y * s);
  }

  /* Clockwise rotation */
  rotate(degrees: number): Vec2d {
    const r = -degrees * Math.PI / 180;
    const cosr = Math.cos(r);
    const sinr = Math.sin(r);
    return new Vec2d(
      Math.round(1e6 * (this.x * cosr - this.y * sinr)) / 1e6,
      Math.round(1e6 * (this.x * sinr + this.y * cosr)) / 1e6);
  }

  manhattanDistance(v: Vec2d): number {
    return Math.abs(this.x - v.x) + Math.abs(this.y - v.y);
  }

  copy(): Vec2d {
    return new Vec2d(this.x, this.y);
  }

  toString(): string {
    return `${this.x},${this.y}`;
  }

  /** Assumes "x,y" input, no validation. */
  static fromString(s: string): Vec2d {
    return Vec2d.fromArr(s.split(',').map(Number) as [number, number]);
  }

  static fromArr([x, y]: [number, number]): Vec2d {
    return new Vec2d(x, y);
  }
}
