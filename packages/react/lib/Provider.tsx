import React from 'react';
import { Loop } from '@wglui/core';

interface ReactGLContext {
  loop: Loop;
}

export const Context = React.createContext({} as ReactGLContext);

function Provider({ children, loop }: React.PropsWithChildren<{ loop: Loop }>) {
  return (
    <Context.Provider value={{ loop }}>
      {children}
    </Context.Provider>
  )
}

export default Provider;