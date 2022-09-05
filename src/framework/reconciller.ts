import SceneObject from "../framework/core copy/SceneObject"
import RenderManager from "../framework/core/Renderer";
import Vec2 from "../framework/math/Vec2"

/**
 * ANY DRAWABLE OBJECT NEEDS TO EXTEND ENTITY
 * ENTITY HAS A DRAW CALL, AND CAN BE CONNECTED TO GEOMETRY AND PROGRAMS
 * 
 * CREATE DEFAULT SPRITE ENTITY
 * 
 * RECONCILLER GOES OVER EVERY NODE, ADDING OBJECTS TO CREATE A SCENE GRAPH
 * 
 * EVERY FRAME REDRAW EVERY OBJECT, AND UPDATE MATRIXES, CALLING ONFRAME FOR EACH BEFOREHAND
 * 
 * HAVE GLOBAL CACHE FOR PROGRAMS AND GEOMETRY 
 */

function Button() {
  useFrame(() => {
    gl.useProgram(x);
  })

  return (
    <Drawer 
      ref={ref}
    />
  )
}

function App() {
  return (
    <Group transform={{ 
      position: new Vec2(1, 1),
      scale: new Vec2(1, 1),
      rotation: 0,
    }}>
      <Button />
    </Group>
  )
}


const renderer = new RenderManager({
  width: 100,
  height: 100,
  target: document.createElement('canvas'),
  configure: (gl) => {
    gl.clearColor(1,0,0,1);
  }
})




const reconciler = Reconciler<
    HostConfig['type'],
    HostConfig['props'],
    HostConfig['container'],
    HostConfig['instance'],
    HostConfig['textInstance'],
    HostConfig['suspenseInstance'],
    HostConfig['hydratableInstance'],
    HostConfig['publicInstance'],
    HostConfig['hostContext'],
    HostConfig['updatePayload'],
    HostConfig['childSet'],
    HostConfig['timeoutHandle'],
    HostConfig['noTimeout']
  >({
    createInstance,
    removeChild,
    appendChild,
    appendInitialChild: appendChild,
    insertBefore,
    supportsMutation: true,
    isPrimaryRenderer: false,
    supportsPersistence: false,
    supportsHydration: false,
    noTimeout: -1,
    appendChildToContainer: (container, child) => {
      if (!child) return

      // Don't append to unmounted container
      const scene = container.getState().scene as unknown as Instance
      if (!scene.__r3f) return

      // Link current root to the default scene
      scene.__r3f.root = container
      appendChild(scene, child)
    },
    removeChildFromContainer: (container, child) => {
      if (!child) return
      removeChild(container.getState().scene as unknown as Instance, child)
    },
    insertInContainerBefore: (container, child, beforeChild) => {
      if (!child || !beforeChild) return

      // Don't append to unmounted container
      const scene = container.getState().scene as unknown as Instance
      if (!scene.__r3f) return

      insertBefore(scene, child, beforeChild)
    },
    getRootHostContext: () => null,
    getChildHostContext: (parentHostContext) => parentHostContext,
    finalizeInitialChildren(instance) {
      const localState = instance?.__r3f ?? {}
      // https://github.com/facebook/react/issues/20271
      // Returning true will trigger commitMount
      return Boolean(localState.handlers)
    },
    prepareUpdate(instance, _type, oldProps, newProps) {
      // Create diff-sets
      if (instance.__r3f.primitive && newProps.object && newProps.object !== instance) {
        return [true]
      } else {
        // This is a data object, let's extract critical information about it
        const { args: argsNew = [], children: cN, ...restNew } = newProps
        const { args: argsOld = [], children: cO, ...restOld } = oldProps

        // Throw if an object or literal was passed for args
        if (!Array.isArray(argsNew)) throw new Error('R3F: the args prop must be an array!')

        // If it has new props or arguments, then it needs to be re-instantiated
        if (argsNew.some((value, index) => value !== argsOld[index])) return [true]
        // Create a diff-set, flag if there are any changes
        const diff = diffProps(instance, restNew, restOld, true)
        if (diff.changes.length) return [false, diff]

        // Otherwise do not touch the instance
        return null
      }
    },
    commitUpdate(instance, [reconstruct, diff]: [boolean, DiffSet], type, _oldProps, newProps, fiber) {
      // Reconstruct when args or <primitive object={...} have changes
      if (reconstruct) switchInstance(instance, type, newProps, fiber)
      // Otherwise just overwrite props
      else applyProps(instance, diff)
    },
    commitMount(instance, _type, _props, _int) {
      // https://github.com/facebook/react/issues/20271
      // This will make sure events are only added once to the central container
      const localState = (instance.__r3f ?? {}) as LocalState
      if (instance.raycast && localState.handlers && localState.eventCount) {
        instance.__r3f.root.getState().internal.interaction.push(instance as unknown as THREE.Object3D)
      }
    },
    getPublicInstance: (instance) => instance!,
    prepareForCommit: () => null,
    preparePortalMount: (container) => prepare(container.getState().scene),
    resetAfterCommit: () => {},
    shouldSetTextContent: () => false,
    clearContainer: () => false,
    hideInstance(instance) {
      // Detach while the instance is hidden
      const { attach: type, parent } = instance.__r3f ?? {}
      if (type && parent) detach(parent, instance, type)
      if (instance.isObject3D) instance.visible = false
      invalidateInstance(instance)
    },
    unhideInstance(instance, props) {
      // Re-attach when the instance is unhidden
      const { attach: type, parent } = instance.__r3f ?? {}
      if (type && parent) attach(parent, instance, type)
      if ((instance.isObject3D && props.visible == null) || props.visible) instance.visible = true
      invalidateInstance(instance)
    },
    createTextInstance: handleTextInstance,
    hideTextInstance: handleTextInstance,
    unhideTextInstance: handleTextInstance,
    // https://github.com/pmndrs/react-three-fiber/pull/2360#discussion_r916356874
    // @ts-ignore
    getCurrentEventPriority: () => (_getEventPriority ? _getEventPriority() : DefaultEventPriority),
    beforeActiveInstanceBlur: () => {},
    afterActiveInstanceBlur: () => {},
    detachDeletedInstance: () => {},
    now:
      typeof performance !== 'undefined' && is.fun(performance.now)
        ? performance.now
        : is.fun(Date.now)
        ? Date.now
        : () => 0,
    // https://github.com/pmndrs/react-three-fiber/pull/2360#discussion_r920883503
    scheduleTimeout: (is.fun(setTimeout) ? setTimeout : undefined) as any,
    cancelTimeout: (is.fun(clearTimeout) ? clearTimeout : undefined) as any,
  })