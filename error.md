
> zibsolx@1.0.0 build
> tsc && vite build

src/lib/api.ts:151:9 - error TS2353: Object literal may only specify known properties, and 'liquidity' does not exist in type 'TokenDetails'.

151         liquidity: Number(pair.liquidity.usd),
            ~~~~~~~~~

src/lib/trading/OptimizedTradingEngine.ts:44:9 - error TS2353: Object literal may only specify known properties, and 'retryAttempts' does not exist in type 'FailoverConfig'.

44         retryAttempts: 3,
           ~~~~~~~~~~~~~

src/lib/trading/OptimizedTradingEngine.ts:56:37 - error TS2339: Property 'isTripped' does not exist on type 'CircuitBreaker'.

56       if (await this.circuitBreaker.isTripped()) {
                                       ~~~~~~~~~

src/lib/trading/OptimizedTradingEngine.ts:60:48 - error TS2339: Property 'execute' does not exist on type 'FailoverSystem'.

60       const result = await this.failoverSystem.execute(async () => {
                                                  ~~~~~~~

src/lib/trading/OptimizedTradingEngine.ts:61:49 - error TS2551: Property 'getOptimalPrice' does not exist on type 'PriceOptimizer'. Did you mean 'getOptimizedPrice'?

61         const price = await this.priceOptimizer.getOptimalPrice(order.outputToken);
                                                   ~~~~~~~~~~~~~~~

  src/lib/pricing/PriceOptimizer.ts:6:9
    6   async getOptimizedPrice(token: string): Promise<number> {
              ~~~~~~~~~~~~~~~~~
    'getOptimizedPrice' is declared here.

src/lib/trading/OptimizedTradingEngine.ts:74:35 - error TS2339: Property 'recordMetric' does not exist on type 'MetricsCollector'.

74       await this.metricsCollector.recordMetric('trade_execution_time', endTime - startTime);
                                     ~~~~~~~~~~~~

src/lib/trading/OptimizedTradingEngine.ts:75:35 - error TS2339: Property 'recordMetric' does not exist on type 'MetricsCollector'.

75       await this.metricsCollector.recordMetric('trade_success', 1);
                                     ~~~~~~~~~~~~

src/lib/trading/OptimizedTradingEngine.ts:76:35 - error TS2339: Property 'recordMetric' does not exist on type 'MetricsCollector'.

76       await this.metricsCollector.recordMetric('trade_slippage', order.slippage);
                                     ~~~~~~~~~~~~

src/lib/trading/OptimizedTradingEngine.ts:81:37 - error TS2339: Property 'recordMetric' does not exist on type 'MetricsCollector'.

81         await this.metricsCollector.recordMetric('trade_error', 1);
                                       ~~~~~~~~~~~~

src/lib/trading/OptimizedTradingEngine.ts:82:37 - error TS2339: Property 'recordMetric' does not exist on type 'MetricsCollector'.

82         await this.metricsCollector.recordMetric('trade_failure', 1);
                                       ~~~~~~~~~~~~

src/lib/trading/OptimizedTradingEngine.ts:90:29 - error TS2339: Property 'getMetric' does not exist on type 'MetricsCollector'.

90       this.metricsCollector.getMetric('trade_execution_time'),
                               ~~~~~~~~~

src/lib/trading/OptimizedTradingEngine.ts:91:29 - error TS2339: Property 'getMetric' does not exist on type 'MetricsCollector'.

91       this.metricsCollector.getMetric('trade_success'),
                               ~~~~~~~~~

src/lib/trading/OptimizedTradingEngine.ts:92:29 - error TS2339: Property 'getMetric' does not exist on type 'MetricsCollector'.

92       this.metricsCollector.getMetric('trade_error'),
                               ~~~~~~~~~

src/lib/trading/OptimizedTradingEngine.ts:93:29 - error TS2339: Property 'getMetric' does not exist on type 'MetricsCollector'.

93       this.metricsCollector.getMetric('total_trades')
                               ~~~~~~~~~


Found 14 errors in 2 files.

Errors  Files
     1  src/lib/api.ts:151
    13  src/lib/trading/OptimizedTradingEngine.ts:44
PS C:\Users\neohe\Desktop\zibsolx> 