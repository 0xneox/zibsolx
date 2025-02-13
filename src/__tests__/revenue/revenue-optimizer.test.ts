import { RevenueOptimizer } from '../../lib/revenue/RevenueOptimizer';
import { jest } from '@jest/globals';

describe('RevenueOptimizer', () => {
  let revenueOptimizer: RevenueOptimizer;

  beforeEach(() => {
    revenueOptimizer = new RevenueOptimizer('fake-url', 'treasury-wallet');
  });

  describe('calculateOptimalFee', () => {
    it('should calculate correct fee for micro trades', async () => {
      // Arrange
      const tradeAmount = 50; // $50

      // Act
      const result = await revenueOptimizer.calculateOptimalFee(
        tradeAmount,
        'BASIC'
      );

      // Assert
      expect(result.feePercentage).toBe(0.5);
      expect(result.feeAmount).toBe(0.25);
      expect(result.tier).toBe('MICRO');
    });

    it('should calculate correct fee for whale trades', async () => {
      // Arrange
      const tradeAmount = 200000; // $200k

      // Act
      const result = await revenueOptimizer.calculateOptimalFee(
        tradeAmount,
        'BASIC'
      );

      // Assert
      expect(result.feePercentage).toBe(0.1);
      expect(result.feeAmount).toBe(200);
      expect(result.tier).toBe('WHALE');
    });

    it('should apply subscription discount', async () => {
      // Arrange
      const tradeAmount = 1000;
      const userTier = 'BASIC';
      const subscription = 'WHALE_PACKAGE';

      // Act
      const result = await revenueOptimizer.calculateOptimalFee(
        tradeAmount,
        userTier,
        subscription
      );

      // Assert
      expect(result.feePercentage).toBe(0.24); // 0.4% - 40% discount
    });
  });

  describe('optimizeTreasury', () => {
    it('should suggest rebalancing when balance is too high', async () => {
      // Arrange
      const mockBalance = 2000 * 1e9; // 2000 SOL

      // Act
      const result = await revenueOptimizer.optimizeTreasury();

      // Assert
      expect(result.rebalanceNeeded).toBe(true);
      expect(result.suggestions).toContain(
        'Consider moving excess SOL to cold storage'
      );
    });
  });

  // Add more test cases...
});
