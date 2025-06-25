import { ResponseType, ErrorType } from "./customFetchType";

type RequestInterceptor = (
  config: RequestInit
) => Promise<RequestInit> | RequestInit;

type ResponseInterceptor = (response: Response) => Promise<Response> | Response;

export const cFetch = () => {
  let baseUrl = "";
  const requestInterceptors: RequestInterceptor[] = [];
  const responseInterceptors: ResponseInterceptor[] = [];

  const request = async <T>(
    url: string,
    options: RequestInit = {}
  ): Promise<ResponseType<T>> => {
    try {
      const fetchUrl = baseUrl + url;
      let config = options;
      if (requestInterceptors.length > 0) {
        config = await requestInterceptors[0](config);
      }
      let response = await fetch(fetchUrl, { ...config });

      if (responseInterceptors.length > 0) {
        response = await responseInterceptors[0](response);
      } else {
        if (!response.ok) {
          const { error } = await response.json();
          throw error as ErrorType;
        }
      }

      const data = await response.json();
      return data;
    } catch (e) {
      throw e as ErrorType;
    }
  };

  return {
    instance: (url: string) => {
      baseUrl = url;
    },
    interceptors: {
      request: (interceptor: RequestInterceptor) => {
        requestInterceptors.push(interceptor);
      },
      response: (interceptor: ResponseInterceptor) => {
        responseInterceptors.push(interceptor);
      },
    },

    get: <RES>(
      url: string,
      params?: Record<string, unknown>,
      options: RequestInit = {}
    ) => {
      console.log("get :: ", options.headers);
      if (params) {
        // serialize
        const searchParams = new URLSearchParams();
        for (const key in params) {
          const paramsValue = params[key];
          if (typeof paramsValue === "object") {
            if (
              paramsValue !== null &&
              Array.isArray(paramsValue) &&
              paramsValue.length > 0
            ) {
              paramsValue.forEach((obj) => {
                searchParams.append(key, obj);
              });
            }
          } else {
            searchParams.append(key, paramsValue + "");
          }
        }
        const qs = searchParams.toString();
        url += `?${qs}`;
      }
      return request<RES>(url, { ...options, method: "GET" });
    },
    post: <RES>(url: string, body: unknown, options: RequestInit = {}) => {
      return request<RES>(url, {
        ...options,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        body: JSON.stringify(body),
      });
    },
    put: <RES>(
      url: string,
      body: unknown,
      options: Omit<RequestInit, "method"> = {}
    ) => {
      return request<RES>(url, {
        ...options,
        method: "PUT",
        headers: {
          ...options.headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
    },
    delete: <RES>(url: string, body: unknown, options: RequestInit = {}) => {
      return request<RES>(url, {
        ...options,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        body: JSON.stringify(body),
      });
    },
  };
};
