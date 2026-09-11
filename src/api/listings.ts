import { apiRequest } from "./client";
import type {
  CreateListingsParams,
  EditListingsParams,
} from "../types/listings";

export async function getListings(page: number) {
  return apiRequest(
    `/auction/listings?_bids=true&sort=created&sortOrder=desc&page=${page}&limit=16`,
    {
      method: "GET",
    },
    true,
  );
}

export async function getSingleListing(id: string) {
  return apiRequest(
    `/auction/listings/${id}?_bids=true`,
    {
      method: "GET",
    },
    true,
  );
}

export async function getSearchResults(searchInput: string) {
  return apiRequest(
    `/auction/listings/search?q=${encodeURIComponent(searchInput)}&_bids=true`,
    {
      method: "GET",
    },
  );
}

export async function createListing(params: CreateListingsParams) {
  return apiRequest(
    "/auction/listings",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    },
    true,
  );
}

export async function editListing(id: string, params: EditListingsParams) {
  return apiRequest(
    `/auction/listings/${id}`,
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
