import React, { useEffect, useRef } from "react";
import { ConcurrentRoot } from 'react-reconciler/constants';
import Group from "../core/Group";
import Loop from "../core/Loop";
import RenderManager from "../core/Renderer";
import Provider from "./Provider";
import reconciler from "./reconciller";

const LOOP = new Loop();

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
      <Provider loop={LOOP}>
        {children}
      </Provider>,
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
            rm.gl.clearColor(0,0,0,1);
          }
        });

        LOOP.subscribe(() => {
          renderer.render(root);
        }, -1);

        LOOP.start();
      }
    );
  }, []);

  return (
    <canvas ref={ref} />
  )
}

export default Canvas;