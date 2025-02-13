export interface ResourceMetrics {
  loadTime: number;
  size: number;
  type: string;
}

export class MetricsCollector {
  private metrics: Map<string, number[]>;

  constructor() {
    this.metrics = new Map();
  }

  async initialize(): Promise<void> {
    this.metrics.clear();
  }

  async recordMetric(name: string, value: number): Promise<void> {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name)?.push(value);
  }

  async getMetric(name: string): Promise<number> {
    const values = this.metrics.get(name) || [];
    if (values.length === 0) return 0;
    
    const sum = values.reduce((a, b) => a + b, 0);
    return sum / values.length;
  }

  async getResourceMetrics(): Promise<ResourceMetrics> {
    return {
      loadTime: await this.getMetric('resource_load_time'),
      size: await this.getMetric('resource_size'),
      type: 'default'
    };
  }

  async getAverageLatency(): Promise<number> {
    return this.getMetric('latency');
  }

  async getThroughput(): Promise<number> {
    return this.getMetric('throughput');
  }

  async getErrorRate(): Promise<number> {
    return this.getMetric('error_rate');
  }

  async getSuccessRate(): Promise<number> {
    return this.getMetric('success_rate');
  }

  async getAverageExecutionTime(): Promise<number> {
    return this.getMetric('execution_time');
  }
}
