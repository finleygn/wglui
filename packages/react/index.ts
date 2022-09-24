import { SceneObject } from '@wglui/core';
import React from 'react';

type Args<T> = T extends new (...args: any) => any ? ConstructorParameters<T> : T;

interface NodeProps<T> {
  children?: React.ReactNode;
  ref?: React.Ref<T>;
  key?: React.Key;
}

/**
 * Custom elements can be added via
 * ```ts
    declare module '@wglui/react' {
      interface ElementTypes {
        customElement: ElementRegister<CustomElement>
      }
    }
 * ```
 */

export type ElementRegister<T, TT> = NodeProps<T> & (Args<TT> extends Array<any> ? Args<TT>[0] : Args<TT>);
export interface ElementTypes {
}

declare global {
  namespace JSX {
    interface IntrinsicElements extends ElementTypes {}
  }
}

export { default as Canvas } from './lib/Canvas';
export { default as useFrame } from './lib/hooks/useFrame';

export { extendRegistry } from './lib/jsxRegistry';