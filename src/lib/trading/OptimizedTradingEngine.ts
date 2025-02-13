import { OrderRouter } from './OrderRouter';
import { RiskManager } from './RiskManager';
import { LiquidityAggregator } from './LiquidityAggregator';
import { PriceOptimizer } from '../pricing/PriceOptimizer';
import { CircuitBreaker } from '../safety/CircuitBreaker';
import { FailoverSystem } from '../system/FailoverSystem';
import { MetricsCollector } from '../monitoring/MetricsCollector';

interface TradeOrder {
  inputToken: string;
  outputToken: string;
  amount: number;
  slippage: number;
}

interface TradeResult {
  txId: string;
  inputAmount: number;
  outputAmount: number;
  fee: number;
}

export class OptimizedTradingEngine {
  private liquidityAggregator: LiquidityAggregator;
  private priceOptimizer: PriceOptimizer;
  private circuitBreaker: CircuitBreaker;
  private failoverSystem: FailoverSystem;
  private metricsCollector: MetricsCollector;

  constructor() {
    this.liquidityAggregator = new LiquidityAggregator();
    this.priceOptimizer = new PriceOptimizer();
    this.circuitBreaker = new CircuitBreaker();
    this.failoverSystem = new FailoverSystem();
    this.metricsCollector = new MetricsCollector();
  }

  async initialize(): Promise<void> {
    await Promise.all([
      this.liquidityAggregator.initialize(),
      this.priceOptimizer.initialize(),
      this.circuitBreaker.initialize(),
      this.failoverSystem.initialize({
        strategy: 'RETRY',
        timeout: 5000,
        retries: 3
      }),
      this.metricsCollector.initialize()
    ]);
  }

  async executeOrder(order: TradeOrder): Promise<TradeResult> {
    try {
      const startTime = Date.now();

      if (await this.circuitBreaker.isTripped()) {
        throw new Error('Circuit breaker active');
      }

      const result = await this.failoverSystem.execute(async () => {
        const price = await this.priceOptimizer.getOptimizedPrice(order.outputToken);
        const outputAmount = order.amount * price * (1 - order.slippage);
        const fee = order.amount * 0.003; // 0.3% fee

        return {
          txId: 'tx-' + Date.now(),
          inputAmount: order.amount,
          outputAmount,
          fee
        };
      });

      const endTime = Date.now();
      await this.metricsCollector.recordMetric('trade_execution_time', endTime - startTime);
      await this.metricsCollector.recordMetric('trade_success', 1);
      await this.metricsCollector.recordMetric('trade_slippage', order.slippage);

      return result;
    } catch (error) {
      if (error instanceof Error) {
        await this.metricsCollector.recordMetric('trade_error', 1);
        await this.metricsCollector.recordMetric('trade_failure', 1);
      }
      throw error;
    }
  }

  async getMetrics() {
    const [executionTime, successCount, errorCount, totalTrades] = await Promise.all([
      this.metricsCollector.getMetric('trade_execution_time'),
      this.metricsCollector.getMetric('trade_success'),
      this.metricsCollector.getMetric('trade_error'),
      this.metricsCollector.getMetric('total_trades')
    ]);

    return {
      executionSpeed: executionTime || 0,
      successRate: totalTrades ? (successCount / totalTrades) * 100 : 100,
      throughput: totalTrades || 0,
      errorRate: totalTrades ? (errorCount / totalTrades) * 100 : 0
    };
  }
}
