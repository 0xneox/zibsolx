import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "../auth/AuthProvider";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw' | 'buy' | 'sell';
  amount: number;
  token: string;
  timestamp: Date;
  status: 'completed' | 'pending' | 'failed';
}

export function FinancialDashboard() {
  const { user, walletBalance } = useAuth();
  const [transactions] = React.useState<Transaction[]>([]); // Replace with actual transaction fetching
  const navigate = useNavigate();
  const { connected, publicKey } = useWallet();

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            className="h-10 w-10"
            onClick={handleBack}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </Button>
          <h1 className="text-2xl font-bold">Financial Overview</h1>
        </div>
        <WalletMultiButton />
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid grid-cols-4 gap-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="deposit-withdraw">Deposits & Withdrawals</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-6">
            {/* Wallet Status */}
            <Card>
              <CardHeader>
                <CardTitle>Wallet Status</CardTitle>
                <CardDescription>
                  {connected ? 'Your wallet is connected' : 'Connect your wallet to access all features'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {connected ? (
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">Wallet Address</div>
                    <div className="font-mono text-sm">{publicKey?.toString()}</div>
                    <div className="text-sm text-muted-foreground mt-4">Available Balance</div>
                    <div className="text-3xl font-bold">
                      <span className="text-primary">SOL</span> {Number(walletBalance).toFixed(2)}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <WalletMultiButton />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            {connected && (
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  className="h-auto py-6 bg-primary/10 hover:bg-primary/20" 
                  variant="ghost"
                  onClick={() => navigate('/deposit')}
                >
                  <div className="flex flex-col items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <polyline points="19 12 12 19 5 12" />
                    </svg>
                    <span>Deposit</span>
                  </div>
                </Button>
                <Button 
                  className="h-auto py-6 bg-primary/10 hover:bg-primary/20" 
                  variant="ghost"
                  onClick={() => navigate('/withdraw')}
                >
                  <div className="flex flex-col items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                      <line x1="12" y1="19" x2="12" y2="5" />
                      <polyline points="5 12 12 5 19 12" />
                    </svg>
                    <span>Withdraw</span>
                  </div>
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your trading activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.length > 0 ? (
                  transactions.map((tx) => (
                    <motion.div
                      key={tx.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-between p-4 rounded-lg border"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${
                          tx.type === 'buy' || tx.type === 'deposit' 
                            ? 'bg-green-500/10 text-green-500' 
                            : 'bg-red-500/10 text-red-500'
                        }`}>
                          {tx.type === 'buy' || tx.type === 'deposit' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                              <line x1="12" y1="5" x2="12" y2="19" />
                              <polyline points="19 12 12 19 5 12" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                              <line x1="12" y1="19" x2="12" y2="5" />
                              <polyline points="5 12 12 5 19 12" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(tx.timestamp).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          {tx.type === 'buy' || tx.type === 'deposit' ? '+' : '-'}{tx.amount} {tx.token}
                        </div>
                        <div className={`text-sm ${
                          tx.status === 'completed' ? 'text-green-500' : 
                          tx.status === 'pending' ? 'text-yellow-500' : 'text-red-500'
                        }`}>
                          {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No transactions yet
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile & Settings</CardTitle>
              <CardDescription>Manage your account</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* User Info */}
                <div className="flex items-center gap-4 p-4 rounded-lg border">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <div>
                    <div className="font-medium">{user?.email}</div>
                    <div className="text-sm text-muted-foreground">
                      Account ID: {user?.id}
                    </div>
                  </div>
                </div>

                {/* Wallet Connection */}
                <div className="flex items-center gap-4 p-4 rounded-lg border">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                    <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" />
                    <path d="M4 6v12c0 1.1.9 2 2 2h14v-4" />
                    <path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z" />
                  </svg>
                  <div>
                    <div className="font-medium">Wallet Status</div>
                    <div className="text-sm text-muted-foreground">
                      {connected ? 'Connected to ' + publicKey?.toString().slice(0, 8) + '...' : 'Not connected'}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default FinancialDashboard;
