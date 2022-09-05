function addLineNumbers(string: string) {
  let lines = string.split('\n');
  for (let i = 0; i < lines.length; i++) {
      lines[i] = i + 1 + ': ' + lines[i];
  }
  return lines.join('\n');
}

function buildShader(gl: WebGL2RenderingContext, type: number, content: string) {
  const shader = gl.createShader(type);
  if(!shader) {
    throw new Error("No program available");
  }
  gl.shaderSource(shader, content);
  gl.compileShader(shader);
  if (gl.getShaderInfoLog(shader) !== '') {
      console.warn(`${gl.getShaderInfoLog(shader)} ${type} Shader\n${addLineNumbers(content)}`);
  }
  return shader;
}

export function createProgram(gl: WebGL2RenderingContext, {
  vertex,
  fragment
}: {
  vertex: string,
  fragment: string
}): WebGLProgram {
  const vertexShader = buildShader(gl, gl.VERTEX_SHADER, vertex);
  const fragmentShader = buildShader(gl, gl.FRAGMENT_SHADER, fragment);

  // compile program and log errors
  const program = gl.createProgram();
  if(!program) {
    throw new Error("No program available");
  }
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program));
  }

  // Remove shader once linked
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  return program;
}

export function getUniformLocations(gl: WebGL2RenderingContext, program: WebGLProgram) {
  const locations = new Map();

  let numUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
  for (let uIndex = 0; uIndex < numUniforms; uIndex++) {
      let uniform = gl.getActiveUniform(program, uIndex);
      if(uniform) {
        const split = uniform.name.match(/(\w+)/g) || [];
        locations.set(
          split[0],
          gl.getUniformLocation(program, uniform.name)
        );
      }
  }

  return locations;
}

export function getAttributeLocations(gl: WebGL2RenderingContext, program: WebGLProgram) {
  const locations = new Map();

  let numAttributes = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
  for (let uIndex = 0; uIndex < numAttributes; uIndex++) {
      let attribute = gl.getActiveAttrib(program, uIndex);
      if(attribute) {
        const split = attribute.name.match(/(\w+)/g) || [];
        locations.set(
          split[0],
          gl.getAttribLocation(program, attribute.name)
        );
      }
  }

  return locations;
}
