import type { Listing } from "../types/listings";
import { sortBidsByHighest } from "./listingUtils";

/**
 * Filters listings to only include listings with more than 5 bids.
 *
 * @param listings - The listings to filter.
 * @returns A new array containing listings with more than 5 bids.
 */
export function filterHotListings(listings: Listing[]) {
  return listings.filter((listing) => listing.bids.length > 5);
}

/**
 * Filters listings to only include listings with bids below 100 credits.
 *
 * @param listings - The listings to filter.
 * @returns A new array containing listings with at least one bid and a highest bid below 100 credits.
 */
export function filterStealsListings(listings: Listing[]) {
  return listings.filter((listing) => {
    const sortedBids = sortBidsByHighest(listing.bids);
    const highestCredit = sortedBids[0]?.amount ?? 0;

    return highestCredit < 100 && listing.bids.length > 0;
  });
}

/**
 * Filters listings to only include listings with no bids.
 *
 * @param listings - The listings to filter.
 * @returns A new array containing listings with no bids.
 */
export function filterNoBidsListings(listings: Listing[]) {
  return listings.filter((listing) => listing.bids.length === 0);
}

/**
 * Filters out ended listings and sorts the remaining listings by end time.
 *
 * @param listings - The listings to filter and sort.
 * @returns A new array of active listings sorted from soonest to latest ending.
 */
export function sortEndingSoonListings(listings: Listing[]) {
  const now = new Date();

  return listings
    .filter((listing) => {
      const endTime = new Date(listing.endsAt);
      const timeLeft = endTime.getTime() - now.getTime();

      return timeLeft > 0;
    })
    .sort(
      (a, b) => new Date(a.endsAt).getTime() - new Date(b.endsAt).getTime(),
    );
}
