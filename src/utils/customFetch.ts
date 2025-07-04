type CustomFetchOptions = {
  method: "GET" | "POST" | "PUT" | "DELETE";
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
  body?: Record<string, string | number | boolean>;
};

export const customFetch = async <T>(
  url: string,
  options: CustomFetchOptions
): Promise<T> => {
  const method = options.method.toUpperCase();
  let fullUrl = url;
  let fetchBody = options.body;

  if (method === "GET" || method === "DELETE") {
    if (options.params) {
      const queryString = new URLSearchParams(
        Object.entries(options.params).reduce((acc, [key, val]) => {
          acc[key] = String(val);
          return acc;
        }, {} as Record<string, string>)
      ).toString();
      fullUrl += `?${queryString}`;
    }
  } else {
    fetchBody = options.body ?? options.params;
  }

  const response = await fetch(fullUrl, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    body:
      method === "GET" || method === "DELETE"
        ? undefined
        : JSON.stringify(fetchBody),
  });

  if (!response.ok) {
    throw new Error(`서버 응답 오류: ${response.status}`);
  }

  return await response.json();
};
