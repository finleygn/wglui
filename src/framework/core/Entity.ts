import SceneObject from "./SceneObject";

abstract class Entity extends SceneObject {
  abstract draw(gl: WebGL2RenderingContext): void;
}

export default Entity;