import { WebSocket, WebSocketServer as WSServer } from 'ws';
import { marketEvents } from './index';
import { Connection } from '@solana/web3.js';
import { Server } from 'http';
import { TokenData } from '../types/market';

export class WebSocketServer {
  private static instance: WebSocketServer;
  private wss: WSServer;
  private clients: Set<WebSocket> = new Set();
  private connection: Connection;
  private heartbeatInterval: NodeJS.Timeout | null = null;

  private constructor(server: Server) {
    this.wss = new WSServer({ server });
    this.connection = new Connection(process.env.VITE_SOLANA_RPC_URL || '', 'confirmed');
    this.initialize();
    this.startHeartbeat();
  }

  static getInstance(server: Server): WebSocketServer {
    if (!WebSocketServer.instance) {
      WebSocketServer.instance = new WebSocketServer(server);
    }
    return WebSocketServer.instance;
  }

  private initialize() {
    this.wss.on('connection', (ws) => {
      this.clients.add(ws);

      ws.on('message', (message) => {
        try {
          const data = JSON.parse(message.toString());
          this.handleMessage(ws, data);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      });

      ws.on('close', () => {
        this.clients.delete(ws);
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        this.clients.delete(ws);
      });

      // Send initial market data
      this.sendMarketData(ws);
    });

    // Listen for market events
    marketEvents.on('market_update', (data: TokenData[]) => {
      this.broadcast('market_update', data);
    });

    // Subscribe to program logs for real-time updates
    this.connection.onLogs('all', (logs) => {
      this.handleProgramLogs(logs);
    });
  }

  private startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      this.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.ping();
        }
      });
    }, 30000);
  }

  private handleMessage(ws: WebSocket, message: any) {
    try {
      switch (message.type) {
        case 'subscribe':
          // Handle subscription
          break;
        case 'unsubscribe':
          // Handle unsubscription
          break;
        case 'pong':
          // Handle pong response
          break;
        default:
          console.warn('Unknown message type:', message.type);
      }
    } catch (error) {
      console.error('Error handling message:', error);
    }
  }

  private async sendMarketData(ws: WebSocket) {
    try {
      const marketData = await marketEvents.getMarketData();
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          type: 'market_update',
          data: marketData
        }));
      }
    } catch (error) {
      console.error('Error sending market data:', error);
    }
  }

  private broadcast(type: string, data: any) {
    const message = JSON.stringify({ type, data });
    this.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  private handleProgramLogs(logs: any) {
    // Process program logs and broadcast relevant updates
    this.broadcast('program_logs', logs);
  }

  public close() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
    this.clients.forEach((client) => {
      client.close();
    });
    this.wss.close();
  }
}

// Export both the class and a default export
export { WebSocketServer as default };
