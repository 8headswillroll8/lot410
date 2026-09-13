import { expect, it } from "vitest";
import {
  filterHotListings,
  filterNoBidsListings,
  filterStealsListings,
} from "../utils/listingFilters";

function createBids(count: number) {
  return Array.from({ length: count }, (_, index) => ({
    amount: index + 1,
    bidder: {
      name: `Bidder ${index + 1}`,
    },
    created: "2026-09-01",
  }));
}

it("returns listings with more than 5 bids", () => {
  const listings = [
    {
      id: "1",
      title: "Hot listing",
      description: null,
      media: [],
      bids: createBids(7),
      endsAt: "2026-09-20",
      _count: {
        bids: 7,
      },
    },
    {
      id: "2",
      title: "Not hot listing",
      description: null,
      media: [],
      bids: createBids(3),
      endsAt: "2026-09-20",
      _count: {
        bids: 3,
      },
    },
  ];

  const result = filterHotListings(listings);

  expect(result).toEqual([listings[0]]);
});

it("returns listings with no bids", () => {
  const listings = [
    {
      id: "1",
      title: "No bids",
      description: null,
      media: [],
      bids: [],
      endsAt: "2026-09-20",
      _count: {
        bids: 0,
      },
    },
    {
      id: "2",
      title: "Has bids",
      description: null,
      media: [],
      bids: createBids(3),
      endsAt: "2026-09-20",
      _count: {
        bids: 3,
      },
    },
  ];

  const result = filterNoBidsListings(listings);

  expect(result).toEqual([listings[0]]);
});

it("returns listings with bids below 100 credits", () => {
  const listings = [
    {
      id: "1",
      title: "Steal",
      description: null,
      media: [],
      bids: [
        {
          amount: 50,
          bidder: { name: "Ada" },
          created: "2026-09-01",
        },
      ],
      endsAt: "2026-09-20",
      _count: {
        bids: 1,
      },
    },
    {
      id: "2",
      title: "Not a steal",
      description: null,
      media: [],
      bids: [
        {
          amount: 150,
          bidder: { name: "Alex" },
          created: "2026-09-01",
        },
      ],
      endsAt: "2026-09-20",
      _count: {
        bids: 1,
      },
    },
    {
      id: "3",
      title: "No bids",
      description: null,
      media: [],
      bids: [],
      endsAt: "2026-09-20",
      _count: {
        bids: 0,
      },
    },
  ];

  const result = filterStealsListings(listings);

  expect(result).toEqual([listings[0]]);
});
