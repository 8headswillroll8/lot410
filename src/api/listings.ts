import { apiRequest } from "./client";

export async function getListings(page: number) {
  return apiRequest(
    `/auction/listings?_bids=true&sort=created&sortOrder=desc&page=${page}&limit=16`,
    {
      method: "GET",
    },
  );
}
