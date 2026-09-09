import { apiRequest } from "../api/client";

export async function getProfile(name: string) {
  return apiRequest(
    `/auction/profiles/${name}`,
    {
      method: "GET",
    },
    true,
  );
}

export async function getProfileListings(name: string) {
  return apiRequest(
    `/auction/profiles/${name}/listings?_bids=true`,
    {
      method: "GET",
    },
    true,
  );
}

export async function getBiddingHistory(name: string) {
  return apiRequest(
    `/auction/profiles/${name}/bids?_listings=true`,
    {
      method: "GET",
    },
    true,
  );
}
