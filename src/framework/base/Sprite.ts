import Entity from "../core/Entity";
import { createProgram, getUniformLocations, getAttributeLocations } from "../utils/Program";

class Sprite extends Entity {
  vertexBuffer: WebGLBuffer;
  program: WebGLProgram;
  locations: {
    uniforms: Map<string, number>,
    attributes: Map<string, number>
  };

  constructor(gl: WebGL2RenderingContext) {
    super();

    this.program = createProgram(gl, {
      vertex: `
        attribute vec2 position;
        uniform mat3 uModelMatrix;

        void main() {
          gl_Position = vec4(
            modelMatrix * vec3(position, 0),
            0
          );
        }
      `,
      fragment: `
        void main() {
          gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
        }
      `
    });

    this.locations = {
      uniforms: getUniformLocations(gl, this.program),
      attributes: getAttributeLocations(gl, this.program),
    }

    const geometry = new Float32Array([
      0, 0,
      0, 1,
      1, 0,
      1, 0,
      0, 1,
      1, 1,
    ]);

    const buffer = gl.createBuffer();
    if(!buffer) {
      throw new Error("Bad buffer");
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, geometry, gl.STATIC_DRAW);
    this.vertexBuffer = buffer;
  }
  
  public draw(gl: WebGL2RenderingContext) {
    gl.useProgram(this.program);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.enableVertexAttribArray(this.locations.attributes.get("position") as number);
    gl.vertexAttribPointer(
      this.locations.attributes.get("position") as number,
      2,
      gl.FLOAT,
      false,
      0,
      0,
    );

    gl.uniformMatrix3fv(this.locations.uniforms.get("uModelMatrix") as number, false, this.localMatrix);

    gl.drawArrays(gl.TRIANGLES, 0, 3)
  }
}

export default Sprite;