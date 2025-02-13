import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface NewToken {
  symbol: string;
  name: string;
  launchTime: string;
  initialPrice: number;
  currentPrice: number;
  marketCap: number;
}

export function NewTokensDisplay() {
  const [tokens, setTokens] = useState<NewToken[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated data - replace with actual API call
    const mockData: NewToken[] = [
      {
        symbol: 'DOGE2',
        name: 'Doge 2.0',
        launchTime: '2h ago',
        initialPrice: 0.000001,
        currentPrice: 0.0000015,
        marketCap: 500000
      },
      {
        symbol: 'PEPE2',
        name: 'Pepe 2.0',
        launchTime: '5h ago',
        initialPrice: 0.00001,
        currentPrice: 0.000008,
        marketCap: 750000
      },
      {
        symbol: 'SHIB2',
        name: 'Shiba 2.0',
        launchTime: '12h ago',
        initialPrice: 0.0001,
        currentPrice: 0.00015,
        marketCap: 1000000
      },
      {
        symbol: 'WOJAK',
        name: 'Wojak',
        launchTime: '1d ago',
        initialPrice: 0.00005,
        currentPrice: 0.0001,
        marketCap: 250000
      }
    ];

    setTokens(mockData);
    setLoading(false);
  }, []);

  const calculateChange = (current: number, initial: number) => {
    const change = ((current - initial) / initial) * 100;
    return change.toFixed(1);
  };

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1000000) return `$${(marketCap / 1000000).toFixed(1)}M`;
    if (marketCap >= 1000) return `$${(marketCap / 1000).toFixed(1)}K`;
    return `$${marketCap.toFixed(0)}`;
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
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{token.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        {token.launchTime}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-400">{token.symbol}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">${token.currentPrice.toFixed(8)}</p>
                  <Badge 
                    variant={token.currentPrice >= token.initialPrice ? "success" : "destructive"}
                    className="mt-1"
                  >
                    {calculateChange(token.currentPrice, token.initialPrice)}%
                  </Badge>
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-400">
                Market Cap: {formatMarketCap(token.marketCap)}
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
