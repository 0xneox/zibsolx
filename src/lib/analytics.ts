// Simple analytics tracking
const ANALYTICS_ENDPOINT = import.meta.env.VITE_ANALYTICS_ENDPOINT;
const isDev = import.meta.env.MODE === 'development';

interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
  timestamp?: number;
}

class Analytics {
  private queue: AnalyticsEvent[] = [];
  private isProcessing = false;

  constructor() {
    // Process queue periodically
    if (!isDev) {
      setInterval(() => this.processQueue(), 5000);
    }
    
    // Track performance metrics
    if (typeof window !== 'undefined' && !isDev) {
      this.trackPerformanceMetrics();
    }
  }

  private trackPerformanceMetrics() {
    // Track page load performance
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      this.track('page_view', {
        loadTime: navigation.loadEventEnd,
        domInteractive: navigation.domInteractive,
        firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime,
      });
    });

    // Track long tasks
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 50) { // Tasks longer than 50ms
          this.track('error', {
            type: 'long_task',
            duration: entry.duration,
            location: entry.name,
          });
        }
      }
    });
    
    observer.observe({ entryTypes: ['longtask'] });
  }

  track(event: string, properties: Record<string, any> = {}) {
    if (isDev) {
      console.debug('[Analytics]', event, properties);
      return;
    }

    if (!ANALYTICS_ENDPOINT) {
      console.debug('Analytics endpoint not configured, skipping event:', event);
      return;
    }

    this.queue.push({
      event,
      properties: {
        ...properties,
        url: window.location.href,
      },
      timestamp: Date.now(),
    });
  }

  private async processQueue() {
    if (this.isProcessing || this.queue.length === 0 || !ANALYTICS_ENDPOINT) {
      return;
    }

    this.isProcessing = true;
    const events = [...this.queue];
    this.queue = [];

    try {
      const response = await fetch(ANALYTICS_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(events),
      });

      if (!response.ok) {
        throw new Error(`Analytics API error: ${response.status}`);
      }
    } catch (error) {
      console.debug('Failed to send analytics:', error);
      // Put failed events back in queue
      this.queue = [...events, ...this.queue];
    } finally {
      this.isProcessing = false;
    }
  }
}

export const analytics = new Analytics();
