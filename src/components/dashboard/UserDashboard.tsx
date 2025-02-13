import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WalletHeader } from "../wallet/WalletHeader";
import { TokenChart } from "../charts/TokenChart";
import { Portfolio } from "../portfolio/Portfolio";
import { PriceAlerts } from "../portfolio/PriceAlerts";
import { TransactionHistory } from "../history/TransactionHistory";
import { useAuth } from "../auth/AuthProvider";
import { supabase } from "@/lib/supabase";
import { MemeTokenList } from "../meme/MemeTokenList";

interface TokenHolding {
  token_address: string;
  symbol: string;
  amount: number;
  value_usd: number;
  price_change_24h: number;
}

interface Transaction {
  id: string;
  type: "buy" | "sell" | "deposit" | "withdraw";
  token_symbol: string;
  amount: number;
  price_usd: number;
  timestamp: string;
  status: "completed" | "pending" | "failed";
}

export function UserDashboard() {
  const { user, walletAddress, isKycVerified } = useAuth();
  const [holdings, setHoldings] = useState<TokenHolding[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalValue, setTotalValue] = useState(0);
  const [memeTokens, setMemeTokens] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && walletAddress) {
      loadUserData();
      loadMemeTokens();
    }
  }, [user, walletAddress]);

  const loadUserData = async () => {
    try {
      // Load holdings
      const { data: holdingsData } = await supabase
        .from('user_holdings')
        .select('*')
        .eq('user_id', user?.id);

      if (holdingsData) {
        setHoldings(holdingsData);
        setTotalValue(
          holdingsData.reduce((sum, h) => sum + h.value_usd, 0)
        );
      }

      // Load transactions
      const { data: txData } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user?.id)
        .order('timestamp', { ascending: false });

      if (txData) {
        setTransactions(txData);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMemeTokens = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/meme-tokens');
      const data = await response.json();
      setMemeTokens(data);
    } catch (error) {
      console.error('Failed to load meme tokens:', error);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      {/* Wallet Header */}
      <WalletHeader
        balance={totalValue}
        isKycVerified={isKycVerified}
        onConnectWallet={async () => {
          // Add wallet connection logic here
        }}
      />

      {/* Main Dashboard */}
      <Tabs defaultValue="portfolio" className="w-full">
        <TabsList>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="meme-tokens">Meme Tokens</TabsTrigger>
        </TabsList>

        <TabsContent value="portfolio">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Portfolio Overview */}
            <Card className="p-4">
              <Portfolio />
            </Card>

            {/* Charts */}
            <Card className="p-4">
              <TokenChart
                tokenAddress="SOL"
                timeframe="24H"
              />
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="transactions">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Trading View */}
            <Card className="p-4">
              {/* Add SimplifiedMarketView here */}
            </Card>

            {/* Order Book / Trade History */}
            <Card className="p-4">
              <TransactionHistory />
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="meme-tokens">
          <Card className="p-4">
            <MemeTokenList 
              tokens={memeTokens} 
              onTrade={(token) => {
                // Integrate with trading system
                window.location.href = `/trade?token=${token.address}`;
              }} 
            />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
