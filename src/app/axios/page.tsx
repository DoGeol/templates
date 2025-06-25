"use client";

import { customFetch } from "@/utils/customFetch";
import { ErrorType } from "@/utils/customFetchType";
import { useEffect, useState } from "react";

type TMember = {
  id: string;
  name: string;
  age: number;
  email: string;
};

export default function AxiosPage() {
  const [member, setMember] = useState<TMember | null>(null);

  useEffect(() => {
    console.log("useEffect");
    async function fetchMembers() {
      // const response = await fetch("/api/memberDetail/3", {
      //   method: "GET",
      //   headers: new Headers({
      //     "Content-Type": "application/json",
      //     // "custom-error-status": "true",
      //     // "time-out-value" : '3000'
      //   }),
      // });
      //
      // try {
      //   const { data } = await response.json();
      //   console.log(data);
      // } catch (e) {
      //   console.log(e);
      // }
      try {
        // const res = await apiRequest.get<TMember>(
        //   "/memberDetail/3",
        //   {},
        //   {
        //     headers: {
        //       "Content-Type": "application/json",
        //       "custom-error-status": "false",
        //     },
        //   }
        // );
        const res = await customFetch<TMember>("/api/memberDetail/3", {
          headers: new Headers({
            "Content-Type": "application/json",
            "custom-error-status": "false",
            // "time-out-value": "3000",
          }),
        });
        console.log(res.contents);
        setMember(res.contents);
      } catch (e) {
        const error = e as ErrorType;
        alert(`[${error.code}] :: ${error.message}`);
      }
    }
    fetchMembers();
  }, []);

  return (
    <main className="flex flex-col h-[calc(100vh-var(--header-height))]">
      <h1>Axios</h1>
      <div>{member && JSON.stringify(member)}</div>

      <button
        onClick={async () => {
          // fetch("/api/memberDetail/3", {
          //   method: "POST",
          //   headers: new Headers({
          //     "Content-Type": "application/json",
          //     // "custom-error-status": "true",
          //     // "time-out-value" : '3000'
          //   }),
          //   body: JSON.stringify({
          //     name: "아무개",
          //   }),
          // })
          //   .then((res) => {
          //     console.log(res);
          //   })
          //   .catch((e) => {
          //     console.log(e);
          //   });

          try {
            const res = await customFetch<TMember>("/api/memberDetail/3", {
              method: "POST",
              body: JSON.stringify({
                name: "아무개",
              }),
              headers: new Headers({
                "Content-Type": "application/json",
                "custom-error-status": "false",
                // "time-out-value": "3000",
              }),
            });
            console.log(res.contents);
            setMember(res.contents);
          } catch (e) {
            const error = e as ErrorType;
            alert(`[${error.code}] :: ${error.message}`);
          }
        }}
      >
        {" "}
        1번 회원 이름 아무개로 업데이트하기
      </button>
    </main>
  );
}
