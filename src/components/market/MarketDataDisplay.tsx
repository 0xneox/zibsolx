import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TokenData } from "@/types/market";
import { Avatar } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChainSelector } from "./ChainSelector";
import { TrendingTokens } from "./TrendingTokens";
import { TokenDetailsDialog } from "./TokenDetails";
import { Search, SortAsc, Sparkles } from "lucide-react";

interface MarketDataDisplayProps {
  data: TokenData[];
  loading?: boolean;
  onViewSelect: (view: "trending" | "new" | "all" | "gainers") => void;
  selectedView: "trending" | "new" | "all" | "gainers";
}

export default function MarketDataDisplay({
  data = [],
  loading = false,
  onViewSelect,
  selectedView,
}: MarketDataDisplayProps) {
  const [search, setSearch] = useState("");
  const [selectedToken, setSelectedToken] = useState<string | null>(null);

  if (loading) {
    return <LoadingSkeleton />;
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  const formatMarketCap = (num: number) => {
    if (num >= 1e9) return `₹${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `₹${(num / 1e6).toFixed(2)}M`;
    return formatNumber(num);
  };

  const filteredData = data.filter(
    (token) =>
      token.name.toLowerCase().includes(search.toLowerCase()) ||
      token.symbol.toLowerCase().includes(search.toLowerCase()),
  );

  const trendingTokens = data
    .sort(
      (a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h,
    )
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <TrendingTokens tokens={trendingTokens} />

      <Card className="w-full bg-white">
        <CardContent className="p-6">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
              <ChainSelector
                selectedView={selectedView}
                onSelect={onViewSelect}
              />
              <div className="relative w-full md:w-[300px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search tokens..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asset</TableHead>
                  <TableHead>Price (INR)</TableHead>
                  <TableHead>24h Change</TableHead>
                  <TableHead>Market Cap</TableHead>
                  <TableHead>Volume (24h)</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((token) => (
                  <TableRow
                    key={token.id}
                    className="hover:bg-slate-50 cursor-pointer"
                    onClick={() => setSelectedToken(token.address)}
                  >
                    <TableCell className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <img src={token.image} alt={token.name} />
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{token.name}</span>
                          {token.launch_date &&
                            new Date(token.launch_date).getTime() >
                              Date.now() - 86400000 * 7 && (
                              <Sparkles className="w-4 h-4 text-green-500" />
                            )}
                        </div>
                        <span className="text-sm text-slate-500">
                          {token.symbol.toUpperCase()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{formatNumber(token.price_inr)}</TableCell>
                    <TableCell
                      className={
                        token.price_change_percentage_24h >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {token.price_change_percentage_24h.toFixed(2)}%
                    </TableCell>
                    <TableCell>{formatMarketCap(token.market_cap)}</TableCell>
                    <TableCell>{formatMarketCap(token.total_volume)}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        Trade
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {selectedToken && (
        <TokenDetailsDialog
          tokenAddress={selectedToken}
          chain={selectedChain}
          open={!!selectedToken}
          onClose={() => setSelectedToken(null)}
        />
      )}
    </div>
  );
}

const LoadingSkeleton = () => (
  <div className="space-y-6">
    <Card className="w-full bg-white">
      <CardContent className="p-6">
        <div className="space-y-2">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="flex gap-4 items-center">
                <Skeleton className="h-12 w-full" />
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  </div>
);
