import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ArrowUpDown, ExternalLink } from "lucide-react";
import { ResponsiveTable } from "@/components/ui/responsive-table";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { formatDistanceToNow } from "date-fns";

interface Transaction {
  id: string;
  type: "deposit" | "withdraw" | "trade";
  amount: number;
  token: string;
  timestamp: Date;
  status: "completed" | "pending" | "failed";
  txHash?: string;
}

export function TransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Transaction;
    direction: "asc" | "desc";
  }>({ key: "timestamp", direction: "desc" });

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      // In production, replace with actual API call
      const response = await fetch("/api/transactions");
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      setError("Failed to load transaction history");
      console.error("Transaction history error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (key: keyof Transaction) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === "desc" ? "asc" : "desc",
    }));
  };

  const filteredTransactions = transactions
    .filter((tx) =>
      search
        ? tx.token.toLowerCase().includes(search.toLowerCase()) ||
          tx.type.toLowerCase().includes(search.toLowerCase())
        : true
    )
    .sort((a, b) => {
      const multiplier = sortConfig.direction === "asc" ? 1 : -1;
      if (sortConfig.key === "timestamp") {
        return (
          (new Date(a[sortConfig.key]).getTime() -
            new Date(b[sortConfig.key]).getTime()) *
          multiplier
        );
      }
      return (
        (a[sortConfig.key] < b[sortConfig.key] ? -1 : 1) * multiplier
      );
    });

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    }).format(amount);
  };

  const headers = [
    { key: "type", label: "Type" },
    { key: "amount", label: "Amount" },
    { key: "token", label: "Token" },
    { key: "timestamp", label: "Time" },
    { key: "status", label: "Status" },
    { key: "txHash", label: "Transaction" },
  ];

  const renderCell = (value: string | number | Date): React.ReactNode => {
    if (value instanceof Date) {
      return value.toLocaleString();
    }
    return value.toString();
  };

  if (error) {
    return <ErrorState message={error} onRetry={fetchTransactions} />;
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Transaction History</h2>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {loading ? (
        <LoadingState message="Loading transaction history..." />
      ) : (
        <ResponsiveTable
          headers={headers}
          data={filteredTransactions}
          renderCell={renderCell}
        />
      )}
    </Card>
  );
}
