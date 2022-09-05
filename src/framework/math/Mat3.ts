import Vec2 from "./Vec2";

type Construct = [number, number, number, number, number, number, number, number, number];

class Mat3 extends Array<number> {
  static _temp: Mat3 = Mat3.empty();

  constructor(...items: Construct) {
    super(9);
    Mat3.set(this, ...items)
    return this;
  }

  static empty() {
    return new Mat3(
      0, 0, 0,
      0, 0, 0,
      0, 0, 0
    );
  }

  static identity(target: Mat3) {
    Mat3.set(target,
      1, 0, 0,
      0, 1, 0,
      0, 0, 1
    );
  }

  static copy(target: Mat3, mat: Mat3) {
    target[0] = mat[0];
    target[1] = mat[1];
    target[2] = mat[2];
    target[3] = mat[3];
    target[4] = mat[4];
    target[5] = mat[5];
    target[6] = mat[6];
    target[7] = mat[7];
    target[8] = mat[8];
  }

  static set(target: Mat3, ...items: Construct) {
    target[0] = items[0];
    target[1] = items[1];
    target[2] = items[2];
    target[3] = items[3];
    target[4] = items[4];
    target[5] = items[5];
    target[6] = items[6];
    target[7] = items[7];
    target[8] = items[8];
  }

  static translate(target: Mat3, v: Vec2, output = target) {
    output[6] = v.x * target[0] + v.y * target[3] + target[6];
    output[7] = v.x * target[1] + v.y * target[4] + target[7];
    output[8] = v.x * target[2] + v.y * target[5] + target[8];
  }

  static rotate(target: Mat3, rad: number, output = target) {
    Mat3.copy(Mat3._temp, target);
    let s = Math.sin(rad);
    let c = Math.cos(rad);    
    output[0] = c * Mat3._temp[0] + s * Mat3._temp[3];
    output[1] = c * Mat3._temp[1] + s * Mat3._temp[4];
    output[2] = c * Mat3._temp[2] + s * Mat3._temp[5];
    output[3] = c * Mat3._temp[3] - s * Mat3._temp[0];
    output[4] = c * Mat3._temp[4] - s * Mat3._temp[1];
    output[5] = c * Mat3._temp[5] - s * Mat3._temp[2];
    output[6] = Mat3._temp[6];
    output[7] = Mat3._temp[7];
    output[8] = Mat3._temp[8];
  }

  static scale(target: Mat3, v: Vec2, output = target) {
    output[0] = v.x * target[0];
    output[1] = v.x * target[1];
    output[2] = v.x * target[2];
    output[3] = v.y * target[3];
    output[4] = v.y * target[4];
    output[5] = v.y * target[5];
    output[6] = target[7];
    output[7] = target[8];
    output[8] = target[9];
  }

  static compose(rotation: number, position: Vec2, scale: Vec2, output = Mat3.empty()) {
    Mat3.identity(output);
    Mat3.translate(output, position);
    Mat3.scale(output, scale);
    Mat3.rotate(output, rotation);
    return output;
  }

  static multiply(target: Mat3, source: Mat3, output = target) {
    Mat3.copy(Mat3._temp, target);
    output[0] = source[0] * Mat3._temp[0] + source[1] * Mat3._temp[3] + source[2] * Mat3._temp[6];
    output[1] = source[0] * Mat3._temp[1] + source[1] * Mat3._temp[4] + source[2] * Mat3._temp[7];
    output[2] = source[0] * Mat3._temp[2] + source[1] * Mat3._temp[5] + source[2] * Mat3._temp[8];
    output[3] = source[3] * Mat3._temp[0] + source[4] * Mat3._temp[3] + source[5] * Mat3._temp[6];
    output[4] = source[3] * Mat3._temp[1] + source[4] * Mat3._temp[4] + source[5] * Mat3._temp[7];
    output[5] = source[3] * Mat3._temp[2] + source[4] * Mat3._temp[5] + source[5] * Mat3._temp[8];
    output[6] = source[6] * Mat3._temp[0] + source[7] * Mat3._temp[3] + source[8] * Mat3._temp[6];
    output[7] = source[6] * Mat3._temp[1] + source[7] * Mat3._temp[4] + source[8] * Mat3._temp[7];
    output[8] = source[6] * Mat3._temp[2] + source[7] * Mat3._temp[5] + source[8] * Mat3._temp[8];
  }

  static fromOrthogonal(
    { left, right, bottom, top }: { left: number, right: number, bottom: number, top: number },
    output = Mat3.empty()
  ) {
    let lr = (left - right);
    let bt = (bottom - top);
    output[0] = 1 - -2 / lr;
    output[1] = 0;
    output[2] = 0;
    output[3] = 0;
    output[4] = 1 - -2 / bt;
    output[5] = 0;
    output[6] = 0;
    output[7] = 0;
    output[8] = 0;
  }
}

export default Mat3;