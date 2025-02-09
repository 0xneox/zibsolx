import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TokenDetails as TokenDetailsType } from "@/types/market";
import { getTokenDetails } from "@/lib/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  ExternalLink,
  Twitter,
  MessageCircle,
  Rocket,
  AlertTriangle,
  Users,
  Wallet,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface TokenDetailsProps {
  tokenAddress: string;
  chain: string;
  open: boolean;
  onClose: () => void;
}

export function TokenDetailsDialog({
  tokenAddress,
  chain,
  open,
  onClose,
}: TokenDetailsProps) {
  const [details, setDetails] = useState<TokenDetailsType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open && tokenAddress) {
      loadTokenDetails();
    }
  }, [tokenAddress, open]);

  const loadTokenDetails = async () => {
    setLoading(true);
    const data = await getTokenDetails(tokenAddress, chain);
    setDetails(data);
    setLoading(false);
  };

  if (!details || loading) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <img src={details.image} alt={details.name} className="w-8 h-8" />
            {details.name} ({details.symbol.toUpperCase()})
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Price Chart</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={details.chart_data}>
                    <XAxis
                      dataKey="timestamp"
                      tickFormatter={(timestamp) =>
                        new Date(timestamp * 1000).toLocaleDateString()
                      }
                    />
                    <YAxis />
                    <Tooltip
                      formatter={(value: number) => [
                        `₹${value.toLocaleString()}`,
                        "Price",
                      ]}
                      labelFormatter={(timestamp) =>
                        new Date(timestamp * 1000).toLocaleString()
                      }
                    />
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke="#8884d8"
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                DYOR! This is a memecoin. High risk, high reward!
              </AlertDescription>
            </Alert>

            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Price</p>
                      <p className="text-2xl font-bold">
                        ₹{details.price_inr.toLocaleString()}
                      </p>
                    </div>
                    <div
                      className={`text-right ${details.price_change_percentage_24h >= 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      <p className="text-sm text-muted-foreground">
                        24h Change
                      </p>
                      <p className="text-xl font-bold">
                        {details.price_change_percentage_24h.toFixed(2)}%
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Market Cap</span>
                      <span>₹{details.market_cap.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">24h Volume</span>
                      <span>₹{details.total_volume.toLocaleString()}</span>
                    </div>
                    {details.holders && (
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          Holders
                        </span>
                        <span>{details.holders.toLocaleString()}</span>
                      </div>
                    )}
                    {details.liquidity && (
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center gap-1">
                          <Wallet className="w-4 h-4" />
                          Liquidity
                        </span>
                        <span>₹{details.liquidity.toLocaleString()}</span>
                      </div>
                    )}
                  </div>

                  {details.launch_date && (
                    <div className="pt-2">
                      <p className="text-sm text-muted-foreground mb-1">Age</p>
                      <div className="flex items-center gap-2">
                        <Rocket className="w-4 h-4" />
                        <span>
                          {new Date(details.launch_date).toLocaleDateString()}(
                          {Math.floor(
                            (Date.now() -
                              new Date(details.launch_date).getTime()) /
                              (1000 * 60 * 60 * 24),
                          )}{" "}
                          days old)
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Price</p>
                    <p className="text-2xl font-bold">
                      ₹{details.price_inr.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">24h Change</p>
                    <p
                      className={`text-lg font-semibold ${details.price_change_percentage_24h >= 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      {details.price_change_percentage_24h.toFixed(2)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Market Cap</p>
                    <p className="text-lg font-semibold">
                      ₹{details.market_cap.toLocaleString()}
                    </p>
                  </div>
                  {details.holders && (
                    <div>
                      <p className="text-sm text-muted-foreground">Holders</p>
                      <p className="text-lg font-semibold">
                        {details.holders.toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              {details.buy_links.map((link) => (
                <Button
                  key={link.name}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                  size="lg"
                  onClick={() => window.open(link.url, "_blank")}
                >
                  Buy on {link.name}
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              ))}
            </div>

            {(details.twitter || details.telegram) && (
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    {details.twitter && (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => window.open(details.twitter, "_blank")}
                      >
                        <Twitter className="w-4 h-4 mr-2" />
                        Twitter
                      </Button>
                    )}
                    {details.telegram && (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => window.open(details.telegram, "_blank")}
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Telegram
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
