import { useCallback, useState, useEffect } from "react";
import { parseJson, sleep } from "../utils";

export type Dispatch = (dispatchParams?: { overrideUrl?: string; overrideOptions?: object; }) => Promise<unknown>;

export type UseFetch = (url: string, options?: object, isEager?: boolean) => {
  data: any;
  error: string | null;
  isPending: boolean;
  dispatch: Dispatch;
}

export const useFetch: UseFetch = (url, options, isEager = true) => {
  const [data, setData] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dispatch: Dispatch = useCallback(async (dispatchParams) => {
    const { overrideUrl, overrideOptions } = dispatchParams || {};

    setIsPending(true);

    try {
      const response = await fetch(overrideUrl ?? url, { ...options, ...overrideOptions });

      // imitate latency
      await sleep(500);

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const json = await parseJson(response) || null;

      setData(json);

      return json;
    } catch (error) {
      setError(JSON.stringify(error));
    } finally {
      setIsPending(false);
    }
  }, [url, options])

  useEffect(() => {
    if (isEager) {
      dispatch();
    }
  }, [url, options, isEager, dispatch]);

  return { data, isPending, error, dispatch };
};
