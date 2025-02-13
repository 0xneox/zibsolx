import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useWallet } from "@solana/wallet-adapter-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { TradeManager } from "@/lib/trading/trade-manager";

interface TokenInfo {
  address: string;
  name: string;
  symbol: string;
  price: number;
  priceChange24h: number;
}

export function MemeTokenTrade() {
  const [searchParams] = useSearchParams();
  const { connected, publicKey } = useWallet();
  const { toast } = useToast();
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const tokenAddress = searchParams.get("token");
    if (tokenAddress) {
      loadTokenInfo(tokenAddress).catch(console.error);
    } else {
      setError("No token address provided");
      setInitialLoading(false);
    }
  }, [searchParams]);

  const loadTokenInfo = async (address: string) => {
    try {
      setInitialLoading(true);
      setError("");
      const response = await fetch(`http://localhost:3001/api/tokens/${address}`);
      if (!response.ok) {
        throw new Error(`Failed to load token info: ${response.statusText}`);
      }
      const data = await response.json();
      setTokenInfo(data);
    } catch (error) {
      console.error("Failed to load token info:", error);
      setError(error instanceof Error ? error.message : "Failed to load token information");
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load token information. Please try again later.",
      });
    } finally {
      setInitialLoading(false);
    }
  };

  const validateTrade = (amount: string): boolean => {
    if (!amount || isNaN(Number(amount))) {
      setError("Please enter a valid amount");
      return false;
    }
    if (Number(amount) <= 0) {
      setError("Amount must be greater than 0");
      return false;
    }
    return true;
  };

  const handleTrade = async () => {
    if (!connected || !publicKey || !tokenInfo) return;
    if (!validateTrade(amount)) return;

    setLoading(true);
    setError("");

    try {
      const tradeManager = new TradeManager(
        "https://api.mainnet-beta.solana.com",
        publicKey.toString()
      );

      const result = await tradeManager.executeTrade({
        userWallet: publicKey.toString(),
        inputMint: "SOL",
        outputMint: tokenInfo.address,
        amount: parseFloat(amount),
        slippage: 1,
        userTier: "BASIC"
      });

      if (result.success) {
        toast({
          title: "Trade Executed Successfully",
          description: `Bought ${amount} ${tokenInfo.symbol} for ${result.outputAmount} SOL`,
        });
        setAmount("");
      } else {
        throw new Error(result.error || "Trade failed");
      }
    } catch (error) {
      console.error("Trade error:", error);
      setError(error instanceof Error ? error.message : "Failed to execute trade");
      toast({
        variant: "destructive",
        title: "Trade Failed",
        description: error instanceof Error ? error.message : "Failed to execute trade",
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="container mx-auto p-4">
        <Card className="p-4">
          <div className="flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        </Card>
      </div>
    );
  }

  if (!tokenInfo) {
    return (
      <div className="container mx-auto p-4">
        <Card className="p-4">
          <div className="text-center">Loading token information...</div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="p-6 space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">{tokenInfo.name} ({tokenInfo.symbol})</h2>
          <div className="text-sm text-gray-500">
            Current Price: ${tokenInfo.price.toFixed(6)}
            <span className={`ml-2 ${tokenInfo.priceChange24h >= 0 ? "text-green-600" : "text-red-600"}`}>
              ({tokenInfo.priceChange24h.toFixed(2)}%)
            </span>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (SOL)</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount in SOL"
              disabled={!connected || loading}
            />
          </div>

          <div className="space-y-2">
            <Label>Estimated Output</Label>
            <div className="text-lg font-medium">
              {amount && tokenInfo.price
                ? `${(parseFloat(amount) / tokenInfo.price).toFixed(6)} ${tokenInfo.symbol}`
                : "0.00"}
            </div>
          </div>

          <Button
            className="w-full"
            onClick={handleTrade}
            disabled={!connected || loading || !amount}
          >
            {!connected
              ? "Connect Wallet"
              : loading
              ? "Processing..."
              : `Buy ${tokenInfo.symbol}`}
          </Button>
        </div>
      </Card>
    </div>
  );
}
