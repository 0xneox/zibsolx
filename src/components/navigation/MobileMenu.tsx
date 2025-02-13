import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiHome, FiTrendingUp, FiBook, FiSettings, FiGlobe } from 'react-icons/fi';
import { RiRocketLine } from 'react-icons/ri';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  currentPath: string;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  currentPath,
}) => {
  const menuItems = [
    { icon: FiHome, label: 'Home', path: '/' },
    { icon: RiRocketLine, label: 'Trade', path: '/trade' },
    { icon: FiTrendingUp, label: 'Trending', path: '/trending' },
    { icon: FiBook, label: 'History', path: '/history' },
    { icon: FiSettings, label: 'Settings', path: '/settings' },
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Menu */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30 }}
            className="fixed right-0 top-0 bottom-0 w-64 bg-gray-900 border-l border-gray-800 z-50"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-800 flex justify-between items-center">
              <h2 className="text-xl font-bold">Menu</h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/10"
              >
                <FiX className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Menu Items */}
            <div className="p-4 space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPath === item.path;

                return (
                  <motion.a
                    key={item.path}
                    href={item.path}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center gap-3 p-3 rounded-xl ${
                      isActive
                        ? 'bg-gradient-to-r from-pink-500 to-purple-500'
                        : 'hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </motion.a>
                );
              })}
            </div>

            {/* Network Selection */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FiGlobe className="w-5 h-5 text-yellow-500" />
                  <span className="text-yellow-500">Mainnet</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-3 py-1 rounded-lg bg-yellow-500/20 text-yellow-500 text-sm"
                >
                  Change
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
