import { SceneObject } from "@wglui/core";
import { extendRegistry } from "@wglui/react";

// Alias for nicer naming...
class Group extends SceneObject {};
/// TESTTESTSTS
console.log("!")
extendRegistry("group", Group);
export default Group;