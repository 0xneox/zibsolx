export type ChainType = "solana" | "ethereum" | "bsc";

export interface BasicTokenData {
  address: string;
  symbol: string;
  name: string;
  price: number;
  priceChange24h: number;
  volume: number;
  liquidity: number;
  lastUpdated: string;
  verified: boolean;
}

export interface SafetyMetrics {
  safetyScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  priceVolatility: number;
  liquidityToMarketCapRatio: number;
}

export interface TradingMetrics {
  txCount24h: number;
  buyCount24h: number;
  sellCount24h: number;
  holders: number;
}

export interface DexInformation {
  dex: string;
  pairAddress: string;
}

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
  chain: string;
  lastUpdated: string;
  dexId: string;
  pairAddress: string;
  quoteToken: {
    address: string;
    symbol: string;
    name: string;
  };
  volume: number;
  volumeToLiquidityRatio?: number;
  liquidityToMarketCapRatio?: number;
  priceLiquidityRatio?: number;
  opportunityScore?: number;
}

export type MarketView = 'trending' | 'gainers' | 'new' | 'all';

export interface TokenDetails extends TokenData {
  description?: string;
  website?: string;
  twitter?: string;
  telegram?: string;
  discord?: string;
  priceChange1h?: number;
  priceChange7d?: number;
  totalSupply?: number;
  circulatingSupply?: number;
  launchDate?: string;
  tradingEnabled: boolean;
  volume24h: number;
}

export interface MarketState {
  data: TokenData[];
  loading: boolean;
  error: string | null;
}

export interface MarketDataDisplayProps {
  data: TokenData[];
  loading: boolean;
  selectedView: MarketView;
  onViewSelect: (view: MarketView) => void;
}
