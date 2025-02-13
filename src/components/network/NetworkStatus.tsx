import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiWifi, FiWifiOff } from 'react-icons/fi';
import { Connection } from '@solana/web3.js';

interface NetworkStatusProps {
  connection: Connection;
}

export const NetworkStatus: React.FC<NetworkStatusProps> = ({ connection }) => {
  const [isOnline, setIsOnline] = useState(true);
  const [latency, setLatency] = useState<number | null>(null);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const start = Date.now();
        await connection.getSlot();
        const end = Date.now();
        setLatency(end - start);
        setIsOnline(true);
      } catch (error) {
        setIsOnline(false);
        setLatency(null);
      }
    };

    const interval = setInterval(checkConnection, 10000);
    checkConnection();

    return () => clearInterval(interval);
  }, [connection]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed bottom-20 right-4 z-50 p-3 rounded-xl backdrop-blur-xl bg-gray-900/50 border border-gray-800"
    >
      <div className="flex items-center gap-2">
        {isOnline ? (
          <>
            <FiWifi className="w-4 h-4 text-green-500" />
            <span className="text-sm text-green-500">
              Connected {latency && `(${latency}ms)`}
            </span>
          </>
        ) : (
          <>
            <FiWifiOff className="w-4 h-4 text-red-500" />
            <span className="text-sm text-red-500">Offline</span>
          </>
        )}
      </div>
    </motion.div>
  );
};
