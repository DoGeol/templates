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

export default function MemberList() {
  const [members, setMembers] = useState<TMember[]>([]);

  useEffect(() => {
    console.log("useEffect");
    async function fetchMembers() {
      // const response = await fetch("/api/member", {
      //   method: "GET",
      //   headers: new Headers({
      //     "Content-Type": "application/json",
      //     // "custom-error-status": "true",
      //     // "time-out-value" : '3000'
      //   }),
      // });

      // try {
      //   const { contents } = await response.json();
      //   setMembers(contents || []);
      // } catch (e) {
      //   console.log(e);
      // }
  
      try {
        const res = await customFetch<TMember[]>("/api/member", {
          headers: new Headers({
            "Content-Type": "application/json",
            "custom-error-status": "true",
            // "time-out-value": "3000",
          }),
        });
        console.log(res.contents);
        setMembers(res.contents || []);
      } catch (e) {
        const error = e as ErrorType;
        alert(`[${error.code}] :: ${error.message}`);
      }
    }
    fetchMembers();
  }, []);

  return (
    <div>
      <h2>Member List :: {members.length}</h2>
      <ul>
        {members.map((member) => (
          <li key={member.id}>{member.name}</li>
        ))}
      </ul>
    </div>
  );
}
