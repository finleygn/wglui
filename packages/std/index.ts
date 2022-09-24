import { extendRegistry } from '@wglui/react';
import Group from './lib/Group';
import Sprite from './lib/Sprite';

declare module '@wglui/react' {
  interface ElementTypes {
    group: ElementRegister<Group, typeof Group>,
    sprite: ElementRegister<Sprite, typeof Sprite>
  }
}

const register = () => {
  extendRegistry("group", Group);
  extendRegistry("sprite", Sprite);
}

export { Group, Sprite };
export default register;
