import { useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { analytics } from '@/lib/analytics';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  useEffect(() => {
    // Log error to analytics
    analytics.track('error', {
      error: error.message,
      stack: error.stack,
    });
  }, [error]);

  return (
    <Card className="p-6 max-w-md mx-auto mt-20">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
        <div className="text-muted-foreground mb-6">
          {error.message || 'An unexpected error occurred'}
        </div>
        <div className="space-x-4">
          <Button onClick={() => window.location.reload()}>
            Refresh Page
          </Button>
          <Button variant="outline" onClick={resetErrorBoundary}>
            Try Again
          </Button>
        </div>
      </div>
    </Card>
  );
}
