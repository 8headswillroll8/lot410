import { expect, it } from "vitest";
import { sortBidsByHighest } from "./listingUtils";

it("sorts bids from highest to lowest", () => {
  const bids = [
    {
      amount: 5,
      bidder: { name: "Ada" },
      created: "2026-09-01",
    },
    {
      amount: 7,
      bidder: { name: "Alex" },
      created: "2026-09-02",
    },
    {
      amount: 2,
      bidder: { name: "Susan" },
      created: "2026-09-03",
    },
    {
      amount: 10,
      bidder: { name: "Noah" },
      created: "2026-09-04",
    },
    {
      amount: 6,
      bidder: { name: "Eyra" },
      created: "2026-09-05",
    },
  ];

  const result = sortBidsByHighest(bids);

  expect(result).toEqual([
    {
      amount: 10,
      bidder: { name: "Noah" },
      created: "2026-09-04",
    },
    {
      amount: 7,
      bidder: { name: "Alex" },
      created: "2026-09-02",
    },
    {
      amount: 6,
      bidder: { name: "Eyra" },
      created: "2026-09-05",
    },
    {
      amount: 5,
      bidder: { name: "Ada" },
      created: "2026-09-01",
    },
    {
      amount: 2,
      bidder: { name: "Susan" },
      created: "2026-09-03",
    },
  ]);
});

it("does not modify the original array", () => {
  const bids = [
    {
      amount: 5,
      bidder: { name: "Ada" },
      created: "2026-09-01",
    },
    {
      amount: 10,
      bidder: { name: "Alex" },
      created: "2026-09-02",
    },
  ];

  sortBidsByHighest(bids);

  expect(bids).toEqual([
    {
      amount: 5,
      bidder: { name: "Ada" },
      created: "2026-09-01",
    },
    {
      amount: 10,
      bidder: { name: "Alex" },
      created: "2026-09-02",
    },
  ]);
});
