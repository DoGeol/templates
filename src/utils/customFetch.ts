import { ErrorType, ResponseType } from "./customFetchType";

export const customFetch = async <T>(
  url: string,
  options?: RequestInit
): Promise<ResponseType<T>> => {
  try {
    const response = await fetch(url, { ...options });
    if (!response.ok) {
      const { error } = await response.json();
      throw error as ErrorType;
    }
    const data = await response.json();
    return data;
  } catch (e) {
    throw e as ErrorType;
  }
};

/** 
 * 1차 : customFetch에 Method로 GET/POST를 던져서 값을 가져올수있게 만들기   
 * - 조건1 : 제네릭을 사용하여 ResponseType을 전달해서 가져오는 값을 받아오게 만들기
/* 

type ResponseType = {}

const getMemberList = customFetch<ResponseType>("/api/members", {
    method: "GET",
    header: {},
});

const getMemberDetail = customFetch<ResponseType>("/api/member", {
    method: "GET",
    header: {},
    params: {
        id: 1   
    },
});

const response = async getMemberList()
console.log(response) 
// {
//     "id": 1,
//     "name": "이지현
//     .... 
// }


const updateMember = customFetch<ResponseType>("/api/member", {
    method: "POST",
    header: {},
    data: {},
});

const response = async updateMember(id:1 ,data: {
    name: '이지현'
})
console.log(response) 
// {
//     "id": 1,
//     "name": "이지현
//     .... 
// }

*/
