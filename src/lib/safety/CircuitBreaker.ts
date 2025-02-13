export class CircuitBreaker {
  private failureCount: number = 0;
  private lastFailureTime: number = 0;
  private readonly threshold: number = 5;
  private readonly resetTimeout: number = 60000; // 1 minute

  async initialize(): Promise<void> {
    this.failureCount = 0;
    this.lastFailureTime = 0;
  }

  async isTripped(): Promise<boolean> {
    if (this.failureCount >= this.threshold) {
      const timeSinceLastFailure = Date.now() - this.lastFailureTime;
      if (timeSinceLastFailure < this.resetTimeout) {
        return true;
      }
      // Reset if timeout has passed
      this.failureCount = 0;
    }
    return false;
  }

  async recordFailure(): Promise<void> {
    this.failureCount++;
    this.lastFailureTime = Date.now();
  }

  async reset(): Promise<void> {
    this.failureCount = 0;
    this.lastFailureTime = 0;
  }
}
