import Subscription from './Subscription';

type LoopCallback = (dt: number) => void;

class Loop extends Subscription<LoopCallback> {
  start() {
    let then = performance.now();

    const loop = () => {
      let now = performance.now();
      let dt = then - now;
      then = now;

      this.broadcast(dt / 1000);

      window.requestAnimationFrame(loop);
    }

    window.requestAnimationFrame(loop);
  }
}

export default Loop;