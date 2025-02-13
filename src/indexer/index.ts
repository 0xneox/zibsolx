import { Connection, PublicKey } from '@solana/web3.js';
import { Pool } from 'pg';
import Redis from 'ioredis';
import { EventEmitter } from 'events';
import NodeCache from 'node-cache';

// In-memory cache as fallback
const memoryCache = new NodeCache();

// Database connection (optional)
let pool: Pool | null = null;
if (process.env.POSTGRES_URL) {
  pool = new Pool({
    connectionString: process.env.POSTGRES_URL
  });
}

// Redis connection (optional)
let redis: Redis | null = null;
if (process.env.REDIS_URL) {
  redis = new Redis(process.env.REDIS_URL);
}

// Solana connection
const connection = new Connection(process.env.VITE_SOLANA_RPC_URL || '', 'confirmed');

// Event emitter for real-time updates
export const marketEvents = new EventEmitter();

class TokenIndexer {
  private static instance: TokenIndexer;
  private isIndexing: boolean = false;
  private connection: Connection;

  private constructor() {
    this.connection = new Connection(process.env.VITE_SOLANA_RPC_URL || '', 'confirmed');
  }

  static getInstance(): TokenIndexer {
    if (!TokenIndexer.instance) {
      TokenIndexer.instance = new TokenIndexer();
    }
    return TokenIndexer.instance;
  }

  async start() {
    if (this.isIndexing) return;
    this.isIndexing = true;

    try {
      // Subscribe to program logs
      connection.onLogs('all', (logs) => {
        this.processLogs(logs);
      });

      await this.indexExistingTokens();
      this.startMarketDataUpdater();
    } catch (error) {
      console.error('Error starting token indexer:', error);
      this.isIndexing = false;
    }
  }

  private async indexExistingTokens() {
    // Implementation will depend on your specific needs
    console.log('Indexing existing tokens...');
  }

  private async processLogs(logs: any) {
    // Implementation will depend on your specific needs
    console.log('Processing logs...');
  }

  private startMarketDataUpdater() {
    setInterval(() => this.updateMarketData(), 60000); // Update every minute
  }

  private async updateMarketData() {
    try {
      // Implementation will depend on your specific needs
      console.log('Updating market data...');
    } catch (error) {
      console.error('Error updating market data:', error);
    }
  }

  async getTokenData(address: string) {
    try {
      // Try Redis first if available
      if (redis) {
        const cachedData = await redis.get(`token:${address}`);
        if (cachedData) return JSON.parse(cachedData);
      }

      // Try memory cache
      const memoryCachedData = memoryCache.get(`token:${address}`);
      if (memoryCachedData) return memoryCachedData;

      // Try database if available
      if (pool) {
        const result = await pool.query('SELECT * FROM tokens WHERE address = $1', [address]);
        if (result.rows.length > 0) {
          const data = result.rows[0];
          // Cache the result
          if (redis) await redis.set(`token:${address}`, JSON.stringify(data));
          memoryCache.set(`token:${address}`, data);
          return data;
        }
      }

      return null;
    } catch (error) {
      console.error('Error getting token data:', error);
      return null;
    }
  }

  async getAllTokens() {
    try {
      // Try Redis first if available
      if (redis) {
        const cachedData = await redis.get('all_tokens');
        if (cachedData) return JSON.parse(cachedData);
      }

      // Try memory cache
      const memoryCachedData = memoryCache.get('all_tokens');
      if (memoryCachedData) return memoryCachedData;

      // Try database if available
      if (pool) {
        const result = await pool.query('SELECT * FROM tokens');
        const data = result.rows;
        // Cache the result
        if (redis) await redis.set('all_tokens', JSON.stringify(data));
        memoryCache.set('all_tokens', data);
        return data;
      }

      return [];
    } catch (error) {
      console.error('Error getting all tokens:', error);
      return [];
    }
  }
}

// Export singleton instance
export const tokenIndexer = TokenIndexer.getInstance();
