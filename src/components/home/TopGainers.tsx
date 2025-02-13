import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion } from 'framer-motion';

interface Token {
  symbol: string;
  name: string;
  change24h: number;
  icon: string;
}

const topGainers: Token[] = [
  {
    symbol: 'FULLSEND',
    name: 'Fullsend',
    change24h: 35.81,
    icon: '🚀'
  },
  {
    symbol: 'HAMMY',
    name: 'Hammy',
    change24h: 179.83,
    icon: '🐹'
  },
  {
    symbol: 'PEPE',
    name: 'Pepe',
    change24h: 28.45,
    icon: '🐸'
  }
];

export function TopGainers() {
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
          <h2 className="text-lg font-medium">Top Gainers</h2>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-sm text-orange-400 hover:text-orange-300"
        >
          View All
        </motion.button>
      </div>
      
      <ScrollArea className="w-full">
        <div className="flex gap-3">
          {topGainers.map((token, index) => (
            <motion.button
              key={token.symbol}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 px-4 py-3 glass-card rounded-xl hover-glow group"
            >
              <motion.div 
                className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-2xl"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                {token.icon}
              </motion.div>
              <div className="flex flex-col items-start">
                <span className="font-medium group-hover:text-white transition-colors">
                  {token.symbol}
                </span>
                <motion.div 
                  className="flex items-center gap-1 text-green-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                >
                  <span className="text-xs">▲</span>
                  <span className="price-up">{token.change24h.toFixed(2)}%</span>
                </motion.div>
              </div>
            </motion.button>
          ))}
        </div>
      </ScrollArea>
    </motion.div>
  );
}
