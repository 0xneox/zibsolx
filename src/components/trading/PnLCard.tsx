import React from 'react';
import { motion } from 'framer-motion';
import { FiArrowUp, FiArrowDown, FiDollarSign } from 'react-icons/fi';
import { RiRocketLine } from 'react-icons/ri';

interface PnLCardProps {
  totalValue: number;
  pnl24h: number;
  pnlPercentage: number;
  bestPerformer: {
    name: string;
    symbol: string;
    pnl: number;
    logo?: string;
  };
}

export const PnLCard: React.FC<PnLCardProps> = ({
  totalValue,
  pnl24h,
  pnlPercentage,
  bestPerformer,
}) => {
  const isProfitable = pnl24h >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800"
    >
      {/* Total Value */}
      <div className="mb-6">
        <div className="text-sm text-gray-400 mb-1">Portfolio Value</div>
        <div className="text-3xl font-bold">
          ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </div>
        <div
          className={`flex items-center gap-1 text-sm ${
            isProfitable ? 'text-green-500' : 'text-red-500'
          }`}
        >
          {isProfitable ? (
            <FiArrowUp className="w-4 h-4" />
          ) : (
            <FiArrowDown className="w-4 h-4" />
          )}
          <span>
            ${Math.abs(pnl24h).toLocaleString()} (
            {Math.abs(pnlPercentage).toFixed(2)}%)
          </span>
        </div>
      </div>

      {/* Best Performer */}
      <div className="p-4 rounded-xl bg-gray-800/50 border border-gray-700">
        <div className="text-sm text-gray-400 mb-3">🔥 Best Performer</div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {bestPerformer.logo && (
              <img
                src={bestPerformer.logo}
                alt={bestPerformer.name}
                className="w-10 h-10 rounded-full"
              />
            )}
            <div>
              <div className="font-medium">{bestPerformer.symbol}</div>
              <div className="text-sm text-gray-400">{bestPerformer.name}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-green-500">
              +{bestPerformer.pnl.toFixed(2)}%
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-3 py-1 rounded-lg bg-green-500/20 text-green-500 text-sm"
            >
              Trade
            </motion.button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="p-4 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center gap-2 font-medium"
        >
          <FiDollarSign className="w-5 h-5" />
          Buy
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="p-4 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center gap-2 font-medium"
        >
          <RiRocketLine className="w-5 h-5" />
          Sell
        </motion.button>
      </div>

      {/* Memetic Touch */}
      {isProfitable ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 text-center text-sm text-green-500"
        >
          🚀 To the moon! Keep HODLing! 🌕
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 text-center text-sm text-pink-500"
        >
          💎 Diamond hands! Buy the dip! 💪
        </motion.div>
      )}
    </motion.div>
  );
};
