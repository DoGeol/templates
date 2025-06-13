/**
 * 1차 : customFetch에 Method로 GET/POST를 던져서 값을 가져올수있게 만들기
 * - 조건1 : 제네릭을 사용하여 ResponseType을 전달해서 가져오는 값을 받아오게 만들기
 */

// 1. fetch request type
type CustomFetchOptions = {
  method: string;
  headers?: Record<string, string>; // Record : KEY를 속성(Key)으로, TYPE을 그 속성값의 타입(Type)으로 지정하는 새로운 타입을 반환
  body?: Record<string, string | number | boolean>; // GET 메소드가 아닐 경우에만 body를 사용
};

// 2. customFetch는 제네릭 <T>를 받고, Promise<T>를 반환한다.
export const customFetch = <T>(
  url: string,
  option: CustomFetchOptions
): ((
  // query, path param둘 다 받는 경우
  // 둘 다 없을수도 있기 때문에 optional로 설정
  pathParam?: string | number,
  queryParam?: Record<string, string | number | boolean>
) => Promise<T>) => {
  return async (
    pathParam?: string | number,
    queryParam?: Record<string, string | number | boolean>
  ): Promise<T> => {
    const baseUrl = pathParam ? `${url}/${pathParam}` : url;

    // queryParam이 있을 경우 URLSearchParams를 사용하여 쿼리 문자열을 생성
    const queryString = queryParam
      ? "?" +
        new URLSearchParams(
          Object.entries(queryParam).reduce((acc, [key, val]) => {
            acc[key] = String(val);
            return acc;
          }, {} as Record<string, string>)
        ).toString()
      : "";

    // 최종 URL 생성
    const fullUrl = baseUrl + queryString;

    const response = await fetch(fullUrl, {
      method: option.method.toUpperCase(),
      headers: {
        ...option.headers,
      },
      // body가 있을 경우(GET mothode가 아닐 경우)에만 JSON.stringify를 사용
      body:
        option.method.toUpperCase() === "GET" // fetch는 메소드 대소문자 가리지 않지만 대문자로 권장.
          ? undefined
          : JSON.stringify(option.body),
    });

    if (!response.ok) {
      throw new Error(`서버 응답 오류: ${response.status}`);
    }

    return await response.json();
  };
};
