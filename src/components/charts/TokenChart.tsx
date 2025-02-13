import { useEffect, useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface PriceData {
  timestamp: number;
  price: number;
}

interface TokenChartProps {
  tokenAddress: string;
  timeframe: "1H" | "24H" | "7D" | "30D" | "1Y";
}

export function TokenChart({ tokenAddress, timeframe }: TokenChartProps) {
  const [data, setData] = useState<PriceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState(timeframe);

  const fetchChartData = async () => {
    setLoading(true);
    setError(null);
    try {
      // In production, replace with actual API call
      const response = await fetch(
        `https://api.birdeye.so/v1/chart/${tokenAddress}?timeframe=${selectedTimeframe}`
      );
      const json = await response.json();
      setData(json.data);
    } catch (error) {
      setError("Failed to load chart data");
      console.error("Chart data error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChartData();
  }, [tokenAddress, selectedTimeframe]);

  const formatData = useMemo(() => {
    return data.map((item) => ({
      ...item,
      date: new Date(item.timestamp).toLocaleString(),
    }));
  }, [data]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    }).format(price);
  };

  if (error) {
    return <ErrorState message={error} onRetry={fetchChartData} />;
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Price Chart</h2>
        <div className="flex gap-2">
          {(["1H", "24H", "7D", "30D", "1Y"] as const).map((tf) => (
            <Button
              key={tf}
              variant={selectedTimeframe === tf ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTimeframe(tf)}
            >
              {tf}
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
        <LoadingState message="Loading chart data..." />
      ) : (
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={formatData}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="rgb(var(--primary))"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="rgb(var(--primary))"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                tick={{ fill: "rgb(var(--foreground))" }}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return selectedTimeframe === "1H"
                    ? date.toLocaleTimeString()
                    : date.toLocaleDateString();
                }}
              />
              <YAxis
                tick={{ fill: "rgb(var(--foreground))" }}
                tickFormatter={(value) => formatPrice(value)}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgb(var(--background))",
                  border: "1px solid rgb(var(--border))",
                }}
                labelStyle={{ color: "rgb(var(--foreground))" }}
                formatter={(value: number) => [formatPrice(value), "Price"]}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke="rgb(var(--primary))"
                fillOpacity={1}
                fill="url(#colorPrice)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}
