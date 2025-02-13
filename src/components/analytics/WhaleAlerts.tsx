import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface WhaleTransaction {
  symbol: string;
  type: 'buy' | 'sell';
  amount: string;
  time: string;
}

const recentTransactions: WhaleTransaction[] = [
  {
    symbol: 'BONK',
    type: 'buy',
    amount: '$125.4K',
    time: '2m ago'
  },
  {
    symbol: 'WIF',
    type: 'sell',
    amount: '$89.2K',
    time: '5m ago'
  },
  {
    symbol: 'MYRO',
    type: 'buy',
    amount: '$234.1K',
    time: '8m ago'
  }
];

export function WhaleAlerts() {
  return (
    <Card className="p-4 bg-gray-900 border-gray-800">
      <h3 className="text-lg font-semibold mb-4">Whale Alerts</h3>
      <div className="space-y-4">
        {recentTransactions.map((tx, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                {tx.symbol.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{tx.symbol}</span>
                  <Badge 
                    variant={tx.type === 'buy' ? "success" : "destructive"}
                    className="capitalize"
                  >
                    {tx.type}
                  </Badge>
                </div>
                <p className="text-sm text-gray-400">{tx.time}</p>
              </div>
            </div>
            <div className="text-right font-medium">
              {tx.amount}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
