class Traversable {
  public parent?: this;
  public children = new Array<this>();

  public setParent(parent?: this, flag = true) {
    // Clear self from old parent
    if (this.parent && parent !== this.parent) {
      this.parent.removeChild(this, false);
    };

    // Assign new parent 
    this.parent = parent;

    // Notify parent about new child
    if(parent && flag) {
      parent.addChild(this, false);
    }
  }

  public addChild(child: this, flag = true) {
    // Add child to list if it doesnt already exist
    if(!this.children.includes(child)) {
      this.children.push(child);
    }

    // Notify child about new parent
    if(flag) {
      child.setParent(this, false);
    }
  }

  public removeChild(child: this, flag = true) {
    // Remove child if exists
    if(this.children.includes(child)) {
      this.children.filter(c => c !== child)
    }

    // Notify child about orphan status
    if(flag) {
      child.setParent(undefined, false);
    }
  }

  public traverse(callback: (element: this) => void) {
    callback(this);
    for (const child of this.children) {
      child.traverse(callback);
    }
  }
}

export default Traversable;