import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TrendingToken {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume24h: number;
}

export function TrendingTokens() {
  const [tokens, setTokens] = useState<TrendingToken[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated data - replace with actual API call
    const mockData: TrendingToken[] = [
      {
        symbol: 'BONK',
        name: 'Bonk',
        price: 0.00000123,
        change24h: 15.5,
        volume24h: 1234567
      },
      {
        symbol: 'WIF',
        name: 'Wif',
        price: 0.0123,
        change24h: -5.2,
        volume24h: 987654
      },
      {
        symbol: 'MYRO',
        name: 'Myro',
        price: 0.00456,
        change24h: 25.7,
        volume24h: 456789
      },
      {
        symbol: 'BOME',
        name: 'Book of Meme',
        price: 0.0789,
        change24h: 8.9,
        volume24h: 345678
      }
    ];

    setTokens(mockData);
    setLoading(false);
  }, []);

  const formatPrice = (price: number) => {
    if (price < 0.00001) return price.toExponential(4);
    return price.toFixed(6);
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1000000) return `$${(volume / 1000000).toFixed(1)}M`;
    if (volume >= 1000) return `$${(volume / 1000).toFixed(1)}K`;
    return `$${volume.toFixed(0)}`;
  };

  return (
    <Card className="bg-gray-900 border-gray-800">
      <div className="divide-y divide-gray-800">
        {loading ? (
          <div className="p-4 text-center text-gray-400">Loading...</div>
        ) : (
          tokens.map((token) => (
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
              <div className="mt-2 text-sm text-gray-400">
                24h Volume: {formatVolume(token.volume24h)}
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
