import React from 'react';
import { motion } from 'framer-motion';
import { FiCheck, FiClock, FiArrowRight } from 'react-icons/fi';

export const HistoryPage = () => {
  const transactions = [
    {
      type: 'Buy',
      token: 'PEPE',
      amount: '1,000,000',
      value: '$150',
      status: 'completed',
      time: '2 mins ago',
      hash: '0x1234...5678',
    },
    {
      type: 'Sell',
      token: 'WOJAK',
      amount: '500,000',
      value: '$75',
      status: 'pending',
      time: '5 mins ago',
      hash: '0x8765...4321',
    },
    // Add more transactions
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">History</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 rounded-xl glass-card text-pink-500"
        >
          Export CSV
        </motion.button>
      </div>

      {/* Transactions List */}
      <div className="space-y-4">
        {transactions.map((tx, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-4 rounded-xl glass-card hover:border-pink-500/20"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    tx.type === 'Buy'
                      ? 'bg-green-500/20 text-green-500'
                      : 'bg-red-500/20 text-red-500'
                  }`}
                >
                  <FiArrowRight
                    className={`w-5 h-5 ${
                      tx.type === 'Buy' ? '' : 'transform rotate-180'
                    }`}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{tx.type}</span>
                    <span className="text-gray-400">{tx.token}</span>
                  </div>
                  <div className="text-sm text-gray-400">{tx.time}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">{tx.amount}</div>
                <div className="text-sm text-gray-400">{tx.value}</div>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm">
              <a
                href={`https://solscan.io/tx/${tx.hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-500 hover:underline"
              >
                View on Solscan
              </a>
              <div className="flex items-center gap-1">
                {tx.status === 'completed' ? (
                  <>
                    <FiCheck className="w-4 h-4 text-green-500" />
                    <span className="text-green-500">Completed</span>
                  </>
                ) : (
                  <>
                    <FiClock className="w-4 h-4 text-yellow-500 animate-spin" />
                    <span className="text-yellow-500">Pending</span>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {transactions.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
            <FiClock className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium mb-2">No transactions yet</h3>
          <p className="text-gray-400">
            Your trading history will appear here
          </p>
        </motion.div>
      )}
    </div>
  );
};
