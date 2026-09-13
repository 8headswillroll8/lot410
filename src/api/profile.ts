import { apiRequest } from "../api/client";

interface EditProfileParams {
  avatar: {
    url: string;
    alt: string;
  };
  banner: {
    url: string;
    alt: string;
  };
}

/**
 * Retrieves a profile by name.
 *
 * @param name - The profile name.
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
 * Retrieves listings created by a profile.
 *
 * @param name - The profile name.
 * @returns The profile's listings from the API.
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
 * Retrieves all bids made by a profile,
 * including the associated listing data.
 *
 * @param name - The profile name.
 * @returns The profile's bidding history from the API.
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
 * Updates a profile's avatar and banner.
 *
 * @param name - The profile name.
 * @param params - The profile data to update.
 * @returns The updated profile data from the API.
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
