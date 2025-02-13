import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { WebSocketServer } from './indexer/websocket.js';
import { tokenIndexer } from './indexer/index.js';
import { marketProcessor } from './indexer/market.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.VITE_APP_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Create HTTP server
const server = createServer(app);

// Initialize WebSocket server
const wss = WebSocketServer.getInstance(server);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start indexer and market processor
async function startServices() {
  try {
    console.log('Starting services...');
    
    // Start token indexer
    await tokenIndexer.start();
    console.log('Token indexer started');
    
    // Start market processor
    await marketProcessor.start();
    console.log('Market processor started');
    
    // Start server
    server.listen(port, () => {
      console.log(`Server running on port ${port}`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('Error starting services:', error);
    process.exit(1);
  }
}

// Handle shutdown
process.on('SIGTERM', () => {
  console.log('Shutting down...');
  wss.close();
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

startServices().catch(console.error);
