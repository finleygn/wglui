import Entity from "./Entity";
import SceneObject from "./SceneObject";

interface IRenderManagerConstruct {
  target: HTMLCanvasElement;
  width: number;
  height: number;
  configure?: (gl: WebGL2RenderingContext) => void;
}

class RenderManager {
  public gl: WebGL2RenderingContext;

  constructor({
    target,
    width,
    height,
    configure
  }: IRenderManagerConstruct) {
    const context = target.getContext("webgl2");

    if(!context) {
      throw new Error("WebGL2 not supported")
    }

    this.gl = context;
    this.setSize(width, height);
    
    if(configure) {
      configure(context);
    }
  }

  public setSize(width: number, height: number) {
    this.gl.canvas.width = width;
    this.gl.canvas.height = height;
    this.gl.viewport(0, 0, width, height);
  }

  public render(root: SceneObject) {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    root.recursiveUpdateMatrix();
    root.traverse(element => {
      if(element instanceof Entity) {
        element.draw(this.gl);
      }
    });
  }
}

export default RenderManager;