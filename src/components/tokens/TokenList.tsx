import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TokenInfo } from '@/types/token';
import { TokenDetail } from './TokenDetail';
import { FiTrendingUp, FiSearch, FiStar, FiFilter } from 'react-icons/fi';
import { Skeleton } from '../ui/Skeleton';
import { PriceChart } from '../charts/PriceChart';

interface TokenListProps {
  tokens: TokenInfo[];
}

export const TokenList: React.FC<TokenListProps> = ({ tokens }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedToken, setSelectedToken] = useState<{
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
  const [isMobile, setIsMobile] = useState(false);

  // Handle window resize
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleTokenClick = (token: TokenInfo) => {
    setSelectedToken({
      name: token.name,
      symbol: token.symbol,
      price: 16.51,
      priceChange: 9.73,
      marketCap: '$16.5B',
      volume: '$284M',
      holders: '639K',
      supply: '1.0B',
      created: '2d 11h ago',
      logo: token.logoURI || '',
    });
  };

  const toggleFavorite = (address: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setFavorites(prev => 
      prev.includes(address) 
        ? prev.filter(a => a !== address)
        : [...prev, address]
    );
  };

  const filteredTokens = tokens.filter(token => 
    token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className="h-full flex flex-col md:flex-row">
      {/* Token List */}
      <div className={`flex-1 flex flex-col bg-[#0B0E16] ${selectedToken && isMobile ? 'hidden' : ''}`}>
        {/* Search Bar */}
        <div className="sticky top-0 z-10 p-4 backdrop-blur-xl bg-[#0B0E16]/80 border-b border-gray-800/50">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search tokens..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800/50 rounded-xl border border-gray-700/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 rounded-lg bg-gray-700/50 text-gray-400 hover:text-white hover:bg-gray-600/50 transition-all">
              <FiFilter className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Token List */}
        <div className="flex-1 overflow-y-auto">
          <motion.div 
            className="p-4 space-y-2"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {isLoading ? (
              // Loading skeletons
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-gray-800/30">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div>
                      <Skeleton className="w-20 h-4 mb-1" />
                      <Skeleton className="w-32 h-3" />
                    </div>
                  </div>
                  <div className="text-right">
                    <Skeleton className="w-24 h-4 mb-1" />
                    <Skeleton className="w-16 h-3" />
                  </div>
                </div>
              ))
            ) : (
              filteredTokens.map((token) => (
                <motion.button
                  key={token.address}
                  onClick={() => handleTokenClick(token)}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-between p-4 rounded-xl bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={token.logoURI || '/default-token.png'}
                        alt={token.name}
                        className="w-10 h-10 rounded-full bg-gray-700"
                      />
                      <button
                        onClick={(e) => toggleFavorite(token.address, e)}
                        className={`absolute -top-1 -right-1 p-1 rounded-full bg-gray-800 border border-gray-700 
                          ${favorites.includes(token.address) ? 'text-yellow-400' : 'text-gray-400'} 
                          hover:text-yellow-400 transition-colors`}
                      >
                        <FiStar className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-white">{token.symbol}</div>
                      <div className="text-sm text-gray-400">{token.name}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="font-medium text-white">$16.51</div>
                      <div className="text-sm text-green-400 flex items-center justify-end gap-1">
                        <FiTrendingUp className="w-3 h-3" />
                        +9.73%
                      </div>
                    </div>
                  </div>
                </motion.button>
              ))
            )}
          </motion.div>
        </div>
      </div>

      {/* Token Detail Panel */}
      {selectedToken && (
        <div className={`${isMobile ? 'fixed inset-0 z-50' : 'w-[450px] border-l border-gray-800/50'}`}>
          <TokenDetail
            isOpen={!!selectedToken}
            onClose={() => setSelectedToken(null)}
            token={selectedToken}
          />
          <PriceChart />
        </div>
      )}
    </div>
  );
};
