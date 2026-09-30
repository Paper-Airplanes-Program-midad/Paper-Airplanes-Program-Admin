"use client";

import { useCallback, useEffect, useState } from "react";

export type Api<T> = {
  data: T | undefined;
  error: string | null;
  loading: boolean;
  refresh: () => void;
};

export function useApi<T>(path: string): Api<T> {
  const [data, setData] = useState<T>();
  const [error, setError] = useState<string | null>(null);
  const [reloads, setReloads] = useState(0);

  useEffect(() => {
    let alive = true;

    fetch(path, { cache: "no-store" })
      .then(async (response) => {
        const body = await response.json().catch(() => null);
        if (!response.ok) throw new Error(body?.error ?? response.statusText);
        return body as T;
      })
      .then((body) => {
        if (!alive) return;
        setData(body);
        setError(null);
      })
      .catch((cause: Error) => {
        if (alive) setError(cause.message);
      });

    return () => {
      alive = false;
    };
  }, [path, reloads]);

  const refresh = useCallback(() => setReloads((count) => count + 1), []);

  return { data, error, loading: data === undefined && error === null, refresh };
}

export async function send<T>(
  path: string,
  method: "POST" | "PATCH" | "PUT" | "DELETE",
  body?: unknown,
): Promise<T> {
  const response = await fetch(path, {
    method,
    headers: { "content-type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) throw new Error(payload?.error ?? response.statusText);
  return payload as T;
}
