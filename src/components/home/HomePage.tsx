import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiDollarSign, FiUsers, FiTrendingUp } from 'react-icons/fi';

export const HomePage: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row items-center justify-between max-w-7xl mx-auto px-4 py-12">
        <div className="space-y-6 lg:w-1/2">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            Trade Meme Tokens Instantly
          </h1>
          <p className="text-gray-400 text-lg">
            The simplest way to trade your favorite meme tokens on Solana. No complicated charts, just quick and easy trading.
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-4 bg-pink-500 rounded-xl font-medium text-white hover:bg-pink-600 transition-colors flex items-center gap-2"
          >
            Start Trading
          </motion.button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto px-4">
        <div className="p-6 rounded-xl bg-gray-800/30 border border-gray-700/50 space-y-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-green-500/10">
              <FiDollarSign className="text-green-500" size={24} />
            </div>
            <span className="text-gray-400">Total Volume</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">$1.2M</span>
            <span className="text-green-500 text-sm">+22% from last week</span>
          </div>
        </div>

        <div className="p-6 rounded-xl bg-gray-800/30 border border-gray-700/50 space-y-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-purple-500/10">
              <FiUsers className="text-purple-500" size={24} />
            </div>
            <span className="text-gray-400">Active Traders</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">2.5K</span>
            <span className="text-green-500 text-sm">+15% from last week</span>
          </div>
        </div>

        <div className="p-6 rounded-xl bg-gray-800/30 border border-gray-700/50 space-y-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <FiTrendingUp className="text-blue-500" size={24} />
            </div>
            <span className="text-gray-400">Price Change</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">+12.5%</span>
            <span className="text-gray-400 text-sm">in the last 24h</span>
          </div>
        </div>
      </div>
    </div>
  );
};
