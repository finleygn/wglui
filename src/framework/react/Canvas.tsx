import React, { useEffect, useRef } from "react";
import { ConcurrentRoot } from 'react-reconciler/constants';
import Group from "../core/Group";
import RenderManager from "../core/Renderer";
import reconciler from "./reconciller";

/**
 * Entry point for a 2d canvas thing
 */
function Canvas({ children }: React.PropsWithChildren) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if(!ref.current) return;

    const root = new Group();
    const container = reconciler.createContainer(
      root,
      ConcurrentRoot,
      null,
      false,
      null,
      '',
      () => null,
      null,
    );
    
    reconciler.updateContainer(
      children,
      container,
      undefined,
      () => {
        if(!ref.current) return;

        const renderer = new RenderManager({
          width: ref.current.getBoundingClientRect().width,
          height: ref.current.getBoundingClientRect().height,
          target: ref.current,
          configure: (gl) => {
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
          },
          preRender: (rm) => {
            rm.gl.clear(rm.gl.COLOR_BUFFER_BIT);
            rm.gl.clearColor(1,1,1,1);
          }
        });
    
        renderer.render(root);
      }
    );
  }, []);

  return (
    <div>
      <canvas ref={ref} />
    </div>
  )
}

export default Canvas;