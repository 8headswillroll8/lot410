import { apiRequest } from "../api/client";
import type { EditProfileParams } from "../types/listings";

/**
 * Fetches profile data for a specific user.
 *
 * @param name - Name of the profile to fetch.
 * @returns The profile data from the API.
 */
export async function getProfile(name: string) {
  return apiRequest(
    `/auction/profiles/${name}`,
    {
      method: "GET",
    },
    true,
  );
}

/**
 * Fetches auction listings created by a specific user.
 *
 * @param name - Name of the profile whose listings to fetch.
 * @returns The user's listings from the API.
 */
export async function getProfileListings(name: string) {
  return apiRequest(
    `/auction/profiles/${name}/listings?_bids=true`,
    {
      method: "GET",
    },
    true,
  );
}

/**
 * Fetches the bidding history for a specific user, including listing data.
 *
 * @param name - Name of the profile whose bidding history to fetch.
 * @returns The user's bidding history from the API.
 */
export async function getBiddingHistory(name: string) {
  return apiRequest(
    `/auction/profiles/${name}/bids?_listings=true`,
    {
      method: "GET",
    },
    true,
  );
}

/**
 * Updates a user's profile.
 *
 * @param name - Name of the profile to update.
 * @param params - Updated profile data.
 * @returns The updated profile.
 */
export async function editProfile(name: string, params: EditProfileParams) {
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
