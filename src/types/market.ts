export interface TokenData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  circulating_supply: number;
  chain: "solana" | "ethereum" | "bsc";
  address?: string;
  price_inr: number;
  launch_date?: string;
  liquidity?: number;
  holders?: number;
}

export interface MarketState {
  tokens: TokenData[];
  loading: boolean;
  error: string | null;
  selectedChain: "all" | "solana" | "ethereum" | "bsc";
  sortBy: "trending" | "new" | "marketcap" | "volume";
}

export interface ChartData {
  timestamp: number;
  price: number;
}

export interface TokenDetails extends TokenData {
  description?: string;
  website?: string;
  twitter?: string;
  telegram?: string;
  chart_data: ChartData[];
  buy_links: {
    name: string;
    url: string;
  }[];
}
