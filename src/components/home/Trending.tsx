import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TrendingToken {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  marketCap: string;
  icon: string;
}

const trendingTokens: TrendingToken[] = [
  {
    symbol: 'TRUMP',
    name: 'Trump',
    price: 16.39,
    change24h: 6.71,
    marketCap: '$16.4B',
    icon: '🎭'
  },
  {
    symbol: 'ARC',
    name: 'Arc',
    price: 0.449,
    change24h: 43.8,
    marketCap: '$448M',
    icon: '⚡'
  },
  {
    symbol: 'FULLSEND',
    name: 'Fullsend',
    price: 0.0234,
    change24h: 35.81,
    marketCap: '$23.4M',
    icon: '🚀'
  },
  {
    symbol: 'FARTCOIN',
    name: 'Fartcoin',
    price: 0.486,
    change24h: -8.69,
    marketCap: '$486M',
    icon: '💨'
  }
];

export function Trending() {
  const formatPrice = (price: number) => {
    if (price < 0.001) return price.toFixed(6);
    if (price < 1) return price.toFixed(3);
    return price.toFixed(2);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl glass-card p-6 hover-glow"
      style={{
        background: 'linear-gradient(135deg, rgba(251, 146, 60, 0.2) 0%, rgba(236, 72, 153, 0.2) 100%)'
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <motion.span 
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            className="text-orange-500"
          >
            🔥
          </motion.span>
          <h2 className="text-lg font-medium">Trending</h2>
        </div>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2"
        >
          <span className="text-xs text-gray-400">Last updated: Just now</span>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-6 h-6 rounded-full glass-card flex items-center justify-center"
          >
            <span className="text-xs">↻</span>
          </motion.button>
        </motion.div>
      </div>
      
      <div className="space-y-2">
        <AnimatePresence>
          {trendingTokens.map((token, index) => (
            <motion.button
              key={token.symbol}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-between p-3 glass-card rounded-xl hover-glow group"
            >
              <div className="flex items-center gap-3">
                <motion.div 
                  className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-xl"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  {token.icon}
                </motion.div>
                <div>
                  <div className="font-medium text-left group-hover:text-white transition-colors">
                    {token.symbol}
                  </div>
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                    className="text-sm text-gray-400 text-left"
                  >
                    {token.marketCap} MKT CAP
                  </motion.div>
                </div>
              </div>
              <div className="text-right">
                <motion.div 
                  className="font-medium shimmer"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.1 }}
                >
                  ${formatPrice(token.price)}
                </motion.div>
                <motion.div 
                  className={`flex items-center justify-end gap-1 ${
                    token.change24h >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                >
                  <span className="text-xs">
                    {token.change24h >= 0 ? '▲' : '▼'}
                  </span>
                  <span className={token.change24h >= 0 ? 'price-up' : 'price-down'}>
                    {Math.abs(token.change24h).toFixed(2)}%
                  </span>
                </motion.div>
              </div>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
