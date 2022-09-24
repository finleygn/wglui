import React, { useRef } from 'react'
import ReactDOM from 'react-dom/client'

import { useFrame, Canvas } from '@wglui/react';
import register, { type Sprite } from '@wglui/std';
import { Vec2 } from '@wglui/core';

import './index.css'

function SpinningSprite({ speed, ...props }: React.PropsWithChildren<{speed: number} & Partial<JSX.IntrinsicElements["sprite"]>>) {
  const counter = useRef(0);
  const sprt = useRef<Sprite>(null);

  useFrame((dt: number) => {
    if(sprt.current) {
      sprt.current.transform.rotation = Math.sin(counter.current += dt * speed) * Math.PI;
    }
  });

  return (
    <sprite ref={sprt} scale={new Vec2(1,1)} {...props} />
  );
}

register();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Canvas>
      <group>
        <SpinningSprite speed={1.0} position={new Vec2(0.2, 0.4)} />
        <SpinningSprite speed={2.0} />
      </group>
    </Canvas>
  </React.StrictMode>
);