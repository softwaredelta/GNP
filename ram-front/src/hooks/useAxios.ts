// (c) Delta Software 2023, rights reserved.

import axios, { AxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";
import { useAuthentication } from "../lib/api/api-auth";
import { apiBase$ } from "../lib/api/api-base";
import { useRecoilValue } from "recoil";

export interface IUseAxiosProps {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  body?: object;
  headers?: object;
}

export interface IUseAxiosReturn<T> {
  response: T | null;
  error?: AxiosError | unknown;
  loading?: boolean;
  callback: (newBody?: object) => void;
}

export default function useAxios<T>({
  url,
  method,
  body = {},
  headers = {},
}: IUseAxiosProps): IUseAxiosReturn<T> {
  const { auth } = useAuthentication();
  const apiBase = useRecoilValue(apiBase$);
  const [response, setResponse] = useState<T | null>(null);
  const [error, setError] = useState<AxiosError | unknown>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [mount, setMount] = useState(false);

  const fetchData = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      const res = await axios({
        method,
        url: `${apiBase}/${url}`,
        data: body,
        headers: {
          ...headers,
          authorization: `Bearer ${auth?.accessToken}`,
        },
      });
      setResponse(res.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [apiBase, auth, body, headers, method, url]);

  useEffect((): void => {
    if (method === "GET" && auth && !mount) {
      setMount(true);
      fetchData();
    }
  }, [auth, method, fetchData, mount]);

  const callback = (newBody?: object) => {
    if (newBody) {
      body = newBody;
    }
    fetchData();
  };

  return { response, error, loading, callback };
}
