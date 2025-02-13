import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiMoon, FiSun, FiGlobe, FiVolume2, FiBell } from 'react-icons/fi';
import { Switch } from '@/components/ui/switch';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
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
              <h2 className="text-xl font-bold">Settings</h2>
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
              {/* Theme */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gray-800">
                    <FiMoon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-medium">Dark Mode</div>
                    <div className="text-sm text-gray-400">
                      Toggle dark/light theme
                    </div>
                  </div>
                </div>
                <Switch />
              </div>

              {/* Sound */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gray-800">
                    <FiVolume2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-medium">Sound Effects</div>
                    <div className="text-sm text-gray-400">
                      Play sounds on actions
                    </div>
                  </div>
                </div>
                <Switch />
              </div>

              {/* Notifications */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gray-800">
                    <FiBell className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-medium">Notifications</div>
                    <div className="text-sm text-gray-400">
                      Get trade notifications
                    </div>
                  </div>
                </div>
                <Switch />
              </div>

              {/* Language */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gray-800">
                    <FiGlobe className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-medium">Language</div>
                    <div className="text-sm text-gray-400">
                      Choose your language
                    </div>
                  </div>
                </div>
                <select className="bg-gray-800 border-gray-700 rounded-lg text-sm">
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                </select>
              </div>

              {/* Network */}
              <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                <div className="flex items-center gap-2 text-yellow-500">
                  <FiGlobe className="w-5 h-5" />
                  <span className="font-medium">Network: Mainnet</span>
                </div>
                <p className="mt-2 text-sm text-yellow-500/80">
                  You are currently on Solana Mainnet. Be careful with real transactions.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
