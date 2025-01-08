import { useRef, useEffect } from "react";

export const useMountedRef = () => {
  const ref = useRef(false);

  useEffect(
    () => () => {
      ref.current = true;
    },
    []
  );

  return ref;
};
