import type { Bid } from "../types/listings";

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

export function sortBidsByHighest(bids: Bid[]) {
  return [...bids].sort((a, b) => b.amount - a.amount);
}
