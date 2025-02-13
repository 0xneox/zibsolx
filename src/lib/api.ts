import axios from "axios";
import { supabase } from "./supabase";
import type { TokenData, TokenDetails } from "@/types/market";
import { Connection, PublicKey } from "@solana/web3.js";
import { Cache } from "./cache";
import pLimit from "p-limit";
import { mockTokens } from './mockData';

// Rate limiting
const limit = pLimit(10); // Max 10 concurrent requests

// Initialize cache
const cache = Cache.getInstance();

// Create axios instance with retry and timeout
const createAxiosInstance = (baseURL: string) => {
  const instance = axios.create({
    baseURL,
    timeout: 15000,
    headers: {
      'Accept': 'application/json',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    }
  });

  // Add retry logic with exponential backoff
  instance.interceptors.response.use(undefined, async (err) => {
    const { config } = err;
    if (!config || !config.retry) {
      config.retry = 3;
    }
    config.retry -= 1;
    if (config.retry === 0) {
      return Promise.reject(err);
    }
    const delay = Math.min(1000 * (3 - config.retry), 3000);
    await new Promise(resolve => setTimeout(resolve, delay));
    return instance(config);
  });

  return instance;
};

// Initialize API clients with retries and rate limiting
const API_BASE_URL = 'http://localhost:3001/api';
const jupiter = createAxiosInstance(`${API_BASE_URL}/jupiter`);
const birdeye = createAxiosInstance(`${API_BASE_URL}/birdeye`);
const dexscreener = createAxiosInstance(`${API_BASE_URL}/dexscreener`);

// Main market data fetching function with caching and load handling
export async function getMarketData(): Promise<TokenData[]> {
  try {
    const response = await axios.get(`${API_BASE_URL}/market/tokens`);
    if (!response.data || !response.data.prices) {
      throw new Error('Invalid response from price feed');
    }

    const tokens: TokenData[] = response.data.prices.map((token: any) => ({
      address: token.address || '',
      symbol: token.symbol || '',
      name: token.name || '',
      decimals: token.decimals || 18,
      price: Number(token.price) || 0,
      priceChange24h: Number(token.priceChange24h) || 0,
      volume24h: Number(token.volume) || 0,
      marketCap: Number(token.marketCap) || 0,
      liquidity: Number(token.liquidity) || 0,
      holders: Number(token.holders) || 0,
      lastUpdated: token.lastUpdated || new Date().toISOString(),
      logo: token.logo,
      description: token.description,
      website: token.website,
      twitter: token.twitter,
      telegram: token.telegram,
      discord: token.discord,
      github: token.github,
      chain: token.chain || 'unknown',
      dexId: token.dexId || '',
      pairAddress: token.pairAddress || '',
      quoteToken: {
        address: token.quoteToken?.address || '',
        symbol: token.quoteToken?.symbol || '',
        name: token.quoteToken?.name || '',
      },
      totalSupply: Number(token.totalSupply),
      circulatingSupply: Number(token.circulatingSupply),
      launchDate: token.launchDate,
      contractVerified: Boolean(token.contractVerified),
      ownershipRenounced: Boolean(token.ownershipRenounced),
      lpLocked: Boolean(token.lpLocked),
    }));

    // Calculate risk scores and filter out suspicious tokens
    const legitTokens = tokens.filter(token => {
      const volumeToLiquidityRatio = calculateVolumeToLiquidityRatio(token.volume24h, token.liquidity);
      const liquidityToMarketCapRatio = calculateLiquidityToMarketCapRatio(token.liquidity, token.marketCap);

      // Filter out suspicious tokens
      if (
        volumeToLiquidityRatio > 5 || // Volume too high vs liquidity (potential manipulation)
        liquidityToMarketCapRatio < 0.1 || // Low liquidity compared to mcap (potential rug)
        token.holders < 50 // Too few holders
      ) {
        return false;
      }

      // Calculate opportunity score
      const opportunityScore = 
        (liquidityToMarketCapRatio * 20) + // Good liquidity ratio (0-20)
        (token.holders > 1000 ? 20 : token.holders / 50) + // Healthy holder count (0-20)
        (Math.min(volumeToLiquidityRatio * 10, 20)) + // Healthy volume (0-20)
        (token.contractVerified ? 20 : 0) + // Contract verified (0/20)
        (token.lpLocked ? 20 : 0); // LP locked (0/20)

      // Add opportunity score to token data
      return {
        ...token,
        opportunityScore: Math.min(100, opportunityScore)
      };
    });

    return legitTokens;
  } catch (error) {
    console.error('Error fetching market data:', error);
    throw error;
  }
}

// Helper functions for calculating ratios
const calculateVolumeToLiquidityRatio = (volume: number, liquidity: number) => volume / (liquidity || 1);
const calculateLiquidityToMarketCapRatio = (liquidity: number, marketCap: number) => liquidity / (marketCap || 1);

// Helper functions to get token metadata
function getSymbolFromMint(mint: string): string {
  const symbols: { [key: string]: string } = {
    'So11111111111111111111111111111111111111112': 'SOL',
    'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v': 'USDC',
    '7dHbWXmci3dT8UFYWYZweBLXgycu7Y3iL6trKn1Y7ARj': 'USDT',
    '2FPyTwcZLUg1MDrwsyoP4D6s1tM7hAkHYRjkNb5w6Pxk': 'ETH',
    '9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E': 'BTC'
  };
  return symbols[mint] || 'Unknown';
}

function getNameFromMint(mint: string): string {
  const names: { [key: string]: string } = {
    'So11111111111111111111111111111111111111112': 'Solana',
    'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v': 'USD Coin',
    '7dHbWXmci3dT8UFYWYZweBLXgycu7Y3iL6trKn1Y7ARj': 'Tether USD',
    '2FPyTwcZLUg1MDrwsyoP4D6s1tM7hAkHYRjkNb5w6Pxk': 'Ethereum (Wormhole)',
    '9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E': 'Bitcoin (Wormhole)'
  };
  return names[mint] || 'Unknown Token';
}

function getDecimalsFromMint(mint: string): number {
  const decimals: { [key: string]: number } = {
    'So11111111111111111111111111111111111111112': 9,
    'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v': 6,
    '7dHbWXmci3dT8UFYWYZweBLXgycu7Y3iL6trKn1Y7ARj': 6,
    '2FPyTwcZLUg1MDrwsyoP4D6s1tM7hAkHYRjkNb5w6Pxk': 8,
    '9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E': 8
  };
  return decimals[mint] || 9;
}

// Filter functions for different views
export function filterTrendingTokens(tokens: TokenData[]): TokenData[] {
  return tokens.sort((a, b) => b.volume24h - a.volume24h).slice(0, 5);
}

export function filterGainerTokens(tokens: TokenData[]): TokenData[] {
  return tokens.sort((a, b) => b.priceChange24h - a.priceChange24h).slice(0, 5);
}

export function filterNewTokens(tokens: TokenData[]): TokenData[] {
  return tokens.sort((a, b) => 
    new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
  ).slice(0, 5);
}

export function filterTokensByView(tokens: TokenData[], view: string): TokenData[] {
  switch (view) {
    case 'trending':
      return filterTrendingTokens(tokens);
    case 'gainers':
      return filterGainerTokens(tokens);
    case 'new':
      return filterNewTokens(tokens);
    case 'all':
    default:
      return tokens;
  }
}

// Initialize Solana connection with fallback nodes and load balancing
const RPC_ENDPOINTS = [
  "https://api.mainnet-beta.solana.com",
  "https://solana-api.projectserum.com",
  "https://rpc.ankr.com/solana",
  "https://api.metaplex.solana.com",
  "https://api.mainnet.rpcpool.com",
];

let currentRpcIndex = 0;
const connections = RPC_ENDPOINTS.map(endpoint => new Connection(endpoint));

// Load balancing for RPC endpoints
const getNextConnection = () => {
  currentRpcIndex = (currentRpcIndex + 1) % connections.length;
  return connections[currentRpcIndex];
};

// Fetch token metadata with retries and caching
async function getTokenMetadata(mint: string) {
  return cache.getTokenData(mint, async () => {
    for (let i = 0; i < connections.length; i++) {
      try {
        const connection = getNextConnection();
        const publicKey = new PublicKey(mint);
        const info = await connection.getParsedAccountInfo(publicKey);
        return info.value?.data;
      } catch (error) {
        console.error(`Error fetching token metadata from RPC ${i}:`, error);
        if (i === connections.length - 1) throw error;
      }
    }
  });
}

// Fallback to using only DexScreener for now
export async function getSolanaTokens(
  view: "trending" | "new" | "all" | "gainers" = "all",
): Promise<TokenData[]> {
  try {
    let response;
    
    // For trending and all views, we'll get the most liquid pairs
    if (view === "trending" || view === "all") {
      console.log("Fetching top Solana pairs...");
      
      // Get pairs from all major Solana DEXes
      const dexes = [
        "raydium solana",
        "orca solana",
        "jupiter solana",
        "openbook solana",
        "phoenix solana",
        "marinade solana",
        "meteora solana",
        "invariant solana",
        "crema solana",
        "aldrin solana"
      ];

      // Fetch from all DEXes in parallel
      const responses = await Promise.all(
        dexes.map(dex => 
          dexscreener.get("/dex/search", {
            params: { q: dex }
          }).catch(err => {
            console.warn(`Failed to fetch from ${dex}:`, err);
            return { data: { pairs: [] } };
          })
        )
      );

      // Combine all pairs
      const allPairs = responses.flatMap(response => response.data?.pairs || []);

      if (allPairs.length === 0) {
        console.error("No pairs found from any DEX");
        return [];
      }

      // Remove duplicates by base token address
      const uniquePairs = Array.from(
        new Map(allPairs.map(pair => [pair.baseToken.address, pair])).values()
      );

      const tokens = uniquePairs
        .filter(pair => {
          const isValid = pair?.baseToken && 
                         pair.priceUsd && 
                         pair.chainId === "solana" &&
                         pair.liquidity?.usd > 50000; // Increased liquidity threshold
          return isValid;
        })
        .map(pair => ({
          address: pair.baseToken.address,
          symbol: pair.baseToken.symbol || "UNKNOWN",
          name: pair.baseToken.name || pair.baseToken.symbol || "Unknown Token",
          price: Number(pair.priceUsd) || 0,
          priceChange24h: Number(pair.priceChange?.h24 || 0),
          volume: Number(pair.volume?.h24 || 0),
          marketCap: Number(pair.marketCap || 0),
          liquidity: Number(pair.liquidity?.usd || 0),
          lastUpdated: new Date().toISOString(),
          dexId: pair.dexId,
          pairAddress: pair.pairAddress,
          quoteToken: {
            address: pair.quoteToken.address,
            symbol: pair.quoteToken.symbol,
            name: pair.quoteToken.name
          }
        }));

      // For trending, sort by 24h volume and ensure minimum volume
      if (view === "trending") {
        return tokens
          .filter(token => token.volume > 5000) // Lowered minimum volume requirement
          .sort((a, b) => b.volume - a.volume)
          .slice(0, 100); // Show top 100 tokens
      }

      return tokens
        .sort((a, b) => b.marketCap - a.marketCap)
        .slice(0, 100);
    } 
    // For gainers view, we'll search for pairs with positive price change
    else if (view === "gainers") {
      console.log("Fetching Solana gainers...");
      
      // Get pairs from all major Solana DEXes
      const dexes = [
        "raydium solana",
        "orca solana",
        "jupiter solana",
        "openbook solana",
        "phoenix solana",
        "marinade solana",
        "meteora solana",
        "invariant solana",
        "crema solana",
        "aldrin solana"
      ];

      // Fetch from all DEXes in parallel
      const responses = await Promise.all(
        dexes.map(dex => 
          dexscreener.get("/dex/search", {
            params: { q: dex }
          }).catch(err => {
            console.warn(`Failed to fetch from ${dex}:`, err);
            return { data: { pairs: [] } };
          })
        )
      );

      // Combine all pairs
      const allPairs = responses.flatMap(response => response.data?.pairs || []);

      if (allPairs.length === 0) {
        console.error("No pairs found from any DEX");
        return [];
      }

      // Remove duplicates and filter for quality tokens
      const uniquePairs = Array.from(
        new Map(allPairs.map(pair => [pair.baseToken.address, pair])).values()
      );

      const qualityPairs = uniquePairs.filter(pair => {
        const isValid = pair?.baseToken && 
                       pair.priceUsd && 
                       pair.chainId === "solana" &&
                       pair.liquidity?.usd > 25000 && // Minimum liquidity
                       Number(pair.volume?.h24) > 5000 && // Minimum 24h volume
                       pair.txns?.h24?.buys > 10 && // Minimum buy transactions
                       pair.txns?.h24?.sells > 5; // Minimum sell transactions (avoid honeypots)
        return isValid;
      });

      // Calculate additional metrics and map to our format
      const tokens = qualityPairs.map(pair => {
        // Calculate price changes for different timeframes
        const priceChange1h = Number(pair.priceChange?.h1 || 0);
        const priceChange24h = Number(pair.priceChange?.h24 || 0);
        const priceChange7d = Number(pair.priceChange?.h24 || 0) * 7; // Approximate 7d change

        // Calculate buy/sell ratio
        const buyCount = Number(pair.txns?.h24?.buys || 0);
        const sellCount = Number(pair.txns?.h24?.sells || 0);
        const buySellRatio = sellCount > 0 ? buyCount / sellCount : 0;

        // Calculate average trade size
        const volume24h = Number(pair.volume?.h24 || 0);
        const totalTrades = buyCount + sellCount;
        const avgTradeSize = totalTrades > 0 ? volume24h / totalTrades : 0;

        // Calculate price/liquidity ratio (PLR)
        const liquidity = Number(pair.liquidity?.usd || 0);
        const priceLiquidityRatio = liquidity > 0 ? volume24h / liquidity : 0;

        return {
          address: pair.baseToken.address,
          symbol: pair.baseToken.symbol || "UNKNOWN",
          name: pair.baseToken.name || pair.baseToken.symbol || "Unknown Token",
          price: Number(pair.priceUsd) || 0,
          priceChange1h,
          priceChange24h,
          priceChange7d,
          volume: volume24h,
          marketCap: Number(pair.marketCap || 0),
          liquidity,
          lastUpdated: new Date().toISOString(),
          dexId: pair.dexId,
          pairAddress: pair.pairAddress,
          quoteToken: {
            address: pair.quoteToken.address,
            symbol: pair.quoteToken.symbol,
            name: pair.quoteToken.name
          },
          // Trading metrics
          buySellRatio,
          avgTradeSize,
          buyCount,
          sellCount,
          totalTrades,
          // Advanced metrics for new tokens
          createdAt: pair.pairCreatedAt,
          minutesSinceCreation: (Date.now() - new Date(pair.pairCreatedAt).getTime()) / (1000 * 60),
          volumePerMinute: volume24h / Math.min((Date.now() - new Date(pair.pairCreatedAt).getTime()) / (1000 * 60), 1440), // Cap at 24h
          liquidityToMarketCapRatio: Number(pair.marketCap || 0) > 0 ? liquidity / Number(pair.marketCap || 0) : 0,
          volumeToLiquidityRatio: liquidity > 0 ? volume24h / liquidity : 0,
          uniqueWallets: new Set([
            ...(pair.txns?.h24?.buys_addresses || []),
            ...(pair.txns?.h24?.sells_addresses || [])
          ]).size,
          avgHoldTime: totalTrades > 0 ? (Date.now() - new Date(pair.pairCreatedAt).getTime()) / (1000 * 60) / totalTrades : 0,
          isHighRisk: 
            buySellRatio > 10 || // Too many buys vs sells (potential pump)
            volumeToLiquidityRatio > 5 || // Volume too high vs liquidity (potential manipulation)
            avgTradeSize > liquidity * 0.1 || // Large trades vs liquidity (potential whale manipulation)
            liquidityToMarketCapRatio < 0.1 || // Low liquidity compared to mcap (potential rug)
            new Set([
              ...(pair.txns?.h24?.buys_addresses || []),
              ...(pair.txns?.h24?.sells_addresses || [])
            ]).size < 10, // Too few traders (potential manipulation)
          opportunityScore: Math.min(100, Math.max(0,
            (liquidityToMarketCapRatio * 20) + // Good liquidity ratio (0-20)
            (Math.min(new Set([
              ...(pair.txns?.h24?.buys_addresses || []),
              ...(pair.txns?.h24?.sells_addresses || [])
            ]).size, 100) * 0.2) + // Number of traders (0-20)
            (Math.min(volumeToLiquidityRatio * 10, 20)) + // Healthy volume (0-20)
            (Math.min(totalTrades / 10, 20)) + // Active trading (0-20)
            (buySellRatio > 0.5 && buySellRatio < 5 ? 20 : 0) // Healthy buy/sell ratio (0/20)
          ))
        };
      });

      // Filter out potential manipulated tokens
      const legitTokens = tokens.filter(token => {
        // Avoid tokens with suspicious trading patterns
        const isSuspicious = 
          token.buySellRatio > 10 || // Too many buys vs sells
          token.priceLiquidityRatio > 5 || // Volume too high compared to liquidity
          token.avgTradeSize > token.liquidity * 0.1; // Single trades too large vs liquidity
        
        return !isSuspicious;
      });

      // Sort by 24h price change by default, but ensure some recent volume
      return legitTokens
        .sort((a, b) => b.priceChange24h - a.priceChange24h)
        .slice(0, 100);
    }
    // For new tokens, we'll get recently created pairs with advanced safety metrics
    else if (view === "new") {
      console.log("Fetching new Solana tokens with safety checks...");
      
      // Get pairs from all major DEXes
      const dexes = [
        "raydium solana",
        "orca solana",
        "jupiter solana",
        "openbook solana",
        "phoenix solana",
        "marinade solana",
        "meteora solana",
        "invariant solana",
        "crema solana",
        "aldrin solana"
      ];

      // Fetch from all DEXes in parallel
      const responses = await Promise.all(
        dexes.map(dex => 
          dexscreener.get("/dex/search", {
            params: { q: dex }
          }).catch(err => {
            console.warn(`Failed to fetch from ${dex}:`, err);
            return { data: { pairs: [] } };
          })
        )
      );

      // Combine all pairs
      const allPairs = responses.flatMap(response => response.data?.pairs || []);

      if (allPairs.length === 0) {
        console.error("No pairs found from any DEX");
        return [];
      }

      // Remove duplicates by base token address
      const uniquePairs = Array.from(
        new Map(allPairs.map(pair => [pair.baseToken.address, pair])).values()
      );

      // Last 48 hours for new tokens
      const cutoffTime = Date.now() - 48 * 60 * 60 * 1000;

      // Calculate metrics and apply strict filtering
      const tokens = uniquePairs
        .filter(pair => {
          const createdTime = new Date(pair.pairCreatedAt).getTime();
          const isValid = pair?.baseToken && 
                         pair.priceUsd && 
                         pair.chainId === "solana" &&
                         createdTime > cutoffTime;
          return isValid;
        })
        .map(pair => {
          // Basic token info
          const price = Number(pair.priceUsd) || 0;
          const volume24h = Number(pair.volume?.h24 || 0);
          const liquidity = Number(pair.liquidity?.usd || 0);
          const marketCap = Number(pair.marketCap || 0);
          
          // Trading metrics
          const buyCount = Number(pair.txns?.h24?.buys || 0);
          const sellCount = Number(pair.txns?.h24?.sells || 0);
          const totalTrades = buyCount + sellCount;
          const buySellRatio = sellCount > 0 ? buyCount / sellCount : 0;
          const avgTradeSize = totalTrades > 0 ? volume24h / totalTrades : 0;
          
          // Safety metrics
          const minutesSinceCreation = (Date.now() - new Date(pair.pairCreatedAt).getTime()) / (1000 * 60);
          const volumePerMinute = volume24h / Math.min(minutesSinceCreation, 1440); // Cap at 24h
          const liquidityToMarketCapRatio = marketCap > 0 ? liquidity / marketCap : 0;
          const volumeToLiquidityRatio = liquidity > 0 ? volume24h / liquidity : 0;
          const avgHoldTime = totalTrades > 0 ? minutesSinceCreation / totalTrades : 0;
          
          // Unique holders (if available) or estimate from transactions
          const uniqueWallets = new Set(
            [
              ...(pair.txns?.h24?.buys_addresses || []),
              ...(pair.txns?.h24?.sells_addresses || [])
            ]
          ).size;

          // Calculate risk metrics
          const isHighRisk = 
            buySellRatio > 10 || // Too many buys vs sells (potential pump)
            volumeToLiquidityRatio > 5 || // Volume too high vs liquidity (potential manipulation)
            avgTradeSize > liquidity * 0.1 || // Large trades vs liquidity (potential whale manipulation)
            liquidityToMarketCapRatio < 0.1 || // Low liquidity compared to mcap (potential rug)
            uniqueWallets < 10; // Too few traders (potential manipulation)

          // Calculate opportunity score (0-100)
          const opportunityScore = Math.min(100, Math.max(0,
            (liquidityToMarketCapRatio * 20) + // Good liquidity ratio (0-20)
            (Math.min(uniqueWallets, 100) * 0.2) + // Number of traders (0-20)
            (Math.min(volumeToLiquidityRatio * 10, 20)) + // Healthy volume (0-20)
            (Math.min(totalTrades / 10, 20)) + // Active trading (0-20)
            (buySellRatio > 0.5 && buySellRatio < 5 ? 20 : 0) // Healthy buy/sell ratio (0/20)
          ));

          return {
            address: pair.baseToken.address,
            symbol: pair.baseToken.symbol || "UNKNOWN",
            name: pair.baseToken.name || pair.baseToken.symbol || "Unknown Token",
            price,
            priceChange1h: Number(pair.priceChange?.h1 || 0),
            priceChange24h: Number(pair.priceChange?.h24 || 0),
            priceChange7d: 0, // New token, no 7d data
            volume: volume24h,
            marketCap,
            liquidity,
            lastUpdated: new Date().toISOString(),
            dexId: pair.dexId,
            pairAddress: pair.pairAddress,
            quoteToken: {
              address: pair.quoteToken.address,
              symbol: pair.quoteToken.symbol,
              name: pair.quoteToken.name
            },
            // Trading metrics
            buySellRatio,
            avgTradeSize,
            buyCount,
            sellCount,
            totalTrades,
            // Advanced metrics for new tokens
            createdAt: pair.pairCreatedAt,
            minutesSinceCreation,
            volumePerMinute,
            liquidityToMarketCapRatio,
            volumeToLiquidityRatio,
            uniqueWallets,
            avgHoldTime,
            isHighRisk,
            opportunityScore
          };
        })
        .sort((a, b) => b.opportunityScore - a.opportunityScore) // Sort by opportunity score
        .slice(0, 100);

      return tokens;
    }

    return [];
  } catch (error) {
    console.error("Error fetching Solana tokens:", error);
    return [];
  }
}

export async function getTokenDetails(
  tokenAddress: string,
  chain: "solana" | "ethereum" | "bsc",
): Promise<TokenDetails | null> {
  try {
    if (chain === "solana") {
      const response = await dexscreener.get(`/dex/tokens/${tokenAddress}`);
      const pair = response.data.pairs[0];
      
      if (!pair) return null;
      
      return {
        address: pair.baseToken.address,
        symbol: pair.baseToken.symbol,
        name: pair.baseToken.name,
        price: Number(pair.priceUsd),
        priceChange24h: Number(pair.priceChange.h24),
        volume: Number(pair.volume.h24),
        marketCap: Number(pair.marketCap),
        supply: Number(pair.baseToken.totalSupply || 0),
        change24h: Number(pair.priceChange.h24),
        liquidity: Number(pair.liquidity.usd),
        holders: 0, // DexScreener doesn't provide holder count
        description: "",
        lastUpdated: new Date().toISOString()
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching token details:", error);
    return null;
  }
}

export async function createRazorpayOrder(amount: number) {
  try {
    const response = await dexscreener.post("/orders", {
      amount: amount * 100, // Convert to paise
      currency: "INR",
      payment_capture: 1,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    throw error;
  }
}

interface WithdrawFundsParams {
  amount: number;
  address: string;
  method: "sol";
}

export async function withdrawFunds({ amount, address, method }: WithdrawFundsParams) {
  try {
    // Store withdrawal request in Supabase
    const { data, error } = await supabase
      .from("withdrawals")
      .insert([
        {
          amount,
          address,
          method,
          status: "pending",
        },
      ])
      .select();

    if (error) throw error;

    // In a real application, you would initiate the blockchain transaction here
    // For now, we'll just return success
    return { success: true };
  } catch (error) {
    console.error("Error processing withdrawal:", error);
    throw error;
  }
}

export async function getNewTokens(): Promise<TokenData[]> {
  try {
    // Get new tokens from DexScreener
    const dexscreenerTokens = await getSolanaTokens("new");

    // Get new pairs from DexScreener
    const { data: dexData } = await dexscreener.get("/dex/search/new");
    const newDexPairs = dexData.pairs
      .filter((pair: any) => {
        const createdAt = new Date(pair.createAt).getTime();
        const now = Date.now();
        const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;
        return createdAt > oneWeekAgo;
      })
      .map((pair: any) => ({
        address: pair.baseToken.address,
        name: pair.baseToken.name,
        symbol: pair.baseToken.symbol,
        price: parseFloat(pair.priceUsd),
        volume: pair.volume.h24,
        marketCap: pair.marketCap,
        priceChange24h: pair.priceChange24h,
        verified: false,
        createdAt: pair.createAt,
        dexId: pair.dexId,
        pairAddress: pair.pairAddress,
      }));

    // Combine and deduplicate tokens
    const allTokens = [...dexscreenerTokens, ...newDexPairs];
    const uniqueTokens = Array.from(
      new Map(allTokens.map(token => [token.address, token]))
    ).map(([_, token]) => token);

    // Sort by creation date
    return uniqueTokens.sort((a: any, b: any) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  } catch (error) {
    console.error("Failed to fetch new tokens:", error);
    return [];
  }
}

export async function getTokenPairData(tokenAddress: string): Promise<any> {
  try {
    const { data } = await dexscreener.get(`/dex/tokens/${tokenAddress}`);
    return {
      price: data.price,
      volume: data.volume,
      marketCap: data.marketCap,
      supply: data.supply,
      change24h: data.change24h
    };
  } catch (error) {
    console.error("Failed to fetch token pair data:", error);
    return null;
  }
}

export async function login(email: string, password: string) {
  try {
    const response = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return response;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
}

export async function signup(email: string, password: string) {
  try {
    const response = await supabase.auth.signUp({
      email,
      password,
    });
    return response;
  } catch (error) {
    console.error("Error signing up:", error);
    throw error;
  }
}

export async function logout() {
  try {
    await supabase.auth.signOut();
  } catch (error) {
    console.error("Error logging out:", error);
  }
}

export async function convertToINR(usdPrice: number): Promise<number> {
  try {
    const response = await dexscreener.get("/coins", {
      params: {
        id: "tether"
      }
    });
    const inrRate = response.data?.data?.[0]?.price?.inr;
    return usdPrice * (inrRate || 0);
  } catch (error) {
    console.error("Error converting USD to INR:", error);
    return usdPrice * 83; // Fallback conversion rate
  }
}

function calculateSafetyMetrics(token: any) {
  const volume = parseFloat(token.volume24h || token.volume?.h24 || '0');
  const liquidity = parseFloat(token.liquidity?.usd || token.liquidity || '0');
  const priceChange = parseFloat(token.priceChange?.h24 || token.priceChange24h || '0');
  const txCount = parseInt(token.txCount24h || token.txns?.h24?.total || '0');

  // Calculate safety score (0-100)
  const liquidityScore = Math.min(liquidity / 1000000, 1) * 30;
  const volumeScore = Math.min(volume / 100000, 1) * 20;
  const txScore = Math.min(txCount / 100, 1) * 20;
  const volatilityScore = (100 - Math.min(Math.abs(priceChange), 100)) / 100 * 30;
  
  const safetyScore = liquidityScore + volumeScore + txScore + volatilityScore;

  // Determine risk level
  let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'HIGH';
  if (safetyScore >= 70) riskLevel = 'LOW';
  else if (safetyScore >= 40) riskLevel = 'MEDIUM';

  return {
    safetyScore,
    riskLevel,
    priceVolatility: Math.abs(priceChange),
    liquidityToMarketCapRatio: liquidity / (volume * 24) // Rough estimate
  };
}

export async function getMarketDataNew(): Promise<TokenData[]> {
  try {
    const [jupiterData, birdeyeData, dexscreenerData] = await Promise.all([
      getJupiterDataNew(),
      getBirdeyeDataNew(),
      getDexScreenerDataNew()
    ]);

    const allData = [...jupiterData, ...birdeyeData, ...dexscreenerData];
    const legitTokens = allData.filter((token: TokenData) => {
      const volumeToLiqRatio = calculateVolumeToLiquidityRatio(token.volume24h, token.liquidity);
      const liqToMcapRatio = calculateLiquidityToMarketCapRatio(token.liquidity, token.marketCap);

      // Filter out suspicious tokens
      if (
        volumeToLiqRatio > 5 || // Volume too high vs liquidity (potential manipulation)
        liqToMcapRatio < 0.1 || // Low liquidity compared to mcap (potential rug)
        token.holders < 50 // Too few holders
      ) {
        return false;
      }

      return true;
    }).map((token: TokenData): TokenData & { opportunityScore: number } => {
      const volumeToLiqRatio = calculateVolumeToLiquidityRatio(token.volume24h, token.liquidity);
      const liqToMcapRatio = calculateLiquidityToMarketCapRatio(token.liquidity, token.marketCap);

      // Calculate opportunity score
      const opportunityScore = 
        (liqToMcapRatio * 20) + // Good liquidity ratio (0-20)
        (token.holders > 1000 ? 20 : token.holders / 50) + // Healthy holder count (0-20)
        (Math.min(volumeToLiqRatio * 10, 20)) + // Healthy volume (0-20)
        (token.contractVerified ? 20 : 0) + // Contract verified (0/20)
        (token.lpLocked ? 20 : 0); // LP locked (0/20)

      return {
        ...token,
        opportunityScore: Math.min(100, opportunityScore)
      };
    });

    return legitTokens;
  } catch (error) {
    console.error('Error fetching market data:', error);
    return [];
  }
}

export async function getJupiterDataNew(): Promise<TokenData[]> {
  try {
    const response = await axios.get(`${API_BASE_URL}/jupiter/tokens`);
    const data = response.data.data;
    
    return Object.entries(data).map(([symbol, details]: [string, any]): TokenData => ({
      address: details.address || '',
      symbol: symbol || '',
      name: details.name || '',
      decimals: details.decimals || 18,
      price: Number(details.price) || 0,
      priceChange24h: Number(details.priceChange24h) || 0,
      volume24h: Number(details.volume) || 0,
      marketCap: Number(details.marketCap) || 0,
      liquidity: Number(details.liquidity) || 0,
      holders: Number(details.holders) || 0,
      lastUpdated: new Date().toISOString(),
      chain: 'solana',
      dexId: 'jupiter',
      pairAddress: details.pairAddress || '',
      quoteToken: {
        address: '',
        symbol: 'SOL',
        name: 'Solana'
      },
      contractVerified: Boolean(details.contractVerified),
      lpLocked: Boolean(details.lpLocked)
    }));
  } catch (error) {
    console.error('Error fetching Jupiter data:', error);
    return [];
  }
}

export async function getBirdeyeDataNew(): Promise<TokenData[]> {
  try {
    const response = await axios.get(`${API_BASE_URL}/birdeye/public/multi_price?list_address=SOL,USDC,USDT`, {
      headers: {
        'X-API-KEY': 'your-api-key',  // Replace with actual API key if needed
        'Accept': 'application/json'
      }
    });
    
    return Object.entries(response.data.data).map(([address, details]: [string, any]): TokenData => ({
      address: address,
      symbol: details.symbol || '',
      name: details.name || '',
      decimals: details.decimals || 18,
      price: Number(details.price) || 0,
      priceChange24h: Number(details.priceChange24h) || 0,
      volume24h: Number(details.volume) || 0,
      marketCap: Number(details.marketCap) || 0,
      liquidity: Number(details.liquidity) || 0,
      holders: Number(details.holders) || 0,
      lastUpdated: new Date().toISOString(),
      chain: 'solana',
      dexId: 'birdeye',
      pairAddress: details.pairAddress || '',
      quoteToken: {
        address: '',
        symbol: 'SOL',
        name: 'Solana'
      },
      contractVerified: Boolean(details.contractVerified),
      lpLocked: Boolean(details.lpLocked)
    }));
  } catch (error) {
    console.error('Error fetching Birdeye data:', error);
    return [];
  }
}

export async function getDexScreenerDataNew(): Promise<TokenData[]> {
  try {
    const response = await axios.get(`${API_BASE_URL}/dexscreener/latest/dex/tokens/SOL,USDC,USDT`);
    const pairs = response.data.pairs || [];
    
    return pairs.map((pair: any): TokenData => ({
      address: pair.baseToken.address || '',
      symbol: pair.baseToken.symbol || '',
      name: pair.baseToken.name || '',
      decimals: 18,
      price: parseFloat(pair.priceUsd) || 0,
      priceChange24h: pair.priceChange24h || 0,
      volume24h: pair.volume24h || 0,
      marketCap: pair.marketCap || 0,
      liquidity: pair.liquidity || 0,
      holders: 0,
      lastUpdated: new Date().toISOString(),
      chain: 'solana',
      dexId: 'dexscreener',
      pairAddress: pair.pairAddress || '',
      quoteToken: {
        address: pair.quoteToken?.address || '',
        symbol: pair.quoteToken?.symbol || 'SOL',
        name: pair.quoteToken?.name || 'Solana'
      },
      contractVerified: false,
      lpLocked: false
    }));
  } catch (error) {
    console.error('Error fetching DexScreener data:', error);
    return [];
  }
}

export interface TokenDetails extends TokenData {
  volume24h: number;
  liquidity: number;
  marketCap: number;
  holders: number;
}
