export interface TokenData {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  price: number;
  priceChange24h: number;
  volume24h: number;
  marketCap: number;
  liquidity: number;
  holders: number;
  lastUpdated: string;
  logo?: string;
  description?: string;
  website?: string;
  twitter?: string;
  telegram?: string;
  discord?: string;
  github?: string;
  chain: string;
  dexId: string;
  pairAddress: string;
  quoteToken: {
    address: string;
    symbol: string;
    name: string;
  };
  totalSupply?: number;
  circulatingSupply?: number;
  launchDate?: string;
  contractVerified?: boolean;
  ownershipRenounced?: boolean;
  lpLocked?: boolean;
}
