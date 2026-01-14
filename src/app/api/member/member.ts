import { customFetch } from "@/utils/customFetch";
import { TMember } from "@/types/members";

export const getMember = (id: number) => {
  return customFetch<TMember>(`/api/memberDetail/${id}`, {
    method: "GET",
  });
};

export const updateMember = (
  id: string | number,
  data: Omit<TMember, "id"> // id를 제외한 TMember 타입의 속성들만 포함
) => {
  return customFetch<{ contents: TMember }>(`/api/memberDetail/${id}`, {
    method: "POST",
    body: data,
  });
};
