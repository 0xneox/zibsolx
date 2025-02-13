export type FeedbackType = 'TRADE_EXECUTION' | 'SUCCESS' | 'ERROR';

export class HapticFeedback {
  public async provideFeedback(type: FeedbackType): Promise<void> {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      switch (type) {
        case 'TRADE_EXECUTION':
          await navigator.vibrate(50);
          break;
        case 'SUCCESS':
          await navigator.vibrate([50, 50, 50]);
          break;
        case 'ERROR':
          await navigator.vibrate([100, 30, 100]);
          break;
      }
    }
  }
}
