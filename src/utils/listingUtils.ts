import type { Bid } from "../types/listings";

/**
 * Formats a creation date as elapsed time from now.
 *
 * @param created - The creation date as a date string.
 * @returns A formatted string such as "2d ago", "3h ago", or "just now".
 */
export function getTimeAgo(created: string) {
  const createdTime = new Date(created);
  const now = new Date();

  const timePassed = now.getTime() - createdTime.getTime();

  const totalSeconds = Math.floor(timePassed / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalDays = Math.floor(totalHours / 24);

  if (totalDays > 0) return `${totalDays}d ago`;
  if (totalHours > 0) return `${totalHours}h ago`;
  if (totalMinutes > 0) return `${totalMinutes}m ago`;

  return "just now";
}
/**
 * Calculates and formats the remaining time for an auction.
 *
 * @param endsAt - The auction end date as a date string.
 * @returns A formatted string such as "2d left", "3h left", or "Ended".
 */
export function timeLeft(endsAt: string) {
  const endingTime = new Date(endsAt);
  const now = new Date();

  const timeBetween = endingTime.getTime() - now.getTime();

  const totalSeconds = Math.floor(timeBetween / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalDays = Math.floor(totalHours / 24);

  if (totalDays > 0) return `${totalDays}d left`;
  if (totalHours > 0) return `${totalHours}h left`;
  if (totalMinutes > 0) return `${totalMinutes}m left`;

  return "Ended";
}

/**
 * Sorts bids from highest to lowest without modifying the original array.
 *
 * @param bids - The bids to sort.
 * @returns A new array sorted by bid amount in descending order.
 */
export function sortBidsByHighest(bids: Bid[]) {
  return [...bids].sort((a, b) => b.amount - a.amount);
}
