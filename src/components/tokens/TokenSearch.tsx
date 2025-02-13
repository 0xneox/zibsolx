import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiX, FiStar } from 'react-icons/fi';
import { TokenInfo } from '@/types/token';

interface TokenSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (token: TokenInfo) => void;
  tokens: TokenInfo[];
}

export const TokenSearch: React.FC<TokenSearchProps> = ({
  isOpen,
  onClose,
  onSelect,
  tokens,
}) => {
  const [search, setSearch] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);

  const filteredTokens = tokens.filter(
    (token) =>
      token.symbol.toLowerCase().includes(search.toLowerCase()) ||
      token.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleFavorite = (address: string) => {
    setFavorites((prev) =>
      prev.includes(address)
        ? prev.filter((a) => a !== address)
        : [...prev, address]
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-6 rounded-2xl bg-gray-900 border border-gray-800 z-50"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Select Token</h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/10"
              >
                <FiX className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Search Input */}
            <div className="relative mb-4">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or paste address"
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-pink-500"
              />
            </div>

            {/* Token List */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredTokens.map((token) => (
                <motion.div
                  key={token.address}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSelect(token)}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={token.logoURI}
                      alt={token.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <div className="font-medium">{token.symbol}</div>
                      <div className="text-sm text-gray-400">{token.name}</div>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(token.address);
                    }}
                    className={`p-2 rounded-lg opacity-0 group-hover:opacity-100 ${
                      favorites.includes(token.address)
                        ? 'text-yellow-500'
                        : 'text-gray-400 hover:text-yellow-500'
                    }`}
                  >
                    <FiStar className="w-4 h-4" />
                  </motion.button>
                </motion.div>
              ))}

              {filteredTokens.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  No tokens found
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
