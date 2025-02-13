import NodeCache from 'node-cache';

// Cache configuration
const CACHE_TTL = {
  TOKEN_DATA: 60, // 1 minute
  MARKET_DATA: 300, // 5 minutes
  USER_DATA: 600, // 10 minutes
};

export class Cache {
  private static instance: Cache;
  private cache: NodeCache;
  private requestCounts: Map<string, number>;
  private lastReset: number;

  private constructor() {
    this.cache = new NodeCache({
      stdTTL: 300, // Default TTL: 5 minutes
      checkperiod: 60, // Check for expired keys every 60 seconds
      useClones: false,
    });
    this.requestCounts = new Map();
    this.lastReset = Date.now();
  }

  public static getInstance(): Cache {
    if (!Cache.instance) {
      Cache.instance = new Cache();
    }
    return Cache.instance;
  }

  // Rate limiting
  public checkRateLimit(ip: string, limit: number = 100): boolean {
    // Reset counts every minute
    const now = Date.now();
    if (now - this.lastReset > 60000) {
      this.requestCounts.clear();
      this.lastReset = now;
    }

    const count = this.requestCounts.get(ip) || 0;
    if (count >= limit) {
      return false;
    }

    this.requestCounts.set(ip, count + 1);
    return true;
  }

  // Cache methods
  public async getOrSet<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl: number = CACHE_TTL.TOKEN_DATA
  ): Promise<T> {
    const cached = this.cache.get<T>(key);
    if (cached !== undefined) {
      return cached;
    }

    try {
      const fresh = await fetcher();
      this.cache.set(key, fresh, ttl);
      return fresh;
    } catch (error) {
      // If fetcher fails, try to return stale data
      const stale = this.cache.get<T>(key);
      if (stale !== undefined) {
        return stale;
      }
      throw error;
    }
  }

  public set(key: string, value: any, ttl: number = CACHE_TTL.TOKEN_DATA): boolean {
    return this.cache.set(key, value, ttl);
  }

  public get<T>(key: string): T | undefined {
    return this.cache.get<T>(key);
  }

  public del(key: string): number {
    return this.cache.del(key);
  }

  public flush(): void {
    this.cache.flushAll();
  }

  // Market data specific methods
  public async getMarketData<T>(
    fetcher: () => Promise<T>,
    forceRefresh: boolean = false
  ): Promise<T> {
    const key = 'market_data';
    if (forceRefresh) {
      this.del(key);
    }
    return this.getOrSet(key, fetcher, CACHE_TTL.MARKET_DATA);
  }

  // Token specific methods
  public async getTokenData<T>(
    address: string,
    fetcher: () => Promise<T>
  ): Promise<T> {
    const key = `token_${address}`;
    return this.getOrSet(key, fetcher, CACHE_TTL.TOKEN_DATA);
  }

  // User specific methods
  public async getUserData<T>(
    userId: string,
    fetcher: () => Promise<T>
  ): Promise<T> {
    const key = `user_${userId}`;
    return this.getOrSet(key, fetcher, CACHE_TTL.USER_DATA);
  }
}

export default Cache;
