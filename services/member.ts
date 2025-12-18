// services/member.ts

import { BASE_URL, TOKEN, MEMBER_NAME } from "../lib/constant";

export async function getMembers() {
  const res = await fetch(`${BASE_URL}/api/member/list`, {
    method: "GET",
    headers: {
      Authorization: TOKEN,
      "x-member-name": MEMBER_NAME,
    },
    cache: "no-store",
  });

  return res.json();
}

export async function addMember(member: any) {
  const res = await fetch(`${BASE_URL}/api/member/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: TOKEN,
      "x-member-name": MEMBER_NAME,
    },
    body: JSON.stringify({
      data: {
        name: member.name,
        email: member.email,
        address: member.address,
        id_member: member.id_member,
        status: member.status || "Aktif",
      },
    }),
  });

  return res.json();
}

export async function editMember(documentId: string, member: any) {
  const res = await fetch(`${BASE_URL}/api/member/edit/${documentId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: TOKEN,
      "x-member-name": MEMBER_NAME,
    },
    body: JSON.stringify({
      data: member,
    }),
  });

  return res.json();
}

export async function deleteMember(documentId: string) {
  const res = await fetch(`${BASE_URL}/api/member/delete/${documentId}`, {
    method: "POST",
    headers: {
      Authorization: TOKEN,
      "x-member-name": MEMBER_NAME,
    },
  });

  return res.json();
}
