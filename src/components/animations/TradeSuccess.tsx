import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface TradeSuccessProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'buy' | 'sell';
  amount: string;
  tokenSymbol: string;
}

export const TradeSuccess: React.FC<TradeSuccessProps> = ({
  isOpen,
  onClose,
  type,
  amount,
  tokenSymbol,
}) => {
  const [memeIndex, setMemeIndex] = useState(0);

  const memes = [
    '🚀 To the moon!',
    '💎 Diamond hands!',
    '🦍 Apes together strong!',
    '🌕 Moonshot incoming!',
    '🎯 Based trade!',
    '🔥 LFG!',
  ];

  useEffect(() => {
    if (isOpen) {
      // Trigger confetti
      const duration = 3000;
      const end = Date.now() + duration;

      const colors = type === 'buy' 
        ? ['#10B981', '#34D399'] // Green shades for buy
        : ['#EC4899', '#F472B6']; // Pink shades for sell

      (function frame() {
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors,
        });
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      }());

      // Rotate through memes
      const interval = setInterval(() => {
        setMemeIndex((prev) => (prev + 1) % memes.length);
      }, 2000);

      // Auto close after animation
      const timeout = setTimeout(onClose, 5000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [isOpen, type]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            className="relative p-8 rounded-2xl bg-gray-900/90 backdrop-blur-xl border border-gray-800 text-center max-w-md mx-4"
          >
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center ${
                type === 'buy' ? 'bg-green-500/20' : 'bg-pink-500/20'
              }`}
            >
              <span className="text-4xl">
                {type === 'buy' ? '🚀' : '💰'}
              </span>
            </motion.div>

            {/* Success Message */}
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className={`text-2xl font-bold mt-6 ${
                type === 'buy' ? 'text-green-500' : 'text-pink-500'
              }`}
            >
              {type === 'buy' ? 'Purchase Complete!' : 'Sale Complete!'}
            </motion.h2>

            {/* Transaction Details */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-4 text-gray-300"
            >
              {type === 'buy' ? 'Bought' : 'Sold'}{' '}
              <span className="font-bold">{amount}</span>{' '}
              <span className="font-bold">{tokenSymbol}</span>
            </motion.div>

            {/* Meme Text */}
            <motion.div
              key={memeIndex}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="mt-6 text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent"
            >
              {memes[memeIndex]}
            </motion.div>

            {/* View Transaction Button */}
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 font-medium"
            >
              View Transaction
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
