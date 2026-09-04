import { apiRequest } from "../api/client";

export async function getProfile(id: string) {
  return apiRequest(
    `/auction/profiles/${id}`,
    {
      method: "GET",
    },
    true,
  );
}

const data = await getProfile("lot410_testuser");
console.log(data);
