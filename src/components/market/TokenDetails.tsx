import { useEffect, useState } from 'react';
import { TokenData } from '../../types';
import { marketService } from '../../services/MarketService';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { useToast } from '../ui/use-toast';
import { formatDistance } from 'date-fns';

interface TokenDetailsProps {
  address: string;
}

export function TokenDetails({ address }: TokenDetailsProps) {
  const [token, setToken] = useState<TokenData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchTokenDetails();
  }, [address]);

  const fetchTokenDetails = async () => {
    try {
      setLoading(true);
      const data = await marketService.getMarketData();
      const tokenDetails = data.find(t => t.address === address);
      if (!tokenDetails) {
        throw new Error('Token not found');
      }
      setToken(tokenDetails);
      setError(null);
    } catch (err) {
      console.error('Error fetching token details:', err);
      setError('Failed to fetch token details');
      toast({
        title: 'Error',
        description: 'Failed to fetch token details. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Token Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-4">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !token) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Token Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-red-500">{error || 'Token not found'}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-4">
          {token.logo && (
            <img
              src={token.logo}
              alt={token.symbol}
              className="w-12 h-12 rounded-full"
            />
          )}
          <div>
            <CardTitle>{token.name}</CardTitle>
            <div className="text-sm text-muted-foreground">{token.symbol}</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Price</TableCell>
              <TableCell>${token.price.toFixed(6)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">24h Volume</TableCell>
              <TableCell>${token.volume24h.toLocaleString()}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Market Cap</TableCell>
              <TableCell>${token.marketCap.toLocaleString()}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Liquidity</TableCell>
              <TableCell>${token.liquidity.toLocaleString()}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Holders</TableCell>
              <TableCell>{token.holders.toLocaleString()}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Last Updated</TableCell>
              <TableCell>
                {formatDistance(new Date(token.lastUpdated), new Date(), { addSuffix: true })}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
