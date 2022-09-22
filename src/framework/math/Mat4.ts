import Vec2 from "./Vec2";

type Construct = [
  number, number, number, number,
  number, number, number, number,
  number, number, number, number,
  number, number, number, number,
];

class Mat4 extends Array<number> {
  static _temp: Mat4 = Mat4.empty();
  static _temp_transform: Mat4 = Mat4.empty();

  constructor(...items: Construct) {
    super(9);
    Mat4.set(this, ...items)
    return this;
  }

  static empty() {
    return new Mat4(
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0
    );
  }

  static identity(target: Mat4) {
    Mat4.set(target,
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    );
  }

  static copy(target: Mat4, mat: Mat4) {
    target[0] = mat[0];
    target[1] = mat[1];
    target[2] = mat[2];
    target[3] = mat[3];
    target[4] = mat[4];
    target[5] = mat[5];
    target[6] = mat[6];
    target[7] = mat[7];
    target[8] = mat[8];
    target[9] = mat[9];
    target[10] = mat[10];
    target[11] = mat[11];
    target[12] = mat[12];
    target[13] = mat[13];
    target[14] = mat[14];
    target[15] = mat[15];
  }

  static set(target: Mat4, ...items: Construct) {
    target[0] = items[0];
    target[1] = items[1];
    target[2] = items[2];
    target[3] = items[3];
    target[4] = items[4];
    target[5] = items[5];
    target[6] = items[6];
    target[7] = items[7];
    target[8] = items[8];
    target[9] = items[9];
    target[10] = items[10];
    target[11] = items[11];
    target[12] = items[12];
    target[13] = items[13];
    target[14] = items[14];
    target[15] = items[15];  }

  static translate(target: Mat4, v: Vec2) {
    Mat4.identity(Mat4._temp_transform);

    Mat4._temp_transform[12] = v.x;
    Mat4._temp_transform[13] = v.y;
    Mat4._temp_transform[14] = 0;

    Mat4.multiply(target, Mat4._temp_transform)
  }

  static rotate(target: Mat4, rad: number) {
    Mat4.identity(Mat4._temp_transform);
    let s = Math.sin(rad);
    let c = Math.cos(rad);    

    Mat4._temp_transform[0] = c;
    Mat4._temp_transform[1] = -s;
    Mat4._temp_transform[4] = s;
    Mat4._temp_transform[5] = c;

    Mat4.multiply(target, Mat4._temp_transform);
  }

  static scale(target: Mat4, v: Vec2) {
    Mat4.identity(Mat4._temp_transform);

    Mat4._temp_transform[0] = v.x;
    Mat4._temp_transform[5] = v.y;

    Mat4.multiply(target, Mat4._temp_transform);
  }

  static compose(rotation: number, position: Vec2, scale: Vec2, output = Mat4.empty()) {
    Mat4.identity(output);
    
    Mat4.scale(output, scale);
    Mat4.rotate(output, rotation);
    Mat4.translate(output, position);
    
    return output;
  }

  static multiply(target: Mat4, source: Mat4, output = target) {
    Mat4.copy(Mat4._temp, target);
    output[0] = source[0] * Mat4._temp[0] + source[1] * Mat4._temp[4] + source[2] * Mat4._temp[8] + source[3] * Mat4._temp[12];
    output[1] = source[0] * Mat4._temp[1] + source[1] * Mat4._temp[5] + source[2] * Mat4._temp[9] + source[3] * Mat4._temp[13];
    output[2] = source[0] * Mat4._temp[2] + source[1] * Mat4._temp[6] + source[2] * Mat4._temp[10] + source[3] * Mat4._temp[14];
    output[3] = source[0] * Mat4._temp[3] + source[1] * Mat4._temp[7] + source[2] * Mat4._temp[11] + source[3] * Mat4._temp[15];
    output[4] = source[4] * Mat4._temp[0] + source[5] * Mat4._temp[4] + source[6] * Mat4._temp[8] + source[7] * Mat4._temp[12];
    output[5] = source[4] * Mat4._temp[1] + source[5] * Mat4._temp[5] + source[6] * Mat4._temp[9] + source[7] * Mat4._temp[13];
    output[6] = source[4] * Mat4._temp[2] + source[5] * Mat4._temp[6] + source[6] * Mat4._temp[10] + source[7] * Mat4._temp[14];
    output[7] = source[4] * Mat4._temp[3] + source[5] * Mat4._temp[7] + source[6] * Mat4._temp[11] + source[7] * Mat4._temp[15];
    output[8] = source[8] * Mat4._temp[0] + source[9] * Mat4._temp[4] + source[10] * Mat4._temp[8] + source[11] * Mat4._temp[12];
    output[9] = source[8] * Mat4._temp[1]+ source[9] * Mat4._temp[5] + source[10] * Mat4._temp[9]+ source[11] * Mat4._temp[13];
    output[10] = source[8] * Mat4._temp[2] + source[9] *Mat4._temp[6] + source[10] * Mat4._temp[10] + source[11] * Mat4._temp[14];
    output[11] = source[8] * Mat4._temp[3] + source[9] *Mat4._temp[7] + source[10] * Mat4._temp[11] + source[11] * Mat4._temp[15];
    output[12] = source[12] * Mat4._temp[0] + source[13] * Mat4._temp[4] + source[14] * Mat4._temp[8] + source[15] * Mat4._temp[12];
    output[13] = source[12] * Mat4._temp[1] + source[13] * Mat4._temp[5] + source[14] * Mat4._temp[9] + source[15] * Mat4._temp[13];
    output[14] = source[12] * Mat4._temp[2] + source[13] * Mat4._temp[6] + source[14] * Mat4._temp[10] + source[15] * Mat4._temp[14];
    output[15] = source[12] * Mat4._temp[3] + source[13] * Mat4._temp[7] + source[14] * Mat4._temp[11] + source[15] * Mat4._temp[15];
  }

  static fromOrthogonal(
    { left, right, bottom, top }: { left: number, right: number, bottom: number, top: number },
    output = Mat4.empty()
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

export default Mat4;