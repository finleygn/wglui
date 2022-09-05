import Traversable from './Traversable';
import Mat3 from "../math/Mat3";
import Vec2 from "../math/Vec2";
import ITransform from './interface/ITransform';

class SceneObject extends Traversable {
  public transform: ITransform;

  public localMatrix = Mat3.empty();
  public worldMatrix = Mat3.empty();
  
  constructor(transform: ITransform = {
    rotation: 0,
    position: new Vec2(0, 0),
    scale: new Vec2(0, 0),
  }) {
    super();
    this.transform = transform;
  }

  public recursiveUpdateMatrix() {
    this.traverse(SceneObject.updateMatrix);
  }

  static updateMatrix(element: SceneObject): void {
    Mat3.compose(
      element.transform.rotation,
      element.transform.position,
      element.transform.scale,
      element.localMatrix,
    );

    if(!element.parent) {
      // Create default world matrix for element without parent
      Mat3.copy(element.worldMatrix, element.localMatrix);
    } else {
      // Update world matrix to extend parents
      Mat3.multiply(element.parent.worldMatrix, element.localMatrix, element.worldMatrix)
    }
  }
}

export default SceneObject;