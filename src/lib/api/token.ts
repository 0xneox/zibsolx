import { TokenData, TokenDetails } from '../../types/market';
import { JUPITER_PRICE_API_URL } from '../../config';

export class TokenAPI {
  private static transformJupiterToken(jupiterToken: any): TokenData {
    const token: TokenData = {
      address: jupiterToken.address,
      symbol: jupiterToken.symbol,
      name: jupiterToken.name,
      decimals: jupiterToken.decimals || 9,
      price: Number(jupiterToken.price),
      priceChange24h: Number(jupiterToken.priceChange24h || 0),
      volume24h: Number(jupiterToken.volume24h || 0),
      volume: Number(jupiterToken.volume || 0),
      marketCap: Number(jupiterToken.marketCap || 0),
      liquidity: Number(jupiterToken.liquidity || 0),
      holders: Number(jupiterToken.holders || 0),
      chain: 'solana',
      lastUpdated: jupiterToken.lastUpdated || new Date().toISOString(),
      dexId: jupiterToken.dexId || '',
      pairAddress: jupiterToken.pairAddress || '',
      quoteToken: {
        address: jupiterToken.quoteToken?.address || '',
        symbol: jupiterToken.quoteToken?.symbol || '',
        name: jupiterToken.quoteToken?.name || ''
      }
    };

    // Calculate ratios
    if (token.volume && token.liquidity && token.liquidity > 0) {
      token.volumeToLiquidityRatio = token.volume / token.liquidity;
    }
    if (token.liquidity && token.marketCap && token.marketCap > 0) {
      token.liquidityToMarketCapRatio = token.liquidity / token.marketCap;
    }

    return token;
  }

  static async getTokens(): Promise<TokenData[]> {
    try {
      const response = await fetch(JUPITER_PRICE_API_URL);
      if (!response.ok) throw new Error('Failed to fetch token data');
      const data = await response.json();
      return data.data.map(this.transformJupiterToken);
    } catch (error) {
      console.error('Error fetching tokens:', error);
      return [];
    }
  }

  static async getTokenDetails(address: string): Promise<TokenDetails | null> {
    try {
      const tokens = await this.getTokens();
      const token = tokens.find(t => t.address === address);
      if (!token) return null;
      return {
        ...token,
        tradingEnabled: true,
        volume24h: token.volume24h || 0
      };
    } catch (error) {
      console.error('Error fetching token details:', error);
      return null;
    }
  }
}
