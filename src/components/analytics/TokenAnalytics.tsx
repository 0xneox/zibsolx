import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface MarketStat {
  label: string;
  value: string;
  change: number;
}

const marketStats: MarketStat[] = [
  {
    label: 'Total Volume',
    value: '$125.4M',
    change: 15.2
  },
  {
    label: 'Active Traders',
    value: '45.2K',
    change: 8.5
  },
  {
    label: 'Avg Trade Size',
    value: '$1,234',
    change: -3.8
  }
];

export function TokenAnalytics() {
  return (
    <Card className="p-4 bg-gray-900 border-gray-800">
      <h3 className="text-lg font-semibold mb-4">Market Analytics</h3>
      <div className="space-y-4">
        {marketStats.map((stat) => (
          <div key={stat.label} className="flex items-center justify-between">
            <span className="text-gray-400">{stat.label}</span>
            <div className="text-right">
              <div className="font-medium">{stat.value}</div>
              <Badge 
                variant={stat.change >= 0 ? "success" : "destructive"}
                className="mt-1"
              >
                {stat.change >= 0 ? '+' : ''}{stat.change}%
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
