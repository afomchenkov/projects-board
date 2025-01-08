import { useEffect, useRef } from 'react';

const useTimeout = (callback: Function, delay: number) => {
  const savedCallback = useRef<Function | null>(null);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const func = () => {
      if (savedCallback.current) {
        savedCallback.current();
      }
    }
    if (delay !== null) {
      let id = setTimeout(func, delay);
      return () => clearTimeout(id);
    }
  }, [delay]);
};

export default useTimeout;
