export interface TokenData {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  price: number;
  priceChange24h: number;
  volume: number;
  volume24h: number;
  marketCap: number;
  liquidity: number;
  holders: number;
  lastUpdated: Date;
  logo?: string;
  currentPrice?: number;
  liquidityToMarketCapRatio?: number;
  safetyScore?: number;
  riskScore?: number;
  momentum?: string[];
  trend?: string[];
}

export interface TokenFilter {
  minPrice?: number;
  maxPrice?: number;
  minVolume24h?: number;
  maxVolume24h?: number;
  minMarketCap?: number;
  maxMarketCap?: number;
  minLiquidity?: number;
  maxLiquidity?: number;
  minHolders?: number;
  maxHolders?: number;
  minSafetyScore?: number;
  maxRiskScore?: number;
  momentum?: string[];
  trend?: string[];
  sortBy?: keyof TokenData;
  sortDirection?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface TokenDetails extends TokenData {
  description?: string;
  website?: string;
  twitter?: string;
  telegram?: string;
  discord?: string;
  github?: string;
  audit?: string;
  kyc?: string;
  totalSupply?: number;
  circulatingSupply?: number;
  launchDate?: Date;
  chain: string;
  pairAddress?: string;
  contractVerified?: boolean;
  ownershipRenounced?: boolean;
  lpLocked?: boolean;
}
