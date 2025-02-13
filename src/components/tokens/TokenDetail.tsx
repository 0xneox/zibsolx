import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiArrowLeft, FiShare2, FiStar, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import { PriceChart } from '../charts/PriceChart';
import { Skeleton } from '../ui/Skeleton';

interface TokenDetailProps {
  isOpen: boolean;
  onClose: () => void;
  token: {
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
  } | null;
}

type TimeFrame = '1H' | '24H' | '7D' | '1M' | '1Y' | 'ALL';

export const TokenDetail: React.FC<TokenDetailProps> = ({ isOpen, onClose, token }) => {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('24H');
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const timeFrames: TimeFrame[] = ['1H', '24H', '7D', '1M', '1Y', 'ALL'];

  const handleShare = async () => {
    try {
      await navigator.share({
        title: `${token?.name} (${token?.symbol})`,
        text: `Check out ${token?.name} on ZibsolX! Current price: $${token?.price}`,
        url: window.location.href,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && token && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="fixed inset-y-0 right-0 w-full md:w-[450px] bg-[#0B0E16] border-l border-gray-800/50 shadow-xl z-50 flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-800/50">
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-800/50 text-gray-400 hover:text-white transition-colors"
            >
              <FiArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`p-2 rounded-lg hover:bg-gray-800/50 transition-colors ${
                  isFavorite ? 'text-yellow-400' : 'text-gray-400 hover:text-white'
                }`}
              >
                <FiStar className="w-5 h-5" />
              </button>
              <button
                onClick={handleShare}
                className="p-2 rounded-lg hover:bg-gray-800/50 text-gray-400 hover:text-white transition-colors"
              >
                <FiShare2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Token Info */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Token Header */}
              <div className="flex items-center gap-4">
                <img
                  src={token.logo || '/default-token.png'}
                  alt={token.name}
                  className="w-16 h-16 rounded-full bg-gray-700"
                />
                <div>
                  <h2 className="text-2xl font-bold text-white">{token.symbol}</h2>
                  <p className="text-gray-400">{token.name}</p>
                </div>
              </div>

              {/* Price Info */}
              <div className="space-y-2">
                <div className="text-3xl font-bold text-white">
                  ${token.price.toLocaleString()}
                </div>
                <div className={`flex items-center gap-1 text-lg ${
                  token.priceChange >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {token.priceChange >= 0 ? (
                    <FiTrendingUp className="w-5 h-5" />
                  ) : (
                    <FiTrendingDown className="w-5 h-5" />
                  )}
                  {token.priceChange >= 0 ? '+' : ''}{token.priceChange}%
                </div>
              </div>

              {/* Chart */}
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2 p-1 bg-gray-800/30 rounded-lg">
                  {timeFrames.map((tf) => (
                    <button
                      key={tf}
                      onClick={() => setTimeFrame(tf)}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                        timeFrame === tf
                          ? 'bg-blue-500 text-white'
                          : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                      }`}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
                <div className="h-[300px] relative">
                  {isLoading ? (
                    <Skeleton className="w-full h-full rounded-xl" />
                  ) : (
                    <PriceChart timeFrame={timeFrame} />
                  )}
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-gray-800/30 border border-gray-700/50">
                  <div className="text-sm text-gray-400">Market Cap</div>
                  <div className="text-lg font-medium text-white">{token.marketCap}</div>
                </div>
                <div className="p-4 rounded-xl bg-gray-800/30 border border-gray-700/50">
                  <div className="text-sm text-gray-400">24h Volume</div>
                  <div className="text-lg font-medium text-white">{token.volume}</div>
                </div>
                <div className="p-4 rounded-xl bg-gray-800/30 border border-gray-700/50">
                  <div className="text-sm text-gray-400">Holders</div>
                  <div className="text-lg font-medium text-white">{token.holders}</div>
                </div>
                <div className="p-4 rounded-xl bg-gray-800/30 border border-gray-700/50">
                  <div className="text-sm text-gray-400">Total Supply</div>
                  <div className="text-lg font-medium text-white">{token.supply}</div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-gray-800/30 border border-gray-700/50">
                  <div className="text-sm text-gray-400">Created</div>
                  <div className="text-lg font-medium text-white">{token.created}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Buy Button */}
          <div className="p-4 border-t border-gray-800/50">
            <button className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl text-white font-medium hover:opacity-90 transition-opacity">
              Buy {token.symbol}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
