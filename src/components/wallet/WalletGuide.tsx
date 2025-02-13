import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiDownload, FiShield, FiDollarSign } from 'react-icons/fi';

interface WalletGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WalletGuide: React.FC<WalletGuideProps> = ({ isOpen, onClose }) => {
  const steps = [
    {
      icon: FiDownload,
      title: 'Install Phantom Wallet',
      description:
        'Download and install Phantom wallet from the Chrome Web Store.',
      link: 'https://phantom.app',
    },
    {
      icon: FiShield,
      title: 'Create or Import Wallet',
      description:
        'Create a new wallet or import your existing one using your seed phrase.',
    },
    {
      icon: FiDollarSign,
      title: 'Add SOL to Your Wallet',
      description:
        'Purchase SOL from an exchange or transfer from another wallet.',
    },
  ];

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
              <h2 className="text-xl font-bold">Get Started with Solana</h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/10"
              >
                <FiX className="w-5 h-5" />
              </motion.button>
            </div>

            <div className="space-y-6">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-4"
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      index === 0
                        ? 'bg-blue-500/20 text-blue-500'
                        : index === 1
                        ? 'bg-purple-500/20 text-purple-500'
                        : 'bg-green-500/20 text-green-500'
                    }`}
                  >
                    <step.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium mb-1">{step.title}</h3>
                    <p className="text-sm text-gray-400">{step.description}</p>
                    {step.link && (
                      <a
                        href={step.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-2 text-sm text-pink-500 hover:underline"
                      >
                        Visit Website →
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}

              <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                <p className="text-sm text-yellow-500">
                  🔒 Always keep your seed phrase safe and never share it with
                  anyone. This is your private key to access your funds.
                </p>
              </div>

              <div className="text-center text-sm text-gray-400">
                Need help?{' '}
                <a
                  href="https://docs.phantom.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-500 hover:underline"
                >
                  Visit Phantom Support
                </a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
