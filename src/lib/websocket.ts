import { TokenData } from '@/types/market';

type WebSocketMessageHandlers = {
  onMarketData?: (data: TokenData[]) => void;
  onTradeUpdate?: (data: any) => void;
  onError?: (error: any) => void;
};

class WebSocketManager {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private handlers: WebSocketMessageHandlers = {};

  constructor(private url: string) {}

  connect() {
    try {
      this.ws = new WebSocket(this.url);

      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        switch (data.type) {
          case 'MARKET_DATA':
            this.handlers.onMarketData?.(data.payload);
            break;
          case 'TRADE_UPDATE':
            this.handlers.onTradeUpdate?.(data.payload);
            break;
          default:
            console.warn('Unknown message type:', data.type);
        }
      };

      this.ws.onclose = () => {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          setTimeout(() => {
            this.reconnectAttempts++;
            this.connect();
          }, 1000 * Math.pow(2, this.reconnectAttempts)); // Exponential backoff
        }
      };

      this.ws.onerror = (error) => {
        this.handlers.onError?.(error);
      };
    } catch (error) {
      console.error('WebSocket connection error:', error);
    }
  }

  on<T extends keyof WebSocketMessageHandlers>(
    event: T,
    handler: WebSocketMessageHandlers[T]
  ) {
    if (handler) {
      this.handlers[event] = handler;
    }
  }

  send(data: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export const wsManager = new WebSocketManager(
  import.meta.env.VITE_WS_URL || 'wss://api.yourservice.com/ws'
);
