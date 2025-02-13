import React, { useMemo, useState, useCallback } from 'react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { HomePage } from './components/home/HomePage';
import { TrendingPage } from './components/trending/TrendingPage';
import { HistoryPage } from './components/history/HistoryPage';
import { PortfolioOverview } from './components/portfolio/PortfolioOverview';
import { NotificationCenter, Notification } from './components/notifications/NotificationCenter';
import { TokenList } from './components/tokens/TokenList';
import { TokenInfo } from './types/token';

// Import wallet adapter styles
import '@solana/wallet-adapter-react-ui/styles.css';

export function App() {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  // Notification state
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Mock tokens data
  const [tokens] = useState<TokenInfo[]>([
    { address: '1', symbol: 'SOL', name: 'Solana', decimals: 9, logoURI: '/solana-logo.png' },
    { address: '2', symbol: 'PEPE', name: 'Pepe', decimals: 6, logoURI: '/pepe-logo.png' },
    { address: '3', symbol: 'WOJAK', name: 'Wojak', decimals: 6, logoURI: '/wojak-logo.png' },
    { address: '4', symbol: 'TRUMP', name: 'Trump Token', decimals: 6, logoURI: '/trump-logo.png' },
    { address: '5', symbol: 'DOGE', name: 'Dogecoin', decimals: 8, logoURI: '/doge-logo.png' },
    { address: '6', symbol: 'SHIB', name: 'Shiba Inu', decimals: 18, logoURI: '/shib-logo.png' },
  ]);

  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  // Mock portfolio data (replace with real data from your backend)
  const portfolioData = {
    holdings: [
      {
        token: 'PEPE',
        amount: 1000000,
        value: 1200,
        pnl: 200,
        pnlPercentage: 20,
      },
      {
        token: 'WOJAK',
        amount: 500000,
        value: 800,
        pnl: -100,
        pnlPercentage: -11.11,
      },
    ],
    totalValue: 2000,
    totalPnl: 100,
  };

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <BrowserRouter>
            <div className="min-h-screen bg-[#0B0E16] text-white">
              <AppLayout>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/trending" element={<TrendingPage />} />
                  <Route path="/history" element={<HistoryPage />} />
                  <Route path="/portfolio" element={
                    <PortfolioOverview
                      holdings={portfolioData.holdings}
                      totalValue={portfolioData.totalValue}
                      totalPnl={portfolioData.totalPnl}
                    />
                  } />
                  <Route path="/tokens" element={<TokenList tokens={tokens} />} />
                </Routes>
              </AppLayout>
              <NotificationCenter
                notifications={notifications}
                onDismiss={dismissNotification}
              />
            </div>
          </BrowserRouter>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
