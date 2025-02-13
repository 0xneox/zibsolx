import React from 'react';
import { TokenData } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorState } from '@/components/ui/error-state';
import { formatDistanceToNow } from 'date-fns';
import { ArrowUpDown } from 'lucide-react';

interface MarketDataDisplayProps {
  data: TokenData[];
  loading: boolean;
  error?: string;
  onRetry?: () => void;
  view: 'trending' | 'gainers' | 'new' | 'all';
}

export function MarketDataDisplay({ data, loading, error, onRetry, view }: MarketDataDisplayProps) {
  const getFilteredData = () => {
    switch (view) {
      case 'trending':
        return [...data].sort((a, b) => b.volume24h - a.volume24h).slice(0, 10);
      case 'gainers':
        return [...data].sort((a, b) => b.priceChange24h - a.priceChange24h).slice(0, 10);
      case 'new':
        return [...data].sort((a, b) => {
          const dateA = new Date(a.lastUpdated);
          const dateB = new Date(b.lastUpdated);
          return dateB.getTime() - dateA.getTime();
        }).slice(0, 10);
      default:
        return data;
    }
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={onRetry} />;

  const filteredData = getFilteredData();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Token</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>24h Change</TableHead>
          <TableHead>Volume (24h)</TableHead>
          <TableHead>Market Cap</TableHead>
          <TableHead>Last Updated</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredData.map((token) => (
          <TableRow key={token.address}>
            <TableCell>
              <div className="flex items-center gap-2">
                {token.logo && (
                  <img src={token.logo} alt={token.symbol} className="w-6 h-6 rounded-full" />
                )}
                <div>
                  <div className="font-medium">{token.symbol}</div>
                  <div className="text-sm text-gray-500">{token.name}</div>
                </div>
              </div>
            </TableCell>
            <TableCell>${token.price.toLocaleString()}</TableCell>
            <TableCell className={token.priceChange24h >= 0 ? 'text-green-600' : 'text-red-600'}>
              {token.priceChange24h > 0 ? '+' : ''}{token.priceChange24h.toFixed(2)}%
            </TableCell>
            <TableCell>${token.volume24h.toLocaleString()}</TableCell>
            <TableCell>${token.marketCap.toLocaleString()}</TableCell>
            <TableCell>
              {formatDistanceToNow(new Date(token.lastUpdated), { addSuffix: true })}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
