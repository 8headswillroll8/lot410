export interface Bid {
  amount: number;
}

export interface Media {
  url: string;
  alt: string;
}

export interface Listing {
  id: string;
  title: string;
  description: string | null;
  media: Media[];
  bids: Bid[];
  endsAt: string;
  _count: {
    bids: number;
  };
}
