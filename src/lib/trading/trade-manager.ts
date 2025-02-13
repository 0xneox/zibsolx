import { Connection, PublicKey, Transaction, VersionedTransaction, SystemProgram } from '@solana/web3.js';
import { Market } from '@project-serum/serum';
import { Jupiter } from '@jup-ag/core';
import { RevenueManager } from '../revenue/RevenueManager';
import { TreasuryManager } from '../treasury';
import JSBI from 'jsbi';

interface RetryConfig {
  maxAttempts: number;
  baseDelay: number;
  maxDelay: number;
}

export class TradeManager {
  private connection: Connection;
  private treasuryWallet: string;
  private revenueManager: RevenueManager;
  private jupiter: Jupiter;
  private retryConfig: RetryConfig = {
    maxAttempts: 3,
    baseDelay: 1000,
    maxDelay: 10000
  };

  constructor(
    rpcUrl: string,
    treasuryWallet: string
  ) {
    this.connection = new Connection(rpcUrl, 'confirmed');
    this.treasuryWallet = treasuryWallet;
    this.revenueManager = new RevenueManager();
    this.initializeJupiter();
  }

  private async initializeJupiter() {
    try {
      this.jupiter = await Jupiter.load({
        connection: this.connection,
        cluster: 'mainnet-beta',
        wrapUnwrapSOL: true
      });
    } catch (error) {
      console.error('Failed to initialize Jupiter:', error);
      throw new Error('Failed to initialize trading system');
    }
  }

  private async retryOperation<T>(
    operation: () => Promise<T>,
    errorMessage: string
  ): Promise<T> {
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= this.retryConfig.maxAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        if (attempt === this.retryConfig.maxAttempts) break;
        
        const delay = Math.min(
          this.retryConfig.baseDelay * Math.pow(2, attempt - 1),
          this.retryConfig.maxDelay
        );
        
        console.log(`Retry attempt ${attempt}/${this.retryConfig.maxAttempts} after ${delay}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw new Error(`${errorMessage}: ${lastError?.message || 'Unknown error'}`);
  }

  private validateTradeParams(
    inputMint: string,
    outputMint: string,
    amount: number,
    slippage: number
  ): void {
    if (!inputMint || !outputMint) {
      throw new Error('Invalid token addresses provided');
    }
    if (amount <= 0) {
      throw new Error('Trade amount must be greater than 0');
    }
    if (slippage < 0 || slippage > 100) {
      throw new Error('Slippage must be between 0 and 100');
    }
  }

  async executeTrade({
    userWallet,
    inputMint,
    outputMint,
    amount,
    slippage = 1,
    userTier = 'BASIC'
  }): Promise<{
    success: boolean;
    txId?: string;
    outputAmount?: number;
    fee?: number;
    error?: string;
  }> {
    try {
      this.validateTradeParams(inputMint, outputMint, amount, slippage);

      // Calculate fee
      const fee = await this.retryOperation(
        () => this.revenueManager.calculateTradingFee(amount, userTier),
        'Failed to calculate trading fee'
      );

      // Get best route
      const routes = await this.retryOperation(
        async () => {
          const routeResponse = await this.jupiter.computeRoutes({
            inputMint: new PublicKey(inputMint),
            outputMint: new PublicKey(outputMint),
            amount: JSBI.BigInt(amount.toString()),
            slippageBps: Math.floor(slippage * 100),
            feeBps: Math.floor(fee * 100),
            onlyDirectRoutes: false,
          });

          if (!routeResponse.routesInfos?.[0]) {
            throw new Error('No valid trading route found');
          }

          return routeResponse;
        },
        'Failed to compute trading routes'
      );

      // Execute trade
      const route = routes.routesInfos[0];
      const { swapTransaction } = await this.retryOperation(
        () => this.jupiter.exchange({ routeInfo: route }),
        'Failed to prepare swap transaction'
      );

      // Send transaction
      const signature = await this.retryOperation(
        async () => {
          if (swapTransaction instanceof Transaction) {
            return await this.connection.sendTransaction(swapTransaction, [], {
              skipPreflight: false,
              preflightCommitment: 'confirmed'
            });
          } else {
            return await this.connection.sendTransaction(swapTransaction, {
              skipPreflight: false,
              preflightCommitment: 'confirmed',
              maxRetries: 3
            });
          }
        },
        'Failed to send transaction'
      );

      // Wait for confirmation
      await this.retryOperation(
        async () => {
          const confirmation = await this.connection.confirmTransaction(signature, 'confirmed');
          if (confirmation.value.err) {
            throw new Error(`Transaction failed: ${confirmation.value.err.toString()}`);
          }
          return confirmation;
        },
        'Failed to confirm transaction'
      );

      // Track revenue
      await this.revenueManager.trackTrade({
        amount,
        fee,
        userWallet: new PublicKey(userWallet),
        type: 'SWAP'
      });

      return {
        success: true,
        txId: signature,
        outputAmount: Number(routes.routesInfos[0].outAmount),
        fee
      };

    } catch (error) {
      console.error('Trade execution error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred during trade'
      };
    }
  }

  async getTradeStatus(signature: string): Promise<{
    status: 'success' | 'failed' | 'pending';
    error?: string;
  }> {
    try {
      const status = await this.connection.getSignatureStatus(signature);
      if (!status || !status.value) {
        return { status: 'pending' };
      }
      
      if (status.value.err) {
        return {
          status: 'failed',
          error: status.value.err.toString()
        };
      }

      return { status: 'success' };
    } catch (error) {
      console.error('Error checking trade status:', error);
      return {
        status: 'failed',
        error: 'Failed to check trade status'
      };
    }
  }

  async getQuote({
    inputMint,
    outputMint,
    amount,
    userTier = 'BASIC'
  }): Promise<{
    outputAmount: number;
    fee: number;
    priceImpact: number;
    route: any;
  }> {
    const fee = await this.revenueManager.calculateTradingFee(amount, userTier);
    const routes = await this.jupiter.computeRoutes({
      inputMint: new PublicKey(inputMint),
      outputMint: new PublicKey(outputMint),
      amount: JSBI.BigInt(amount.toString()),
      slippageBps: 100,
      feeBps: Math.floor(fee * 100), // Convert to basis points
      onlyDirectRoutes: false,
    });

    if (!routes.routesInfos?.[0]) {
      throw new Error('No route available');
    }

    return {
      outputAmount: Number(routes.routesInfos[0].outAmount),
      fee,
      priceImpact: routes.routesInfos[0].priceImpactPct,
      route: routes.routesInfos[0]
    };
  }

  // Calculate fees for a trade based on amount and user tier
  async calculateFees(amount: number, tier: string): Promise<number> {
    return this.revenueManager.calculateTradingFee(amount, tier);
  }

  private async monitorTradeSuccess(
    txId: string,
    userWallet: PublicKey,
    fee: number
  ): Promise<void> {
    try {
      const tx = await this.connection.getTransaction(txId);
      if (!tx || tx.meta?.err) {
        // Trade failed, refund fee
        await this.refundFee(userWallet, fee);
      }
    } catch (error) {
      console.error('Trade monitoring error:', error);
    }
  }

  private async refundFee(
    userWallet: PublicKey,
    fee: number
  ): Promise<void> {
    try {
      const instruction = SystemProgram.transfer({
        fromPubkey: userWallet,
        toPubkey: new PublicKey(this.treasuryWallet),
        lamports: fee
      });
      const transaction = new Transaction().add(instruction);
      const versionedTx = Transaction.from(transaction.serialize());
      await this.connection.sendTransaction(versionedTx, [], {
        skipPreflight: false,
        preflightCommitment: 'confirmed'
      });
    } catch (error) {
      console.error('Fee refund error:', error);
    }
  }

  async getTradingMetrics(): Promise<{
    volume24h: number;
    trades24h: number;
    uniqueTraders24h: number;
    totalFees24h: number;
  }> {
    // Implement metrics collection
    return {
      volume24h: 0,
      trades24h: 0,
      uniqueTraders24h: 0,
      totalFees24h: 0
    };
  }

  private async getWalletBalance(token: string): Promise<number> {
    const tokenAccount = await this.connection.getTokenAccountsByOwner(
      new PublicKey(this.treasuryWallet),
      { mint: new PublicKey(token) }
    );
    
    if (tokenAccount.value.length === 0) {
      return 0;
    }

    const balance = await this.connection.getTokenAccountBalance(
      tokenAccount.value[0].pubkey
    );

    return Number(balance.value.amount);
  }
}
