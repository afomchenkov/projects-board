import { useCallback, useState, useEffect } from "react";

export type UseFetch = (url: string, options?: object) => {
  data: any;
  error: string | null;
  isPending: boolean;
  fetchData: Function;
}

export const useFetch: UseFetch = (url, options, isEager = true) => {
  const [data, setData] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsPending(true);

    try {
      const response = await fetch(url, { ...options });
      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const json = await response.json();

      setData(json);
    } catch (error) {
      setError(JSON.stringify(error));
    } finally {
      setIsPending(false);
    }
  }, [url, options])

  useEffect(() => {
    if (isEager) {
      fetchData();
    }
  }, [url, options, isEager, fetchData]);

  return { data, isPending, error, fetchData };
};
