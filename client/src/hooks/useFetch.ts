import { useCallback, useState, useEffect } from "react";

const parseJson = async (response: Response) => {
  const text = await response.text()

  try {
    const json = JSON.parse(text);
    return json;
  } catch (error) {
    console.warn(`Invalid JSON object in HTTP response: "${text}"`);
  }

  return null;
}

export type Dispatch = (dispatchParams?: { overrideUrl?: string; overrideOptions?: object; }) => Promise<void>;

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
      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const json = await parseJson(response);

      setData(json);
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
