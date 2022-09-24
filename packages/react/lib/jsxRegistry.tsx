import { SceneObject } from "@wglui/core";

const jsxRegistry: { [key: string]: { new(...args: any): SceneObject } } = {};

export function extendRegistry(key: string, value: { new(...args: any): SceneObject }) {
  console.log("ADDING")
  jsxRegistry[key] = value;
  console.log(jsxRegistry)
}

export default jsxRegistry;