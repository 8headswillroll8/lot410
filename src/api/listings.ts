import { apiRequest } from "./client";

export async function getListings() {
  return apiRequest("/auction/listings?_bids=true", {
    method: "GET",
  });
}
