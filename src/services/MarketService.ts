import { TokenData } from '../types';
import { marketProcessor } from '../indexer/market';
import { EventEmitter } from 'events';

interface MarketDataCache {
  data: TokenData[];
  timestamp: number;
  validityPeriod: number;
}

class MarketService extends EventEmitter {
  private static instance: MarketService;
  private cache: MarketDataCache | null = null;
  private readonly CACHE_VALIDITY = 30000; // 30 seconds
  private updateInterval: NodeJS.Timeout | null = null;
  private errorCount = 0;
  private readonly MAX_ERRORS = 3;
  private readonly ERROR_RESET_INTERVAL = 60000; // 1 minute

  private constructor() {
    super();
    this.startPeriodicUpdate();
  }

  static getInstance(): MarketService {
    if (!MarketService.instance) {
      MarketService.instance = new MarketService();
    }
    return MarketService.instance;
  }

  private startPeriodicUpdate() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }

    this.updateInterval = setInterval(async () => {
      try {
        await this.refreshMarketData();
        this.errorCount = 0; // Reset error count on successful update
      } catch (error) {
        this.handleError('Periodic update failed', error);
      }
    }, this.CACHE_VALIDITY);
  }

  private async refreshMarketData(): Promise<void> {
    try {
      const data = await marketProcessor.getMarketData();
      this.validateMarketData(data);
      
      this.cache = {
        data,
        timestamp: Date.now(),
        validityPeriod: this.CACHE_VALIDITY
      };

      this.emit('marketUpdate', data);
    } catch (error) {
      this.handleError('Failed to refresh market data', error);
      throw error;
    }
  }

  private validateMarketData(data: TokenData[]): void {
    if (!Array.isArray(data)) {
      throw new Error('Invalid market data format');
    }

    for (const token of data) {
      if (!this.isValidToken(token)) {
        throw new Error(`Invalid token data: ${JSON.stringify(token)}`);
      }
    }
  }

  private isValidToken(token: TokenData): boolean {
    return (
      typeof token.address === 'string' &&
      typeof token.symbol === 'string' &&
      typeof token.name === 'string' &&
      typeof token.price === 'number' &&
      !isNaN(token.price) &&
      token.price >= 0 &&
      typeof token.volume24h === 'number' &&
      !isNaN(token.volume24h) &&
      token.volume24h >= 0
    );
  }

  private handleError(message: string, error: unknown): void {
    console.error(message, error);
    this.errorCount++;

    if (this.errorCount >= this.MAX_ERRORS) {
      this.emit('serviceError', new Error('Market service is experiencing issues'));
      setTimeout(() => {
        this.errorCount = 0;
      }, this.ERROR_RESET_INTERVAL);
    }
  }

  private isCacheValid(): boolean {
    return (
      this.cache !== null &&
      Date.now() - this.cache.timestamp < this.cache.validityPeriod
    );
  }

  async getMarketData(): Promise<TokenData[]> {
    try {
      if (this.isCacheValid()) {
        return this.cache!.data;
      }

      await this.refreshMarketData();
      return this.cache!.data;
    } catch (error) {
      this.handleError('Failed to get market data', error);
      throw error;
    }
  }

  async getNewTokens(): Promise<TokenData[]> {
    try {
      const allTokens = await this.getMarketData();
      const now = new Date();
      return allTokens.filter(token => {
        const listingDate = new Date(token.lastUpdated);
        const hoursDiff = (now.getTime() - listingDate.getTime()) / (1000 * 60 * 60);
        return hoursDiff <= 24; // Show tokens listed in the last 24 hours
      });
    } catch (error) {
      this.handleError('Failed to get new tokens', error);
      throw error;
    }
  }

  onMarketUpdate(callback: (tokens: TokenData[]) => void): void {
    this.on('marketUpdate', callback);
  }

  offMarketUpdate(callback: (tokens: TokenData[]) => void): void {
    this.off('marketUpdate', callback);
  }

  onError(callback: (error: Error) => void): void {
    this.on('serviceError', callback);
  }

  offError(callback: (error: Error) => void): void {
    this.off('serviceError', callback);
  }

  // Cleanup method
  destroy(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
    this.removeAllListeners();
    this.cache = null;
  }
}

export const marketService = MarketService.getInstance();
