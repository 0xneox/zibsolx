import { createContext, useContext, useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { useToast } from "@/components/ui/use-toast";

// Mock data for development
const mockUserData = {
  id: "mock-user-id",
  email: "demo@example.com",
  kyc_status: "pending",
};

interface AuthContextType {
  user: any;
  walletBalance: number;
  walletAddress: string | null;
  isKycVerified: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: { email: string; password: string; username: string }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const { publicKey, connected } = useWallet();
  const { toast } = useToast();

  // Initialize Solana connection with fallback nodes
  const RPC_ENDPOINTS = [
    'https://api.devnet.solana.com',  // Use devnet for development
    'https://solana-devnet.g.alchemy.com/v2/demo',
    'https://api.testnet.solana.com',
  ];

  const getConnection = () => {
    const endpoint = RPC_ENDPOINTS[Math.floor(Math.random() * RPC_ENDPOINTS.length)];
    return new Connection(endpoint, { commitment: 'confirmed' });
  };

  const fetchBalance = async () => {
    if (!publicKey || !connected) {
      setWalletBalance(0);
      return;
    }

    let lastError;
    for (let i = 0; i < 3; i++) {  // Try up to 3 times
      try {
        const connection = getConnection();
        const balance = await connection.getBalance(publicKey);
        setWalletBalance(balance / LAMPORTS_PER_SOL);
        return;
      } catch (error) {
        console.error(`Error fetching balance (attempt ${i + 1}):`, error);
        lastError = error;
      }
    }
    console.error("Error fetching balance:", lastError);
    setWalletBalance(0); // Return 0 as fallback
  };

  useEffect(() => {
    // Set mock user data in development
    setUser(mockUserData);

    // Fetch initial balance
    if (connected && publicKey) {
      fetchBalance();
    }

    // Set up balance refresh interval
    const intervalId = setInterval(() => {
      if (connected && publicKey) {
        fetchBalance();
      }
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(intervalId);
  }, [connected, publicKey]);

  const isKycVerified = user?.kyc_status === 'verified';
  const walletAddress = publicKey?.toString() || null;

  const login = async (email: string, password: string) => {
    try {
      // For now, just set the mock user
      setUser(mockUserData);
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    }
  };

  const signup = async (data: { email: string; password: string; username: string }) => {
    try {
      setLoading(true);
      // TODO: Implement actual signup logic
      setUser(mockUserData);
      toast({
        title: "Account created",
        description: "Your account has been created successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create account. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Logout failed",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        walletBalance,
        walletAddress: publicKey?.toBase58() || null,
        isKycVerified: user?.kyc_status === "verified",
        loading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
