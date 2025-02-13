import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useWallet } from "@solana/wallet-adapter-react";

interface MemeToken {
  address: string;
  name: string;
  symbol: string;
  price: number;
  volume24h: number;
  marketCap: number;
  priceChange24h: number;
  holders: number;
  score: number;
}

interface MemeTokenListProps {
  tokens: MemeToken[];
  onTrade: (token: MemeToken) => void;
}

export function MemeTokenList({ tokens, onTrade }: MemeTokenListProps) {
  const { connected } = useWallet();
  const [sortField, setSortField] = useState<keyof MemeToken>("score");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const sortedTokens = [...tokens].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    return sortDirection === "asc" 
      ? (aValue > bValue ? 1 : -1)
      : (bValue > aValue ? 1 : -1);
  });

  const handleSort = (field: keyof MemeToken) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Trending Meme Tokens</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => handleSort("score")}
          >
            Sort by Score
          </Button>
          <Button
            variant="outline"
            onClick={() => handleSort("volume24h")}
          >
            Sort by Volume
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Token</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>24h Change</TableHead>
            <TableHead>Volume (24h)</TableHead>
            <TableHead>Market Cap</TableHead>
            <TableHead>Holders</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedTokens.map((token) => (
            <TableRow key={token.address}>
              <TableCell>
                <div>
                  <div className="font-medium">{token.name}</div>
                  <div className="text-sm text-gray-500">{token.symbol}</div>
                </div>
              </TableCell>
              <TableCell>${formatNumber(token.price)}</TableCell>
              <TableCell className={token.priceChange24h >= 0 ? "text-green-600" : "text-red-600"}>
                {formatNumber(token.priceChange24h)}%
              </TableCell>
              <TableCell>${formatNumber(token.volume24h)}</TableCell>
              <TableCell>${formatNumber(token.marketCap)}</TableCell>
              <TableCell>{token.holders.toLocaleString()}</TableCell>
              <TableCell>{token.score.toFixed(2)}</TableCell>
              <TableCell>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onTrade(token)}
                  disabled={!connected}
                >
                  {connected ? "Trade" : "Connect Wallet"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
