export interface Bid {
  amount: number;
  bidder: {
    name: string;
  };
  created: string;
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

export interface CreateListingsParams {
  title: string;
  description?: string;
  tags?: string[];
  media?: {
    url: string;
    alt: string;
  }[];
  endsAt: string;
}

export interface CreateEditProfileParams {
  avatar: {
    url: string;
    alt: string;
  };
  banner: {
    url: string;
    alt: string;
  };
}
