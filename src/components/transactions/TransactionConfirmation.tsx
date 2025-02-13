import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowRight, FiX, FiExternalLink } from 'react-icons/fi';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface TransactionConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  fromToken: {
    symbol: string;
    amount: string;
    logo?: string;
  };
  toToken: {
    symbol: string;
    amount: string;
    logo?: string;
  };
  loading?: boolean;
  error?: string;
  txHash?: string;
}

export const TransactionConfirmation: React.FC<TransactionConfirmationProps> = ({
  isOpen,
  onClose,
  onConfirm,
  fromToken,
  toToken,
  loading,
  error,
  txHash,
}) => {
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
              <h2 className="text-xl font-bold">Confirm Swap</h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/10"
              >
                <FiX className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Transaction Details */}
            <div className="space-y-6">
              {/* From Token */}
              <div className="p-4 rounded-xl bg-gray-800/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {fromToken.logo && (
                      <img
                        src={fromToken.logo}
                        alt={fromToken.symbol}
                        className="w-8 h-8 rounded-full"
                      />
                    )}
                    <div>
                      <div className="text-sm text-gray-400">From</div>
                      <div className="font-medium">{fromToken.symbol}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{fromToken.amount}</div>
                    <div className="text-sm text-gray-400">
                      ≈ ${(parseFloat(fromToken.amount) * 1.5).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex justify-center">
                <div className="p-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500">
                  <FiArrowRight className="w-5 h-5" />
                </div>
              </div>

              {/* To Token */}
              <div className="p-4 rounded-xl bg-gray-800/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {toToken.logo && (
                      <img
                        src={toToken.logo}
                        alt={toToken.symbol}
                        className="w-8 h-8 rounded-full"
                      />
                    )}
                    <div>
                      <div className="text-sm text-gray-400">To</div>
                      <div className="font-medium">{toToken.symbol}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{toToken.amount}</div>
                    <div className="text-sm text-gray-400">
                      ≈ ${(parseFloat(toToken.amount) * 1.5).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Transaction Info */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Price Impact</span>
                  <span className="text-green-400">0.05%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Network Fee</span>
                  <span>0.000005 SOL</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Slippage Tolerance</span>
                  <span>1%</span>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500">
                  {error}
                </div>
              )}

              {/* Success Message */}
              {txHash && (
                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                  <div className="flex items-center justify-between text-green-500">
                    <span>Transaction submitted</span>
                    <a
                      href={`https://solscan.io/tx/${txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 hover:underline"
                    >
                      View <FiExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              )}

              {/* Action Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onConfirm}
                disabled={loading || !!txHash}
                className="relative w-full py-4 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 font-bold text-lg group overflow-hidden disabled:opacity-50"
              >
                <div className="absolute inset-0 bg-white/20 transform -skew-x-12 group-hover:translate-x-full transition-transform duration-1000" />
                <span className="flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <LoadingSpinner size="sm" />
                      Processing...
                    </>
                  ) : txHash ? (
                    'Transaction Submitted'
                  ) : (
                    'Confirm Swap'
                  )}
                </span>
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
