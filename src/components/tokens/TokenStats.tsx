import React from 'react';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiDollarSign, FiUsers, FiClock } from 'react-icons/fi';

interface TokenStatsProps {
  marketCap: string;
  volume24h: string;
  holders: string;
  created: string;
  priceChange24h: number;
}

export const TokenStats: React.FC<TokenStatsProps> = ({
  marketCap,
  volume24h,
  holders,
  created,
  priceChange24h,
}) => {
  const stats = [
    {
      icon: FiDollarSign,
      label: 'Market Cap',
      value: marketCap,
      color: 'blue',
    },
    {
      icon: FiTrendingUp,
      label: '24h Volume',
      value: volume24h,
      subValue: `${priceChange24h >= 0 ? '+' : ''}${priceChange24h}%`,
      color: priceChange24h >= 0 ? 'green' : 'red',
    },
    {
      icon: FiUsers,
      label: 'Holders',
      value: holders,
      color: 'purple',
    },
    {
      icon: FiClock,
      label: 'Created',
      value: created,
      color: 'pink',
    },
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-500/20 text-blue-500';
      case 'green':
        return 'bg-green-500/20 text-green-500';
      case 'red':
        return 'bg-red-500/20 text-red-500';
      case 'purple':
        return 'bg-purple-500/20 text-purple-500';
      case 'pink':
        return 'bg-pink-500/20 text-pink-500';
      default:
        return 'bg-gray-500/20 text-gray-500';
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="p-4 rounded-xl bg-gray-800/50 border border-gray-700"
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${getColorClasses(
                stat.color
              )}`}
            >
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm text-gray-400">{stat.label}</div>
              <div className="font-medium">{stat.value}</div>
              {stat.subValue && (
                <div
                  className={
                    stat.color === 'green'
                      ? 'text-green-500 text-sm'
                      : 'text-red-500 text-sm'
                  }
                >
                  {stat.subValue}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
