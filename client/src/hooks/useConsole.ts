import { useCallback } from "react";

export const useConsole = () => {
  const consoleLog = useCallback((logObject: unknown) => {
    console.log(logObject);
  }, []);

  const consoleError = useCallback((logObject: unknown) => {
    console.error(logObject);
  }, []);

  const consoleWarn = useCallback((logObject: unknown) => {
    console.warn(logObject);
  }, []);

  return {
    consoleError,
    consoleLog,
    consoleWarn,
  };
};
