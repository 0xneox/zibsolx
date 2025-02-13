import { TokenData } from '@/types';
import Redis from 'ioredis';
import { Pool } from 'pg';
import { EventEmitter } from 'events';

export class MarketDataProcessor {
  private static instance: MarketDataProcessor;
  private redis: Redis;
  private pool: Pool;
  private eventEmitter: EventEmitter;

  private constructor() {
    const redisConfig = process.env.REDIS_URL ? 
      { url: process.env.REDIS_URL } : 
      {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD || undefined,
        retryStrategy: (times: number) => {
          if (times > 3) return null;
          return Math.min(times * 1000, 3000);
        }
      };

    this.redis = new Redis(redisConfig);
    this.pool = new Pool({
      user: process.env.DB_USER || 'zibsolx',
      password: process.env.DB_PASSWORD || 'zibsolx_secret',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME || 'zibsolx'
    });
    this.eventEmitter = new EventEmitter();
  }

  static getInstance(): MarketDataProcessor {
    if (!MarketDataProcessor.instance) {
      MarketDataProcessor.instance = new MarketDataProcessor();
    }
    return MarketDataProcessor.instance;
  }

  async start(): Promise<void> {
    try {
      await this.initializeConnections();
      await this.startProcessing();
      console.log('Market data processor started successfully');
    } catch (error) {
      console.error('Error starting market data processor:', error);
      throw error;
    }
  }

  private async initializeConnections(): Promise<void> {
    try {
      // Test Redis connection
      await this.redis.ping();
      console.log('Redis connection established');

      // Test PostgreSQL connection
      await this.pool.query('SELECT NOW()');
      console.log('PostgreSQL connection established');
    } catch (error) {
      console.error('Error initializing connections:', error);
      throw error;
    }
  }

  private async startProcessing(): Promise<void> {
    // Start processing market data
    this.processMarketData();
    
    // Set up interval for regular processing
    setInterval(() => this.processMarketData(), 30000); // Process every 30 seconds
  }

  private async processMarketData(): Promise<void> {
    try {
      const tokens = await this.fetchTokenData();
      await this.updateCache(tokens);
      this.notifySubscribers(tokens);
    } catch (error) {
      console.error('Error processing market data:', error);
    }
  }

  private async fetchTokenData(): Promise<TokenData[]> {
    const result = await this.pool.query(`
      SELECT 
        address,
        symbol,
        name,
        decimals,
        price,
        price_change_24h as "priceChange24h",
        volume_24h as "volume24h",
        market_cap as "marketCap",
        liquidity,
        holders,
        last_updated as "lastUpdated"
      FROM token_market_data
      ORDER BY volume_24h DESC
      LIMIT 100
    `);

    return result.rows;
  }

  private async updateCache(tokens: TokenData[]): Promise<void> {
    try {
      await this.redis.setex('market_data', 300, JSON.stringify(tokens)); // Cache for 5 minutes
    } catch (error) {
      console.error('Error updating cache:', error);
    }
  }

  private notifySubscribers(tokens: TokenData[]): void {
    this.eventEmitter.emit('marketUpdate', tokens);
  }

  public onMarketUpdate(callback: (tokens: TokenData[]) => void): void {
    this.eventEmitter.on('marketUpdate', callback);
  }

  public offMarketUpdate(callback: (tokens: TokenData[]) => void): void {
    this.eventEmitter.off('marketUpdate', callback);
  }

  public async getMarketData(): Promise<TokenData[]> {
    try {
      // Try to get from cache first
      const cached = await this.redis.get('market_data');
      if (cached) {
        return JSON.parse(cached);
      }

      // If not in cache, fetch from database
      return await this.fetchTokenData();
    } catch (error) {
      console.error('Error getting market data:', error);
      return [];
    }
  }

  public async stop(): Promise<void> {
    try {
      // Clear the processing interval
      clearInterval(this.processMarketData as any);

      // Close connections
      await this.redis.quit();
      await this.pool.end();

      // Remove all event listeners
      this.eventEmitter.removeAllListeners();

      console.log('Market data processor stopped successfully');
    } catch (error) {
      console.error('Error stopping market data processor:', error);
      throw error;
    }
  }
}

export const marketProcessor = MarketDataProcessor.getInstance();
