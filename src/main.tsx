import React, { useRef } from 'react'
import ReactDOM from 'react-dom/client'
import Sprite from './framework/base/Sprite';
import Vec2 from './framework/math/Vec2';
import Canvas from './framework/react/Canvas';
import useFrame from './framework/react/hooks/useFrame';
import './index.css'

function SpinningTriangle() {
  const counter = useRef(0);
  const ref = useRef<Sprite>(null);

  useFrame((dt: number) => {
    if(ref.current) {
      ref.current.transform.rotation += Math.PI * dt;
      ref.current.transform.scale.x = Math.sin(counter.current += dt)
    }
  });

  return (
    <sprite ref={ref} scale={new Vec2(1,1)} />
  );
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Canvas>
      <group>
        <SpinningTriangle />
      </group>
    </Canvas>
  </React.StrictMode>
)
