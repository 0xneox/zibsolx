import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiArrowUp, FiArrowDown } from 'react-icons/fi';
import { TokenDetail } from '../tokens/TokenDetail';

export const TrendingPage = () => {
  const [selectedToken, setSelectedToken] = useState(null);
  const [showTokenDetail, setShowTokenDetail] = useState(false);

  const trendingTokens = [
    {
      name: 'PEPE',
      symbol: 'PEPE',
      price: 0.00001234,
      priceChange: 125.5,
      volume: '$1.2M',
      marketCap: '$16.5B',
      logo: '/icons/pepe.svg',
    },
    {
      name: 'WOJAK',
      symbol: 'WOJAK',
      price: 0.0000789,
      priceChange: -15.3,
      volume: '$800K',
      marketCap: '$5.2M',
      logo: '/icons/wojak.svg',
    },
    // Add more trending tokens
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Trending 🔥</h1>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 rounded-xl glass-card"
          >
            24h
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 rounded-xl glass-card text-gray-400"
          >
            7d
          </motion.button>
        </div>
      </div>

      {/* Trending List */}
      <div className="space-y-4">
        {trendingTokens.map((token, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => {
              setSelectedToken({
                ...token,
                holders: '125K',
                supply: '100B',
                created: '2 months ago',
              });
              setShowTokenDetail(true);
            }}
            className="p-4 rounded-xl glass-card hover:border-pink-500/20 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.img
                  whileHover={{ scale: 1.1 }}
                  src={token.logo}
                  alt={token.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h3 className="font-bold">{token.symbol}</h3>
                  <span className="text-sm text-gray-400">{token.name}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">${token.price}</div>
                <div
                  className={`text-sm flex items-center gap-1 ${
                    token.priceChange >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {token.priceChange >= 0 ? (
                    <FiArrowUp className="w-3 h-3" />
                  ) : (
                    <FiArrowDown className="w-3 h-3" />
                  )}
                  {Math.abs(token.priceChange)}%
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-between text-sm text-gray-400">
              <div>Volume: {token.volume}</div>
              <div>Market Cap: {token.marketCap}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Token Detail Modal */}
      <TokenDetail
        isOpen={showTokenDetail}
        onClose={() => setShowTokenDetail(false)}
        token={selectedToken}
      />
    </div>
  );
};
