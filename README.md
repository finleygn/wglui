# WGLUI

2D Framework for creating interfaces with WebGL. Using React for state management and scene structure - with WebGL for drawing.

Inspired by https://github.com/pmndrs/react-three-fiber, just without threejs.

## Goals/Features

- Exposes WebGL directly
- Plain react for describing UI state (redux etc can be used)
- Scene tree structure with matricies, automatically managed with reconciler (Could use proxies to detect when transforms are updated for matrix recalc??)
- Tools for managing geometry and programs + caching
- Animation helpers

## TODO

- Pointer events & Button entity
- Texture handling
- API Improvements for defining new entities

## Usage (WIP)

### Install

`yarn add @wglui/core @wglui/react @wglui/std`

### Overview

```jsx
import { Vec2 } from '@wglui/core';
import { Sprite } from '@wglui/std';
import { Canvas, useFrame } from '@wglui/react';

// UI Component
function SpinningSprite({ speed, ...props }) {
  const counter = useRef(0);
  const sprt = useRef<Sprite>(null);

  useFrame((dt: number) => {
    sprt.current.transform.rotation = Math.sin(counter.current += dt * speed) * Math.PI;
  });

  return (
    <sprite ref={sprt} {...props} />
  );
}

// Entry
function App() {
  return (
    <Canvas>
      <group>
        <SpinningSprite speed={1.0} position={new Vec2(0.2, 0.4)} />
        <SpinningSprite speed={2.0} />
      </group>
    </Canvas>
  );
}

```

### Creating Drawable Entities

Definition

```jsx
class Triangle extends Entity {
  private ready = false;
  private _vao;
  private _program;

  private build(gl) {
    this._program = new Program(gl,
      `
        attribute vec3 position;
        uniform vec3 uColor;
        uniform mat4 uModelMatrix;
        varying vec3 vColor; 

        void main() {
          gl_Position = uModelMatrix * vec4(
            position, 1.0
          );
        }
      `,
      `
        varying vec3 vColor;
        void main() {
          gl_FragColor = vec4(vColor, 1.0);
        }
      `
    );

    // ... create VAO here, omitted for brevity

    Triangle._vao = vao;
    Triangle.ready = true;
  }

  constructor({ color, ...rest }) {
    this.color = color;
    super(rest);
  }
  
  public draw(gl) {
    if(!Triangle.ready) {
      Triangle.build(gl);
    }

    gl.useProgram(this._program.compiled);
    gl.bindVertexArray(this._vao);

    gl.uniformMatrix4fv(this._program.uniforms.get("uModelMatrix") as number, false, this.worldMatrix);
    gl.uniform3f(this._program.uniforms.get("uColor") as number, false, this.color);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
}
```

Usage

```jsx
function Component() {
  return (
    <triangle color={[1,0,1]} />
  );
}
```
