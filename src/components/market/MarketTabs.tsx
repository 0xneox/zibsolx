import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

interface TokenData {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
}

const TOP_GAINERS: TokenData[] = [
  {
    symbol: 'MYRO',
    name: 'Myro',
    price: 0.00456,
    change24h: 125.7,
    volume24h: 2456789,
    marketCap: 5600000
  },
  {
    symbol: 'BOME',
    name: 'Book of Meme',
    price: 0.0789,
    change24h: 85.9,
    volume24h: 1345678,
    marketCap: 4500000
  },
  {
    symbol: 'BONK',
    name: 'Bonk',
    price: 0.00000123,
    change24h: 45.5,
    volume24h: 9234567,
    marketCap: 8900000
  }
];

const TOP_VOLUME: TokenData[] = [
  {
    symbol: 'WIF',
    name: 'Wif',
    price: 0.0123,
    change24h: -5.2,
    volume24h: 12987654,
    marketCap: 15600000
  },
  {
    symbol: 'BONK',
    name: 'Bonk',
    price: 0.00000123,
    change24h: 45.5,
    volume24h: 9234567,
    marketCap: 8900000
  },
  {
    symbol: 'MYRO',
    name: 'Myro',
    price: 0.00456,
    change24h: 125.7,
    volume24h: 2456789,
    marketCap: 5600000
  }
];

const TOP_MARKET_CAP: TokenData[] = [
  {
    symbol: 'WIF',
    name: 'Wif',
    price: 0.0123,
    change24h: -5.2,
    volume24h: 12987654,
    marketCap: 15600000
  },
  {
    symbol: 'BONK',
    name: 'Bonk',
    price: 0.00000123,
    change24h: 45.5,
    volume24h: 9234567,
    marketCap: 8900000
  },
  {
    symbol: 'BOME',
    name: 'Book of Meme',
    price: 0.0789,
    change24h: 85.9,
    volume24h: 1345678,
    marketCap: 4500000
  }
];

export function MarketTabs() {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(1)}K`;
    return `$${num.toFixed(0)}`;
  };

  const formatPrice = (price: number) => {
    if (price < 0.00001) return price.toExponential(4);
    return price.toFixed(6);
  };

  const renderTokenList = (tokens: TokenData[]) => (
    <div className="divide-y divide-gray-800">
      {tokens.map((token) => (
        <div key={token.symbol} className="p-4 hover:bg-gray-800/50 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                {token.symbol.charAt(0)}
              </div>
              <div>
                <h3 className="font-medium">{token.name}</h3>
                <p className="text-sm text-gray-400">{token.symbol}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium">${formatPrice(token.price)}</p>
              <Badge 
                variant={token.change24h >= 0 ? "success" : "destructive"}
                className="mt-1"
              >
                {token.change24h >= 0 ? '+' : ''}{token.change24h}%
              </Badge>
            </div>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-4 text-sm text-gray-400">
            <div>Volume: {formatNumber(token.volume24h)}</div>
            <div>Market Cap: {formatNumber(token.marketCap)}</div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <Tabs defaultValue="gainers" className="w-full">
      <TabsList className="grid w-full grid-cols-3 bg-gray-900">
        <TabsTrigger value="gainers">Top Gainers</TabsTrigger>
        <TabsTrigger value="volume">Top Volume</TabsTrigger>
        <TabsTrigger value="marketcap">Top Market Cap</TabsTrigger>
      </TabsList>
      <Card className="border-gray-800 bg-gray-900 mt-4">
        <TabsContent value="gainers">
          {renderTokenList(TOP_GAINERS)}
        </TabsContent>
        <TabsContent value="volume">
          {renderTokenList(TOP_VOLUME)}
        </TabsContent>
        <TabsContent value="marketcap">
          {renderTokenList(TOP_MARKET_CAP)}
        </TabsContent>
      </Card>
    </Tabs>
  );
}
