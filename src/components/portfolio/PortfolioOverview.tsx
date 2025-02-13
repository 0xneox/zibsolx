import React from 'react';
import { motion } from 'framer-motion';
import { FiArrowUp, FiArrowDown } from 'react-icons/fi';

interface TokenHolding {
  token: string;
  amount: number;
  value: number;
  pnl: number;
  pnlPercentage: number;
}

export interface PortfolioOverviewProps {
  holdings: TokenHolding[];
  totalValue: number;
  totalPnl: number;
}

export const PortfolioOverview: React.FC<PortfolioOverviewProps> = ({
  holdings,
  totalValue,
  totalPnl,
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value / 100);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-900 rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4">Portfolio Overview</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-sm text-gray-400">Total Value</div>
            <div className="text-2xl font-bold">{formatCurrency(totalValue)}</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-sm text-gray-400">Total P&L</div>
            <div className={`text-2xl font-bold flex items-center ${
              totalPnl >= 0 ? 'text-green-500' : 'text-red-500'
            }`}>
              {totalPnl >= 0 ? <FiArrowUp className="mr-1" /> : <FiArrowDown className="mr-1" />}
              {formatCurrency(Math.abs(totalPnl))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4">Holdings</h2>
        <div className="space-y-4">
          {holdings.map((holding) => (
            <motion.div
              key={holding.token}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800 rounded-lg p-4"
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-bold">{holding.token}</div>
                  <div className="text-sm text-gray-400">
                    {holding.amount.toLocaleString()} tokens
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">{formatCurrency(holding.value)}</div>
                  <div className={`text-sm flex items-center justify-end ${
                    holding.pnl >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {holding.pnl >= 0 ? <FiArrowUp className="mr-1" /> : <FiArrowDown className="mr-1" />}
                    {formatCurrency(Math.abs(holding.pnl))} ({formatPercentage(holding.pnlPercentage)})
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
