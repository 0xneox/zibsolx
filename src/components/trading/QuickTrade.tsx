import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { TradeManager } from '../../lib/trading/trade-manager';
import { useToast } from '../ui/use-toast';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { TokenData } from '../../types';

interface QuickTradeProps {
  token: TokenData;
}

export function QuickTrade({ token }: QuickTradeProps) {
  const { publicKey } = useWallet();
  const { toast } = useToast();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const tradeManager = new TradeManager(
    process.env.VITE_SOLANA_RPC_URL || '',
    process.env.VITE_TREASURY_WALLET || ''
  );

  const handleBuy = async () => {
    if (!publicKey) {
      toast({
        title: 'Connect Wallet',
        description: 'Please connect your wallet first',
        variant: 'destructive',
      });
      return;
    }

    if (!amount || isNaN(parseFloat(amount))) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid amount',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      const result = await tradeManager.executeTrade({
        userWallet: publicKey.toString(),
        inputMint: 'So11111111111111111111111111111111111111112', // SOL
        outputMint: token.address,
        amount: parseFloat(amount),
        slippage: 1, // 1% slippage
      });

      if (result.success) {
        toast({
          title: 'Trade Successful',
          description: `Successfully bought ${token.symbol}!`,
        });
      } else {
        toast({
          title: 'Trade Failed',
          description: result.error || 'Unknown error occurred',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Trade Error',
        description: error instanceof Error ? error.message : 'Failed to execute trade',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-background rounded-lg border">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{token.name} ({token.symbol})</h3>
        <span className="text-sm text-muted-foreground">
          Price: ${token.price.toFixed(6)}
        </span>
      </div>
      
      <div className="flex gap-2">
        <Input
          type="number"
          placeholder="Amount in SOL"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={loading}
        />
        <Button 
          onClick={handleBuy}
          disabled={loading || !amount}
        >
          {loading ? 'Buying...' : 'Buy Now'}
        </Button>
      </div>
    </div>
  );
}
