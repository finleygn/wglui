import { Entity, Program } from "@wglui/core";

class Sprite extends Entity {
  private static ready = false;
  private static _vao: WebGLVertexArrayObject;
  private static _program: Program;

  private static build(gl: WebGL2RenderingContext) {
    Sprite._program = new Program(gl,
      `
        attribute vec3 position;
        uniform mat4 uModelMatrix;

        void main() {
          gl_Position = uModelMatrix * vec4(
            position, 1.0
          );
        }
      `,
      `
        void main() {
          gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
        }
      `
    );

    const geometry = new Float32Array([
      -0, -0,
      -0, 1.0,
      1.0, 0,
    ]);

    const vao = gl.createVertexArray();
    if(!vao) {
      throw new Error("Bad vao");
    }
    gl.bindVertexArray(vao);

    const buffer = gl.createBuffer();

    if(!buffer) {
      throw new Error("Bad buffer");
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, geometry, gl.STATIC_DRAW);

    gl.vertexAttribPointer(
      Sprite._program.attributes.get("position") as number,
      2,
      gl.FLOAT,
      false,
      0,
      0,
    );
    gl.enableVertexAttribArray(Sprite._program.attributes.get("position") as number);

    Sprite._vao = vao;
    Sprite.ready = true;
  }
  
  public draw(gl: WebGL2RenderingContext) {
    if(!Sprite.ready) {
      Sprite.build(gl);
    }

    gl.useProgram(Sprite._program.compiled);
    gl.bindVertexArray(Sprite._vao);

    gl.uniformMatrix4fv(Sprite._program.uniforms.get("uModelMatrix") as number, false, this.worldMatrix);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
}

export default Sprite;