import Entity from "./Entity";
import SceneObject from "./SceneObject";

interface IRenderManagerConstruct {
  target: HTMLCanvasElement;
  width: number;
  height: number;
  configure?: (gl: WebGL2RenderingContext) => void;
  preRender?: (rm: RenderManager) => void;
}

class RenderManager {
  public gl: WebGL2RenderingContext;
  private preRender?: IRenderManagerConstruct['preRender'];

  constructor({
    target,
    width,
    height,
    configure,
    preRender,
  }: IRenderManagerConstruct) {
    const context = target.getContext("webgl2", { premultipliedAlpha:false, alpha: true, depth: true});

    if(!context) {
      throw new Error("WebGL2 not supported")
    }

    this.gl = context;
    this.setSize(width, height);
    
    if(configure) {
      configure(context);
    }

    if(preRender) {
      this.preRender = preRender;
    }
  }

  public setSize(width: number, height: number) {
    this.gl.canvas.width = width;
    this.gl.canvas.height = height;
    this.gl.viewport(0, 0, width, height);
  }

  public render(root: SceneObject) {
    if(this.preRender) {
      this.preRender(this);
    }

    root.recursiveUpdateMatrix();
    root.traverse(element => {
      if(element instanceof Entity) {
        element.draw(this.gl);
      }
    });
  }
}

export default RenderManager;