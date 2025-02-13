import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, AlertTriangle, Shield } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// This component shows a simplified view but uses all our advanced backend analytics
export function SimplifiedMarketView({ tokenData, analytics }) {
  const { toast } = useToast();

  // Behind the scenes, we're still using all our advanced analytics
  const isTokenSafe = () => {
    return (
      analytics.rugPullRisk < 0.3 &&
      analytics.liquidityUSD > 50000 &&
      analytics.honeypotRisk < 0.3
    );
  };

  // Simplified price change display
  const getPriceChangeDisplay = () => {
    const change = tokenData.priceChange24h;
    if (change > 0) {
      return {
        color: "text-green-500",
        icon: <TrendingUp className="w-5 h-5" />,
        text: `↑ ${change.toFixed(2)}%`
      };
    }
    return {
      color: "text-red-500",
      icon: <TrendingDown className="w-5 h-5" />,
      text: `↓ ${Math.abs(change).toFixed(2)}%`
    };
  };

  const priceChange = getPriceChangeDisplay();

  return (
    <Card className="p-4 max-w-sm mx-auto">
      {/* Token Name & Safety Badge */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">{tokenData.symbol}</h2>
        {isTokenSafe() ? (
          <Badge className="bg-green-500">
            <Shield className="w-4 h-4 mr-1" /> Safe
          </Badge>
        ) : (
          <Badge variant="destructive">
            <AlertTriangle className="w-4 h-4 mr-1" /> Be Careful
          </Badge>
        )}
      </div>

      {/* Simple Price Display */}
      <div className="text-center my-6">
        <div className="text-3xl font-bold">
          ₹{tokenData.priceInr.toLocaleString()}
        </div>
        <div className={`text-lg mt-2 flex items-center justify-center ${priceChange.color}`}>
          {priceChange.icon}
          <span className="ml-1">{priceChange.text}</span>
        </div>
      </div>

      {/* Simple Market Status */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-3 bg-muted rounded-lg">
          <div className="text-sm text-muted-foreground">24h Volume</div>
          <div className="font-bold">₹{(tokenData.volume24h / 10000000).toFixed(2)}Cr</div>
        </div>
        <div className="text-center p-3 bg-muted rounded-lg">
          <div className="text-sm text-muted-foreground">Market Mood</div>
          <div className="font-bold">
            {tokenData.buySellRatio > 1 ? "😊 Positive" : "😟 Negative"}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <Button 
          className="w-full bg-green-500 hover:bg-green-600" 
          onClick={() => toast({ title: "Coming Soon!", description: "Trading features will be available soon." })}
        >
          Buy Now
        </Button>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => toast({ title: "Added!", description: "We'll alert you about important changes." })}
        >
          🔔 Set Alert
        </Button>
      </div>

      {/* Simple Risk Warning */}
      {!isTokenSafe() && (
        <div className="mt-4 p-3 bg-red-500/10 rounded-lg text-center">
          <AlertTriangle className="w-4 h-4 mx-auto mb-2" />
          <p className="text-sm">
            This token shows some risk signals. Trade carefully!
          </p>
        </div>
      )}
    </Card>
  );
}
