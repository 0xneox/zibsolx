import express from 'express';
import cors from 'cors';
import { Connection, PublicKey } from '@solana/web3.js';
import { Market } from '@project-serum/serum';
import winston from 'winston';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';

// Configure logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
});

// Initialize Solana connection
const connection = new Connection(
  process.env.SOLANA_RPC_URL || 'http://solana-node:8899',
  'confirmed'
);

// Known DEX pools and markets
const MARKETS = {
  // Orca SOL/USDC pool
  'SOL/USDC': new PublicKey('HJPjoWUrhoZzkNfRpHuieeFk9WcZWjwy6PBjDQ5K9oq9'),
  // Raydium SOL/USDC pool
  'SOL/USDC_RAY': new PublicKey('58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2'),
  // Add more pools as needed
};

async function getPoolData(poolAddress: PublicKey) {
  try {
    const accountInfo = await connection.getAccountInfo(poolAddress);
    if (!accountInfo) {
      throw new Error('Pool not found');
    }

    // Parse pool data based on the DEX format
    // This is a simplified example - you'll need to implement proper parsing
    // based on the specific DEX's pool structure
    const data = accountInfo.data;
    const tokenAAmount = data.readBigUInt64LE(0);
    const tokenBAmount = data.readBigUInt64LE(8);

    return {
      tokenAAmount,
      tokenBAmount
    };
  } catch (error) {
    logger.error('Error getting pool data:', error);
    throw error;
  }
}

async function getSerumPrice(market: Market): Promise<number> {
  const bids = await market.loadBids(connection);
  const asks = await market.loadAsks(connection);
  
  // Get best bid and ask
  const bestBid = bids.getL2(1)[0]?.[0] ?? 0;
  const bestAsk = asks.getL2(1)[0]?.[0] ?? 0;
  
  // Calculate mid price
  if (bestBid > 0 && bestAsk > 0) {
    return (bestBid + bestAsk) / 2;
  }
  
  throw new Error('No orderbook prices available');
}

async function getTokenPrice(tokenMint: string): Promise<number> {
  try {
    // First try Orca pool
    try {
      const poolData = await getPoolData(MARKETS['SOL/USDC']);
      // Calculate price based on pool reserves
      // This is a simplified calculation - you'll need to account for decimals
      // and implement proper price calculation based on the pool's structure
      const price = Number(poolData.tokenBAmount) / Number(poolData.tokenAAmount);
      return price;
    } catch (orcaError) {
      logger.warn('Failed to get price from Orca pool:', orcaError);
      
      // Try Raydium pool
      try {
        const poolData = await getPoolData(MARKETS['SOL/USDC_RAY']);
        const price = Number(poolData.tokenBAmount) / Number(poolData.tokenAAmount);
        return price;
      } catch (raydiumError) {
        logger.warn('Failed to get price from Raydium pool:', raydiumError);
        
        // If both fail, get price from Serum orderbook
        try {
          const market = await Market.load(
            connection,
            new PublicKey(tokenMint),
            {},
            new PublicKey('9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin') // Serum program ID
          );
          
          return await getSerumPrice(market);
        } catch (serumError) {
          logger.error('Failed to get price from Serum:', serumError);
          throw serumError;
        }
      }
    }
  } catch (error) {
    logger.error('Error getting token price:', error);
    return 0;
  }
}

// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Get price endpoint
app.get('/api/price/:tokenMint', async (req, res) => {
  try {
    const { tokenMint } = req.params;
    const price = await getTokenPrice(tokenMint);
    res.json({ price });
  } catch (error) {
    logger.error('Error in price endpoint:', error);
    res.status(500).json({ error: 'Failed to get price' });
  }
});

// Get multiple prices endpoint
app.get('/api/prices', async (req, res) => {
  try {
    const mintsParam = req.query.mints;
    if (!mintsParam) {
      return res.status(400).json({ error: 'No token mints provided' });
    }

    // Convert to array if it's a single string
    const mints = Array.isArray(mintsParam) ? mintsParam : [mintsParam];

    // Ensure all mints are strings
    const validMints = mints.filter((mint): mint is string => typeof mint === 'string');

    if (validMints.length === 0) {
      return res.status(400).json({ error: 'Invalid token mints' });
    }

    const prices = await Promise.all(
      validMints.map(async (mint) => {
        try {
          const price = await getTokenPrice(mint);
          return {
            mint,
            price
          };
        } catch (error) {
          logger.error(`Error getting price for ${mint}:`, error);
          return {
            mint,
            price: 0
          };
        }
      })
    );

    res.json({ prices });
  } catch (error) {
    logger.error('Error in prices endpoint:', error);
    res.status(500).json({ error: 'Failed to get prices' });
  }
});

// Start the server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  logger.info(`Price feed service running on port ${PORT}`);
});
