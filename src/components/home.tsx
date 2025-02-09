import { useEffect, useState } from "react";
import LoginForm from "./auth/LoginForm";
import MarketDataDisplay from "./market/MarketDataDisplay";
import { login, logout, getMarketData } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import { TokenData } from "@/types/market";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";

function Home() {
  const [balance, setBalance] = useState(0);

  const fetchBalance = async () => {
    try {
      const { data, error } = await supabase
        .from("wallets")
        .select("balance")
        .single();

      if (error) throw error;
      setBalance(data?.balance || 0);
    } catch (error) {
      console.error("Failed to fetch balance:", error);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);
  const [user, setUser] = useState(supabase.auth.getUser());
  const [marketData, setMarketData] = useState<TokenData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedView, setSelectedView] = useState<
    "trending" | "new" | "all" | "gainers"
  >("trending");
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setUser(session);
      } else {
        setUser(null);
      }
    });

    fetchMarketData();
    const interval = setInterval(fetchMarketData, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [selectedChain]);

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
      toast({
        title: "Welcome back!",
        description: "Successfully logged in.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out",
        description: "Successfully logged out.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const fetchMarketData = async () => {
    try {
      setLoading(true);
      const data = await getMarketData(selectedChain);
      setMarketData(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch market data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewSelect = (view: "trending" | "new" | "all" | "gainers") => {
    setSelectedView(view);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!user ? (
          <div className="flex justify-center items-center min-h-[80vh]">
            <LoginForm onSubmit={handleLogin} />
          </div>
        ) : (
          <div className="space-y-6">
            <WalletHeader
              balance={balance}
              onDeposit={fetchBalance}
              onWithdraw={fetchBalance}
            />
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">Crypto Market Dashboard</h1>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
            <MarketDataDisplay
              data={marketData}
              loading={loading}
              selectedView={selectedView}
              onViewSelect={handleViewSelect}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
