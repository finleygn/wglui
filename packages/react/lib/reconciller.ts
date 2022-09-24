import Reconciler from 'react-reconciler';
import { DefaultEventPriority } from 'react-reconciler/constants'
import { SceneObject, ITransform } from '@wglui/core';
import jsxRegistry from './jsxRegistry';
import { ElementTypes } from '../';

type DiffSet = {
  memoized: { [key: string]: any }
  changes: [key: string, value: unknown, isEvent: boolean, keys: string[]][]
}

interface IHostConfig {
  type: keyof ElementTypes;
  props: { [key: string]: unknown } & ITransform;
  container: SceneObject;
  instance: SceneObject;
  textInstance: void;
  suspenseInstance: SceneObject;
  hydratableInstance: SceneObject;
  publicInstance: SceneObject;
  hostContext: never;
  updatePayload: Array<boolean | number | DiffSet>;
  childSet: never;
  timeoutHandle: number | undefined;
  noTimeout: -1;
}

const insertBefore =  (parent: SceneObject, child: SceneObject, beforeChild: SceneObject) => {
  parent.addChild(parent);
  const siblings = parent.children.filter((sibling) => sibling !== child);
  const index = siblings.indexOf(beforeChild);
  parent.children = [...siblings.slice(0, index), child, ...siblings.slice(index)]
}


const reconciler = Reconciler<
  IHostConfig['type'],
  IHostConfig['props'],
  IHostConfig['container'],
  IHostConfig['instance'],
  IHostConfig['textInstance'],
  IHostConfig['suspenseInstance'],
  IHostConfig['hydratableInstance'],
  IHostConfig['publicInstance'],
  IHostConfig['hostContext'],
  IHostConfig['updatePayload'],
  IHostConfig['childSet'],
  IHostConfig['timeoutHandle'],
  IHostConfig['noTimeout']
>({
  supportsMutation: true,
  isPrimaryRenderer: false,
  supportsPersistence: false,
  supportsHydration: false,
  createInstance: (type, props) => {
    console.log(jsxRegistry);
    if(jsxRegistry[type]) {
      return new jsxRegistry[type](props);
    }
    throw new Error("Given type is not a SceneObject");
  },
  removeChild: (parent: SceneObject, child: SceneObject) => {
    parent.removeChild(child);
  },
  appendChild: (parent: SceneObject, child: SceneObject) => {
    parent.addChild(child);
  },
  appendInitialChild: (parent: SceneObject, child: SceneObject) => {
    parent.addChild(child);
  },
  insertBefore: insertBefore,
  noTimeout: -1,
  appendChildToContainer: (container, child) => {
    if (!child) return;
    container.addChild(child)
  },
  removeChildFromContainer: (container, child) => {
    if (!child) return;
    container.removeChild(child)
  },
  insertInContainerBefore: insertBefore,
  getRootHostContext: () => null,
  getChildHostContext: (parentHostContext) => parentHostContext,
  finalizeInitialChildren: () => true,
  prepareUpdate(instance, _type, oldProps, newProps) {
    // TODO
    return [true];
  },
  commitUpdate(instance, [reconstruct, diff]: [boolean, DiffSet], type, _oldProps, newProps, fiber) {
    // TODO
  },
  commitMount(instance, _type, _props, _int) {
  },
  getPublicInstance: (instance) => instance!,
  prepareForCommit: () => null,
  resetAfterCommit: () => {},
  shouldSetTextContent: () => false,
  clearContainer: () => false,
  createTextInstance: () => { throw new Error("No text allowed") },
  hideTextInstance: () => { throw new Error("No text allowed") },
  unhideTextInstance: () => { throw new Error("No text allowed") },
  // @ts-ignore
  getCurrentEventPriority: () => DefaultEventPriority,
  beforeActiveInstanceBlur: () => {},
  afterActiveInstanceBlur: () => {},
  detachDeletedInstance: () => {},
  scheduleTimeout: setTimeout,
  cancelTimeout: clearTimeout,
  preparePortalMount: () => new SceneObject(),
  hideInstance(instance) {

  },
  unhideInstance(instance, props) {

  },
});

export default reconciler;
