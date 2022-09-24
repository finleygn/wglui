import Traversable from './Traversable';
import Mat4 from "./math/Mat4";
import Vec2 from "./math/Vec2";
import ITransform from './interface/ITransform';

class SceneObject extends Traversable {
  public transform: ITransform;

  public localMatrix = Mat4.empty();
  public worldMatrix = Mat4.empty();
  
  constructor(params?: Partial<ITransform>) {
    super();

    Mat4.identity(this.localMatrix);
    Mat4.identity(this.worldMatrix);

    this.transform = {
      rotation: params?.rotation || 0,
      position: params?.position || new Vec2(0, 0),
      scale: params?.scale || new Vec2(1, 1),
    }
  }

  public recursiveUpdateMatrix() {
    this.traverse(SceneObject.updateMatrix);
  }

  static updateMatrix(element: SceneObject): void {
    Mat4.compose(
      element.transform.rotation,
      element.transform.position,
      element.transform.scale,
      element.localMatrix,
    );

    if(!element.parent) {
      // Create default world matrix for element without parent
      Mat4.copy(element.worldMatrix, element.localMatrix);
    } else {
      // Update world matrix to extend parents
      Mat4.multiply(element.parent.worldMatrix, element.localMatrix, element.worldMatrix)
    }
  }
}

export default SceneObject;