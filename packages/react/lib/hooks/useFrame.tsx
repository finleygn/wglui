import { useContext, useEffect } from 'react';
import { Context } from '../Provider';

const useFrame = (callback: (dt: number) => void, priority = 1) => {
  const context = useContext(Context);

  useEffect(() => {
    const subscription = context.loop.subscribe(callback, priority);
    return () => {
      context.loop.unsubscribe(subscription);
    }
  }, [callback]);
}

export default useFrame;