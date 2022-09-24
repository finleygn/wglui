import Group from './lib/Group';
import Sprite from './lib/Sprite';

declare module '@wglui/react' {
  interface ElementTypes {
    group: ElementRegister<Group, typeof Group>,
    sprite: ElementRegister<Sprite, typeof Sprite>
  }
}

// right so basically because we arent using these exports directly they are getting tree-shaken out when they shouldnt be

export { Group, Sprite };
