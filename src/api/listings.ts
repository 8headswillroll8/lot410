import { apiRequest } from "./client";
import type {
  CreateListingsParams,
  EditListingsParams,
  BidOnListingParams,
} from "../types/listings";

/**
 * Fetches a paginated list of auction listings, including bids.
 *
 * @param page - Page number to fetch.
 * @returns The listings response from the API.
 */
export async function getListings(page: number) {
  return apiRequest(
    `/auction/listings?_bids=true&sort=created&sortOrder=desc&page=${page}&limit=16`,
    {
      method: "GET",
    },
    true,
  );
}

/**
 * Fetches a single listing with bids and seller information.
 *
 * @param id - ID of the listing to fetch.
 * @returns The listing data from the API.
 */
export async function getSingleListing(id: string) {
  return apiRequest(
    `/auction/listings/${id}?_bids=true&_seller=true`,
    {
      method: "GET",
    },
    true,
  );
}

/**
 * Searches auction listings using the provided search term.
 *
 * @param searchInput - Search term entered by the user.
 * @returns Matching listings from the API.
 */
export async function getSearchResults(searchInput: string) {
  return apiRequest(
    `/auction/listings/search?q=${encodeURIComponent(searchInput)}&_bids=true`,
    {
      method: "GET",
    },
  );
}

/**
 * Creates a new auction listing.
 *
 * @param params - Data for the new listing.
 * @returns The created listing.
 */
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

/**
 * Updates an existing auction listing.
 *
 * @param id - ID of the listing to update.
 * @param params - Updated listing data.
 * @returns The updated listing.
 */
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

/**
 * Deletes an auction listing.
 *
 * @param id - ID of the listing to delete.
 * @returns Nothing when the deletion succeeds.
 */
export async function deleteListing(id: string) {
  return apiRequest(
    `/auction/listings/${id}`,
    {
      method: "DELETE",
    },
    true,
  );
}

/**
 * Places a bid on an auction listing.
 *
 * @param id - ID of the listing to bid on.
 * @param params - Bid data, including the bid amount.
 * @returns The updated listing data.
 */
export async function bidOnListing(id: string, params: BidOnListingParams) {
  return apiRequest(
    `/auction/listings/${id}/bids`,
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
