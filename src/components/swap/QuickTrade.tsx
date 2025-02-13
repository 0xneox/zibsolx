import React, { useState, useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { motion } from 'framer-motion';
import { FiArrowDown, FiSettings, FiInfo } from 'react-icons/fi';
import { PriceChart } from '../charts/PriceChart';
import { Label } from '@/components/ui/label';
import { TokenSearch } from '../tokens/TokenSearch';
import { TokenDetail } from '../tokens/TokenDetail';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import confetti from 'canvas-confetti';
import { TokenInfo } from '@/types/token';

const generateMockPriceData = (timeframe: '1H' | '24H' | '7D' | '30D' | '1Y') => {
  const now = Date.now();
  const data = [];
  let points;
  let interval;

  switch (timeframe) {
    case '1H':
      points = 60;
      interval = 60 * 1000; // 1 minute
      break;
    case '24H':
      points = 96;
      interval = 15 * 60 * 1000; // 15 minutes
      break;
    case '7D':
      points = 168;
      interval = 60 * 60 * 1000; // 1 hour
      break;
    case '30D':
      points = 120;
      interval = 6 * 60 * 60 * 1000; // 6 hours
      break;
    case '1Y':
      points = 365;
      interval = 24 * 60 * 60 * 1000; // 1 day
      break;
  }

  let basePrice = 0.00001234;
  let lastVolume = 100000;

  for (let i = 0; i < points; i++) {
    const timestamp = now - (points - i) * interval;
    const randomChange = (Math.random() - 0.5) * 0.0000001;
    basePrice += randomChange;
    const volumeChange = (Math.random() - 0.5) * 10000;
    lastVolume = Math.max(0, lastVolume + volumeChange);

    data.push({
      timestamp,
      price: basePrice,
      volume: lastVolume,
    });
  }

  return data;
};

export const QuickTrade: React.FC = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();

  // Token states
  const [fromToken, setFromToken] = useState<TokenInfo | null>(null);
  const [toToken, setToToken] = useState<TokenInfo | null>(null);
  const [amount, setAmount] = useState('');
  const [slippage, setSlippage] = useState(0.5);
  const [isLoading, setIsLoading] = useState(false);
  const [tokens, setTokens] = useState<TokenInfo[]>([]);
  const [priceImpact, setPriceImpact] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isFromTokenSearchOpen, setIsFromTokenSearchOpen] = useState(false);
  const [isToTokenSearchOpen, setIsToTokenSearchOpen] = useState(false);
  const [selectedTokenForDetail, setSelectedTokenForDetail] = useState<{
    name: string;
    symbol: string;
    price: number;
    priceChange: number;
    marketCap: string;
    volume: string;
    holders: string;
    supply: string;
    created: string;
    logo: string;
  } | null>(null);

  // Chart states
  const [timeframe, setTimeframe] = useState<'1H' | '24H' | '7D' | '30D' | '1Y'>('24H');
  const priceData = generateMockPriceData(timeframe);

  useEffect(() => {
    fetchTokens();
  }, []);

  const fetchTokens = async () => {
    try {
      setIsLoading(true);
      // Mock token list for now
      const mockTokens: TokenInfo[] = [
        { address: '1', symbol: 'SOL', name: 'Solana', decimals: 9, logoURI: '/solana-logo.png' },
        { address: '2', symbol: 'PEPE', name: 'Pepe', decimals: 6, logoURI: '/pepe-logo.png' },
        { address: '3', symbol: 'WOJAK', name: 'Wojak', decimals: 6, logoURI: '/wojak-logo.png' },
      ];
      setTokens(mockTokens);
      setFromToken(mockTokens[0]);
      setToToken(mockTokens[1]);
    } catch (error) {
      console.error('Error fetching tokens:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTokenClick = (token: TokenInfo) => {
    setSelectedTokenForDetail({
      name: token.name,
      symbol: token.symbol,
      price: 16.51, // Mock price
      priceChange: 9.73, // Mock price change
      marketCap: '$16.5B',
      volume: '$284M',
      holders: '639K',
      supply: '1.0B',
      created: '2d 11h ago',
      logo: token.logoURI || '',
    });
  };

  const handleTrade = async () => {
    try {
      setIsLoading(true);
      // Mock successful trade
      await new Promise(resolve => setTimeout(resolve, 1000));
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    } catch (error) {
      console.error('Error executing trade:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Price Chart */}
      <div className="bg-gray-900 rounded-xl overflow-hidden">
        <PriceChart
          data={priceData}
          tokenSymbol={toToken?.symbol || 'PEPE'}
          timeframe={timeframe}
          onTimeframeChange={setTimeframe}
        />
      </div>

      {/* Trading Interface */}
      <div className="bg-gray-900 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Quick Trade</h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-lg hover:bg-gray-800"
          >
            <FiSettings className="w-5 h-5" />
          </motion.button>
        </div>

        <div className="space-y-4">
          {/* From Token */}
          <div>
            <Label>From</Label>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-400">Pay</span>
                <span className="text-sm text-gray-400">
                  Balance: {fromToken ? '1.234' : '0.00'} {fromToken?.symbol}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.0"
                  className="bg-transparent text-2xl font-bold outline-none flex-1"
                />
                <button
                  onClick={() => fromToken ? handleTokenClick(fromToken) : setIsFromTokenSearchOpen(true)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-700 hover:bg-gray-600"
                >
                  {fromToken?.symbol || 'Select Token'}
                </button>
              </div>
            </div>
          </div>

          {/* Swap Arrow */}
          <div className="flex justify-center">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const temp = fromToken;
                setFromToken(toToken);
                setToToken(temp);
              }}
              className="p-2 rounded-full bg-gray-800 hover:bg-gray-700"
            >
              <FiArrowDown className="w-5 h-5" />
            </motion.button>
          </div>

          {/* To Token */}
          <div>
            <Label>To</Label>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-400">Receive (estimated)</span>
                <span className="text-sm text-gray-400">
                  Balance: {toToken ? '0.00' : '0.00'} {toToken?.symbol}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  value={amount ? (Number(amount) * 81234.567).toString() : ''}
                  readOnly
                  placeholder="0.0"
                  className="bg-transparent text-2xl font-bold outline-none flex-1"
                />
                <button
                  onClick={() => toToken ? handleTokenClick(toToken) : setIsToTokenSearchOpen(true)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-700 hover:bg-gray-600"
                >
                  {toToken?.symbol || 'Select Token'}
                </button>
              </div>
            </div>
          </div>

          {/* Token Search and Detail Modals */}
          <TokenSearch
            isOpen={isFromTokenSearchOpen}
            onClose={() => setIsFromTokenSearchOpen(false)}
            onSelect={(token) => {
              setFromToken(token);
              setIsFromTokenSearchOpen(false);
            }}
            tokens={tokens}
          />

          <TokenSearch
            isOpen={isToTokenSearchOpen}
            onClose={() => setIsToTokenSearchOpen(false)}
            onSelect={(token) => {
              setToToken(token);
              setIsToTokenSearchOpen(false);
            }}
            tokens={tokens}
          />

          <TokenDetail
            isOpen={!!selectedTokenForDetail}
            onClose={() => setSelectedTokenForDetail(null)}
            token={selectedTokenForDetail}
          />

          {/* Slippage Settings */}
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Slippage Tolerance</span>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="text-gray-400 cursor-help"
                >
                  <FiInfo className="w-4 h-4" />
                </motion.div>
              </div>
              <div className="flex gap-2">
                {[0.5, 1, 2, 3].map((value) => (
                  <button
                    key={value}
                    onClick={() => setSlippage(value)}
                    className={`px-2 py-1 rounded-lg text-sm ${
                      slippage === value
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                    }`}
                  >
                    {value}%
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Trade Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleTrade}
            disabled={!publicKey || isLoading || !amount || !fromToken || !toToken}
            className={`w-full py-3 rounded-xl font-bold ${
              !publicKey
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : isLoading
                ? 'bg-blue-500/50 cursor-wait'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {isLoading ? (
              <LoadingSpinner />
            ) : !publicKey ? (
              'Connect Wallet'
            ) : !amount ? (
              'Enter Amount'
            ) : (
              'Swap'
            )}
          </motion.button>

          {/* Price Impact Warning */}
          {priceImpact && priceImpact > 2 && (
            <div className="text-center text-sm text-yellow-500">
              High Price Impact: {priceImpact.toFixed(2)}%
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
