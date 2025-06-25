import { cFetch } from "@/utils/cFetch";

const apiRequest = cFetch();

apiRequest.instance("/api");

apiRequest.interceptors.request((config) => {
  return {
    ...config,
    headers: new Headers({
      ...config.headers,
      "Cache-Control": "no-cache",
    }),
  };
});

apiRequest.interceptors.response((response) => {
  console.log("@@@@ interceptors :: ", response);
  return response;
});

export default apiRequest;


