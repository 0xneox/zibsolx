import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCheck, FiAlertCircle } from 'react-icons/fi';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
  timestamp: number;
}

export interface NotificationCenterProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  onDismiss,
}) => {
  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <FiCheck className="text-green-500" />;
      case 'error':
        return <FiAlertCircle className="text-red-500" />;
      default:
        return <FiAlertCircle className="text-blue-500" />;
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`flex items-center p-4 rounded-lg shadow-lg ${
              notification.type === 'error'
                ? 'bg-red-500/10 border border-red-500/20'
                : notification.type === 'success'
                ? 'bg-green-500/10 border border-green-500/20'
                : 'bg-blue-500/10 border border-blue-500/20'
            }`}
          >
            <div className="mr-3">{getIcon(notification.type)}</div>
            <div className="flex-1 text-sm text-white">{notification.message}</div>
            <button
              onClick={() => onDismiss(notification.id)}
              className="ml-3 text-gray-400 hover:text-white transition-colors"
            >
              <FiX />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
