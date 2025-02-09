import axios from "axios";
import { supabase } from "./supabase";

// Razorpay API
const razorpay = axios.create({
  baseURL: import.meta.env.VITE_RAZORPAY_API_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Basic ${btoa(`${import.meta.env.VITE_RAZORPAY_KEY_ID}:${import.meta.env.VITE_RAZORPAY_KEY_SECRET}`)}`,
  },
});
import type { TokenData, TokenDetails } from "@/types/market";

// Jupiter API for Solana DEX aggregator
const jupiterApi = axios.create({
  baseURL: "https://price.jup.ag/v4",
});

// CoinGecko API with pro features
const coingecko = axios.create({
  baseURL: "https://pro-api.coingecko.com/api/v3",
  headers: {
    "x-cg-pro-api-key": import.meta.env.VITE_COINGECKO_API_KEY,
  },
});

// Birdeye API for Solana token data
const birdeye = axios.create({
  baseURL: "https://public-api.birdeye.so/v1",
  headers: {
    "X-API-KEY": import.meta.env.VITE_BIRDEYE_API_KEY,
  },
});

export const login = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
};

export const signup = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) throw error;
  return data;
};

export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

const convertToINR = async (usdPrice: number): Promise<number> => {
  try {
    const response = await axios.get(
      "https://api.exchangerate-api.com/v4/latest/USD",
    );
    const inrRate = response.data.rates.INR;
    return usdPrice * inrRate;
  } catch (error) {
    console.error("Failed to convert to INR:", error);
    return usdPrice * 75; // Fallback conversion rate
  }
};

export const getSolanaTokens = async (
  view: "trending" | "new" | "all" | "gainers" = "all",
): Promise<TokenData[]> => {
  try {
    let params = {
      offset: 0,
      limit: 100,
      type: "meme",
    };

    switch (view) {
      case "trending":
        params = { ...params, sort_by: "v24hUSD", sort_type: "desc" };
        break;
      case "new":
        params = { ...params, sort_by: "created_at", sort_type: "desc" };
        break;
      case "gainers":
        params = { ...params, sort_by: "priceChange24h", sort_type: "desc" };
        break;
      default:
        params = { ...params, sort_by: "mc", sort_type: "desc" };
    }

    const response = await birdeye.get("/tokens/list", { params });

    const tokens = await Promise.all(
      response.data.data.map(async (token: any) => {
        const priceInr = await convertToINR(token.price);
        return {
          id: token.address,
          symbol: token.symbol,
          name: token.name,
          image: token.logoURI,
          current_price: token.price,
          price_inr: priceInr,
          price_change_percentage_24h: token.priceChange24h,
          market_cap: token.mc,
          total_volume: token.v24hUSD,
          circulating_supply: token.supply,
          chain: "solana",
          address: token.address,
          launch_date: token.created_at,
          liquidity: token.liquidity,
          holders: token.holders,
        };
      }),
    );

    return tokens;
  } catch (error) {
    console.error("Failed to fetch Solana tokens:", error);
    return [];
  }
};

export const getTokenDetails = async (
  tokenAddress: string,
  chain: string,
): Promise<TokenDetails | null> => {
  try {
    if (chain === "solana") {
      const [tokenInfo, priceHistory] = await Promise.all([
        birdeye.get(`/tokens/${tokenAddress}`),
        birdeye.get(`/tokens/${tokenAddress}/price`, {
          params: {
            interval: "1d",
            limit: 30,
          },
        }),
      ]);

      const priceInr = await convertToINR(tokenInfo.data.data.price);

      return {
        ...tokenInfo.data.data,
        price_inr: priceInr,
        chart_data: priceHistory.data.data.items.map((item: any) => ({
          timestamp: item.unixTime,
          price: item.value,
        })),
        buy_links: [
          {
            name: "Jupiter",
            url: `https://jup.ag/swap/${tokenAddress}`,
          },
          {
            name: "Raydium",
            url: `https://raydium.io/swap/?inputCurrency=sol&outputCurrency=${tokenAddress}`,
          },
        ],
      };
    }
    return null;
  } catch (error) {
    console.error("Failed to fetch token details:", error);
    return null;
  }
};

export const createRazorpayOrder = async (amount: number) => {
  try {
    const response = await razorpay.post("/orders", {
      amount: amount * 100, // Razorpay expects amount in paise
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to create Razorpay order:", error);
    throw error;
  }
};

export const withdrawFunds = async (
  amount: number,
  method: "bank" | "upi" | "sol",
  details: string,
) => {
  try {
    const { data, error } = await supabase.from("withdrawals").insert([
      {
        user_id: (await supabase.auth.getUser()).data.user?.id,
        amount,
        method,
        details,
        status: "pending",
      },
    ]);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Failed to process withdrawal:", error);
    throw error;
  }
};

export const getMarketData = async (
  chain: "all" | "solana" | "ethereum" | "bsc" = "all",
): Promise<TokenData[]> => {
  try {
    if (chain === "solana" || chain === "all") {
      return await getSolanaTokens();
    }
    return [];
  } catch (error) {
    console.error("Failed to fetch market data:", error);
    return [];
  }
};
