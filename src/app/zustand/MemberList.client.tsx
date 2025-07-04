"use client";

import { useEffect, useState } from "react";
import { TMember } from "@/types/members";
import { getMember, updateMember } from "@/app/api/member/member";

export default function MemberList() {
  const [members, setMembers] = useState<TMember[]>([]);
  const [activeMemberId, setActiveMemberId] = useState<string | number | null>(
    null
  );

  const handleClickUpdateMember = async () => {
    const updateMemberInfo = {
      name: "이지현",
      age: 30,
      email: "d22_22b@naver.com",
    };

    try {
      const result = await updateMember(1, updateMemberInfo);
      const updatedMember = result.contents ?? result;

      setMembers((prev) =>
        prev.map((member) =>
          member.id === updatedMember.id
            ? { ...member, ...updatedMember }
            : member
        )
      );

      setActiveMemberId(updatedMember.id);
    } catch (err) {
      console.error("에러 발생", err);
    }
  };

  useEffect(() => {
    // 회원 상세 정보 가져오기
    const fetchMember = async () => {
      try {
        const result1 = await getMember(1);
        const result2 = await getMember(2);

        console.log("결과1", result1);
        console.log("결과2", result2);
      } catch (err) {
        console.error("에러 발생", err);
      }
    };

    fetchMember();

    async function fetchMembers() {
      const response = await fetch("/api/member", {
        method: "GET",
        headers: new Headers({
          "Content-Type": "application/json",
          // "custom-error-status": "true",
          // "time-out-value" : '3000'
        }),
      });

      try {
        const { contents } = await response.json();
        setMembers(contents || []);
      } catch (e) {
        console.log(e);
      }
    }
    fetchMembers();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Member List :: {members.length}</h2>
      {members.length === 0 ? (
        <p>회원 정보가 없습니다.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <button
            style={{
              border: "1px solid #ccc",
              padding: "12px",
              borderRadius: "8px",
              width: "200px",
              backgroundColor: "#f0f0f0",
              cursor: "pointer",
              color: "#333",
            }}
            onClick={handleClickUpdateMember}
          >
            회원 정보 변경
          </button>
          {members.map((member) => (
            <div
              key={member.id}
              style={{
                border:
                  member.id === activeMemberId
                    ? "2px solid #0070f3"
                    : "1px solid #ccc",

                padding: "12px",
                borderRadius: "8px",
              }}
            >
              <h3>{member.name}</h3>
              <p>
                <strong>나이:</strong> {member.age}세
              </p>
              <p>
                <strong>이메일:</strong> {member.email}
              </p>
              <p>
                <strong>ID:</strong> {member.id}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
