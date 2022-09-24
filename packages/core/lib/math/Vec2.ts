import Mat3 from "./Mat4";

class Vec2 extends Array<number> {
  constructor(x: number, y: number) {
    super(2);
    Vec2.set(this, x, y);
    return this;
  }

  get x() { return this[0]; }
  get y() { return this[1]; }

  set x(v) { this[0] = v; }
  set y(v) { this[1] = v; }

  static clone(source: Vec2): Vec2 {
    return new Vec2(source[0], source[1]);
  }

  static set(target: Vec2, x: number, y?: number) {
    target[0] = x;
    target[1] = typeof y !== 'undefined' ? y : x;
  }

  static copy(target: Vec2, source: Vec2, output = target) {
    output[0] = source[0];
    output[1] = source[1];
  }

  static add(target: Vec2, modify: Vec2, output = target) {
    output[0] += modify[0];
    output[1] += modify[1];
  }

  static sub(target: Vec2, modify: Vec2, output = target) {
    output[0] -= modify[0];
    output[1] -= modify[1];
  }

  static scale(target: Vec2, modify: Vec2, output = target) {
    output[0] *= modify[0];
    output[1] *= modify[1];
  }

  static inverse(target: Vec2, output = target) {
    output[0] = 1 / target[0];
    output[1] = 1 / target[1];
  }

  static negate(target: Vec2, output = target) {
    output[0] = -target[0];
    output[1] = -target[1];
  }

  static distance(v1: Vec2, v2: Vec2): number {
    let x = v1[0] - v2[0];
    let y = v1[1] - v2[1];
    return Math.sqrt(x * x + y * y);
  }

  static magnitude(v: Vec2): number {
    return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
  }

  static dot(v1: Vec2, v2: Vec2): number {
    return v1[0] * v2[0] + v1[1] * v2[1];
  }

  static cross(v1: Vec2, v2: Vec2): number {
    return v1[0] * v2[1] - v1[1] * v2[0];
  }

  static normalize(target: Vec2, output = target) {
    let [x, y] = target;
    let len = x * x + y * y;
    if (len > 0) {
      len = 1 / Math.sqrt(len);
    }
    output[0] = target[0] * len;
    output[1] = target[1] * len;
  }

  static lerp(from: Vec2, to: Vec2, t: number, output = from): Vec2 {
    output[0] = from[0] + t * (to[0] - from[0]);
    output[1] = from[1] + t * (to[1] - from[1]);
    return output;
  }

  static applyMatrix3(source: Vec2, mat: Mat3, output = source) {
    let [x, y] = source;
    output[0] = mat[0] * x + mat[3] * y + mat[6];
    output[1] = mat[1] * x + mat[4] * y + mat[7];
  }

  static equals(target: Vec2, check: Vec2) {
    return target[0] === check[0] && target[1] === check[1];
  }
}

export default Vec2;