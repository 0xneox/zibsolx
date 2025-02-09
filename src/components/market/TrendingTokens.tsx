import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TokenData } from "@/types/market";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Sparkles } from "lucide-react";

interface TrendingTokensProps {
  tokens: TokenData[];
}

export function TrendingTokens({ tokens }: TrendingTokensProps) {
  return (
    <Card className="bg-gradient-to-br from-purple-900 to-indigo-900 text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Trending
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tokens.slice(0, 3).map((token) => (
            <Card
              key={token.id}
              className="bg-white/10 backdrop-blur-lg border-0"
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <img src={token.image} alt={token.name} />
                  </Avatar>
                  <div>
                    <h3 className="font-semibold flex items-center gap-2">
                      {token.name}
                      {token.launch_date &&
                        new Date(token.launch_date).getTime() >
                          Date.now() - 86400000 * 7 && (
                          <Badge className="bg-green-500">
                            <Sparkles className="w-3 h-3 mr-1" />
                            New
                          </Badge>
                        )}
                    </h3>
                    <p className="text-sm text-white/70">
                      {token.symbol.toUpperCase()}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex justify-between items-center">
                  <div>
                    <p className="text-sm text-white/70">Price</p>
                    <p className="font-medium">
                      ₹{token.price_inr.toLocaleString()}
                    </p>
                  </div>
                  <div
                    className={`text-right ${token.price_change_percentage_24h >= 0 ? "text-green-400" : "text-red-400"}`}
                  >
                    <p className="text-sm">24h</p>
                    <p className="font-medium">
                      {token.price_change_percentage_24h.toFixed(2)}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
