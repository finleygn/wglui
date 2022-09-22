import React from 'react'
import ReactDOM from 'react-dom/client'
import Vec2 from './framework/math/Vec2';
import Canvas from './framework/react/Canvas';
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Canvas>
      <group>
        <sprite scale={new Vec2(1,1)} />
      </group>
    </Canvas>
  </React.StrictMode>
)
