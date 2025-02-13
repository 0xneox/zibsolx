import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { getTokenDetails } from "@/lib/api";

interface PortfolioToken {
  address: string;
  symbol: string;
  amount: number;
  price: number;
  value: number;
  priceChange24h: number;
}

export function Portfolio() {
  const [tokens, setTokens] = useState<PortfolioToken[]>([]);
  const [newToken, setNewToken] = useState({ symbol: "", amount: "" });
  const [totalValue, setTotalValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load portfolio from localStorage
    const savedPortfolio = localStorage.getItem("portfolio");
    if (savedPortfolio) {
      setTokens(JSON.parse(savedPortfolio));
    }
  }, []);

  useEffect(() => {
    // Update total value whenever tokens change
    const total = tokens.reduce((sum, token) => sum + token.value, 0);
    setTotalValue(total);
    
    // Save to localStorage
    localStorage.setItem("portfolio", JSON.stringify(tokens));
  }, [tokens]);

  const updatePrices = async () => {
    setLoading(true);
    try {
      const updatedTokens = await Promise.all(
        tokens.map(async (token) => {
          const details = await getTokenDetails(token.address, "solana");
          if (!details) return token;
          
          return {
            ...token,
            price: details.price,
            value: token.amount * details.price,
            priceChange24h: details.priceChange24h,
          };
        })
      );
      
      setTokens(updatedTokens);
      toast({
        title: "Prices Updated",
        description: "Your portfolio values have been updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update prices. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addToken = async () => {
    if (!newToken.symbol || !newToken.amount) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      // In a real app, we'd search for the token here
      const tokenDetails = await getTokenDetails(newToken.symbol, "solana");
      
      if (!tokenDetails) {
        throw new Error("Token not found");
      }

      const token: PortfolioToken = {
        address: tokenDetails.address,
        symbol: tokenDetails.symbol,
        amount: parseFloat(newToken.amount),
        price: tokenDetails.price,
        value: parseFloat(newToken.amount) * tokenDetails.price,
        priceChange24h: tokenDetails.priceChange24h,
      };

      setTokens([...tokens, token]);
      setNewToken({ symbol: "", amount: "" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add token. Please check the symbol and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const removeToken = (address: string) => {
    setTokens(tokens.filter((token) => token.address !== address));
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Portfolio</h2>
        <div className="text-right">
          <div className="text-2xl font-bold">{formatNumber(totalValue)}</div>
          <div className="text-sm text-muted-foreground">Total Value</div>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <Input
          placeholder="Token Symbol (e.g., SOL)"
          value={newToken.symbol}
          onChange={(e) => setNewToken({ ...newToken, symbol: e.target.value })}
        />
        <Input
          type="number"
          placeholder="Amount"
          value={newToken.amount}
          onChange={(e) => setNewToken({ ...newToken, amount: e.target.value })}
        />
        <Button onClick={addToken} disabled={loading}>
          <Plus className="w-4 h-4 mr-2" />
          Add Token
        </Button>
        <Button variant="outline" onClick={updatePrices} disabled={loading}>
          Update Prices
        </Button>
      </div>

      <div className="space-y-2">
        {tokens.map((token) => (
          <div
            key={token.address}
            className="flex items-center justify-between p-2 border rounded hover:bg-muted/50"
          >
            <div className="flex items-center gap-4">
              <div>
                <div className="font-medium">{token.symbol}</div>
                <div className="text-sm text-muted-foreground">
                  {token.amount.toFixed(4)} tokens
                </div>
              </div>
              <Badge
                variant={token.priceChange24h >= 0 ? "default" : "destructive"}
              >
                {token.priceChange24h >= 0 ? "+" : ""}
                {token.priceChange24h.toFixed(2)}%
              </Badge>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div>{formatNumber(token.value)}</div>
                <div className="text-sm text-muted-foreground">
                  ${token.price.toFixed(4)} per token
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeToken(token.address)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
