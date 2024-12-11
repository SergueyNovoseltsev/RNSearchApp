import { useState } from "react";
import { ApiGetCharProps } from "../models/character";

export function useGetFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const callApi = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      const json = await response.json();

      setData(json);
    } catch (error) {
      setError(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return { callApi, data, error, isLoading };
}
