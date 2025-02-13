import { TokenData } from '../types/market';

export const mockTokens: TokenData[] = [
  {
    address: 'So11111111111111111111111111111111111111112',
    symbol: 'SOL',
    name: 'Wrapped SOL',
    decimals: 9,
    price: 101.25,
    volume24h: 1250000,
    priceChange24h: 5.2,
    marketCap: 42000000000,
    liquidity: 8500000,
    holders: 250000,
    lastUpdated: new Date().toISOString(),
    chain: 'solana',
    dexId: 'jupiter',
    pairAddress: '',
    quoteToken: {
      address: '',
      symbol: 'USDC',
      name: 'USD Coin'
    },
    contractVerified: true,
    lpLocked: true
  },
  {
    address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    price: 1.00,
    volume24h: 980000,
    priceChange24h: 0.01,
    marketCap: 25000000000,
    liquidity: 15000000,
    holders: 180000,
    lastUpdated: new Date().toISOString(),
    chain: 'solana',
    dexId: 'jupiter',
    pairAddress: '',
    quoteToken: {
      address: '',
      symbol: 'SOL',
      name: 'Wrapped SOL'
    },
    contractVerified: true,
    lpLocked: true
  },
  {
    address: '7dHbWXmci3dT8UFYWYZweBLXgycu7Y3iL6trKn1Y7ARj',
    symbol: 'BONK',
    name: 'Bonk',
    decimals: 5,
    price: 0.00001234,
    volume24h: 450000,
    priceChange24h: -2.5,
    marketCap: 750000,
    liquidity: 250000,
    holders: 85000,
    lastUpdated: new Date().toISOString(),
    chain: 'solana',
    dexId: 'jupiter',
    pairAddress: '',
    quoteToken: {
      address: '',
      symbol: 'USDC',
      name: 'USD Coin'
    },
    contractVerified: true,
    lpLocked: true
  },
  {
    address: '2FPyTwcZLUg1MDrwsyoP4D6s1tM7hAkHYRjkNb5w6Pxk',
    symbol: 'MNGO',
    name: 'Mango',
    decimals: 6,
    price: 0.0456,
    volume24h: 125000,
    priceChange24h: 1.2,
    marketCap: 4500000,
    liquidity: 850000,
    holders: 45000,
    lastUpdated: new Date().toISOString(),
    chain: 'solana',
    dexId: 'jupiter',
    pairAddress: '',
    quoteToken: {
      address: '',
      symbol: 'USDC',
      name: 'USD Coin'
    },
    contractVerified: true,
    lpLocked: true
  },
  {
    address: '9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E',
    symbol: 'WBTC',
    name: 'Wrapped Bitcoin',
    decimals: 8,
    price: 48250.75,
    volume24h: 850000,
    priceChange24h: 3.1,
    marketCap: 15000000000,
    liquidity: 2500000,
    holders: 75000,
    lastUpdated: new Date().toISOString(),
    chain: 'solana',
    dexId: 'jupiter',
    pairAddress: '',
    quoteToken: {
      address: '',
      symbol: 'USDC',
      name: 'USD Coin'
    },
    contractVerified: true,
    lpLocked: true
  }
];
