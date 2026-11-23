import axios, { type AxiosRequestConfig } from "axios";

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

type CancelablePromise<T> = Promise<T> & { cancel: () => void };

export const customInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): CancelablePromise<T> => {
  const controller = new AbortController();
  const promise = axiosInstance({
    ...config,
    ...options,
    signal: controller.signal,
  }).then((response) => response.data) as CancelablePromise<T>;

  promise.cancel = () => controller.abort();

  return promise;
};
