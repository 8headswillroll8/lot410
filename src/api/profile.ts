import { apiRequest } from "../api/client";
import type { CreateEditProfileParams } from "../types/listings";

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

export async function editProfile(
  name: string,
  params: CreateEditProfileParams,
) {
  return apiRequest(
    `/auction/profiles/${name}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    },
    true,
  );
}
