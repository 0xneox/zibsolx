# ZibFin API Documentation v1.0

## 🔑 Authentication

### API Keys
```typescript
const headers = {
  'X-API-Key': 'your_api_key',
  'X-API-Signature': 'request_signature',
  'X-API-Timestamp': 'request_timestamp'
};
```

## 📊 Endpoints

### Trading API

#### Place Order
```typescript
POST /api/v1/order
{
  "symbol": "BONK/SOL",
  "side": "BUY",
  "type": "MARKET",
  "amount": "1000",
  "price": "0.00001234"  // Optional for market orders
}
```

#### Cancel Order
```typescript
DELETE /api/v1/order/{orderId}
```

#### Get Order Status
```typescript
GET /api/v1/order/{orderId}
```

### Market Data API

#### Get Token Price
```typescript
GET /api/v1/price/{token}
```

#### Get Order Book
```typescript
GET /api/v1/orderbook/{symbol}
```

### Account API

#### Get Balance
```typescript
GET /api/v1/balance
```

#### Get Trading History
```typescript
GET /api/v1/history
```

## 🔄 WebSocket API

### Real-time Updates
```typescript
const wsEndpoint = 'wss://api.zibfin.com/ws';

// Subscribe to price updates
{
  "op": "subscribe",
  "channel": "prices",
  "symbols": ["BONK/SOL", "SAMO/SOL"]
}

// Subscribe to order book
{
  "op": "subscribe",
  "channel": "orderbook",
  "symbol": "BONK/SOL"
}
```

## 🔒 Rate Limits

```typescript
const rateLimits = {
  public: {
    requests: 100,
    period: '1m'
  },
  private: {
    requests: 300,
    period: '1m'
  },
  trading: {
    orders: 50,
    period: '1m'
  }
};
```

## 🚨 Error Codes

```typescript
const errorCodes = {
  AUTH_001: 'Invalid API key',
  AUTH_002: 'Invalid signature',
  TRADE_001: 'Insufficient balance',
  TRADE_002: 'Invalid order type',
  MARKET_001: 'Symbol not found',
  SYSTEM_001: 'System overload'
};
```

## 📱 Mobile API

### Mobile-Specific Endpoints

#### Get User Profile
```typescript
GET /api/v1/mobile/profile
```

#### Update Push Notifications
```typescript
POST /api/v1/mobile/notifications
{
  "priceAlerts": true,
  "tradeNotifications": true,
  "marketUpdates": false
}
```

## 🔧 Development Tools

### SDK Examples

#### JavaScript/TypeScript
```typescript
import { ZibFinSDK } from '@zibfin/sdk';

const sdk = new ZibFinSDK({
  apiKey: 'your_api_key',
  environment: 'production'
});

// Place order
await sdk.placeOrder({
  symbol: 'BONK/SOL',
  side: 'BUY',
  amount: '1000'
});
```

#### Python
```python
from zibfin import ZibFinSDK

sdk = ZibFinSDK(
    api_key='your_api_key',
    environment='production'
)

# Place order
sdk.place_order(
    symbol='BONK/SOL',
    side='BUY',
    amount='1000'
)
```

## 📊 Response Formats

### Success Response
```json
{
  "success": true,
  "data": {
    "orderId": "123456",
    "status": "FILLED",
    "fillPrice": "0.00001234"
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "TRADE_001",
    "message": "Insufficient balance"
  }
}
```

## 🔐 Security Best Practices

### API Key Management
1. Rotate keys regularly
2. Use separate keys per environment
3. Implement IP whitelisting
4. Monitor API usage

### Request Signing
```typescript
const signRequest = (payload, apiSecret) => {
  const timestamp = Date.now();
  const signature = createHmac('sha256', apiSecret)
    .update(timestamp + JSON.stringify(payload))
    .digest('hex');
  
  return { signature, timestamp };
};
```

## 📈 Performance Guidelines

### Optimization Tips
1. Use WebSocket for real-time data
2. Batch requests when possible
3. Implement proper error handling
4. Cache responses appropriately

### Best Practices
1. Handle rate limits gracefully
2. Implement exponential backoff
3. Monitor API response times
4. Log all API interactions
