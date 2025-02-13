import React, { useEffect, useState } from 'react';
import { Balance } from '@/components/home/Balance';
import { TopGainers } from '@/components/home/TopGainers';
import { Trending } from '@/components/home/Trending';
import { Logo } from '@/components/ui/logo';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { TokenDetail } from '@/components/tokens/TokenDetail';

// Particle effect component
const ParticleEffect = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="particle-container">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="particle"
            initial={{ 
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: 0,
              opacity: 0 
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: [0, 1, 0],
              opacity: [0, 0.5, 0]
            }}
            transition={{
              duration: Math.random() * 5 + 3,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              position: 'absolute',
              width: '2px',
              height: '2px',
              background: 'radial-gradient(circle, rgba(236, 72, 153, 0.5) 0%, rgba(139, 92, 246, 0.5) 100%)',
              borderRadius: '50%',
              filter: 'blur(1px)'
            }}
          />
        ))}
      </div>
    </div>
  );
};

export function Home() {
  const controls = useAnimation();
  const [selectedToken, setSelectedToken] = useState(null);
  const [showTokenDetail, setShowTokenDetail] = useState(false);
  
  useEffect(() => {
    controls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    });
  }, [controls]);

  return (
    <div className="min-h-screen bg-[#0B0E16] text-white relative">
      <ParticleEffect />
      
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-purple-500/5 to-blue-500/5 animate-gradient-shift pointer-events-none" />

      {/* Top Navigation */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 backdrop-blur-xl bg-[#0B0E16]/80 border-b border-gray-800/50"
        style={{
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div className="flex items-center h-16 px-4">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2"
          >
            <Logo className="w-8 h-8" />
          </motion.div>

          {/* Search with Token Suggestions */}
          <div className="flex-1 mx-4">
            <div className="relative max-w-md mx-auto group">
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="text"
                placeholder="Search by name or paste address"
                className="input-modern w-full h-10 pl-10 pr-4 text-sm transition-all duration-300 border border-transparent focus:border-pink-500/30 focus:ring-2 focus:ring-pink-500/20"
              />
              <motion.img
                whileHover={{ scale: 1.1, rotate: 15 }}
                transition={{ type: "spring", stiffness: 400 }}
                src="/icons/search.svg"
                alt="Search"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity"
              />
              
              {/* Animated search suggestions */}
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute w-full mt-2 p-2 rounded-xl glass-card border border-gray-800/50 hidden group-focus-within:block"
                >
                  {['BTC', 'ETH', 'SOL'].map((token, i) => (
                    <motion.div
                      key={token}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="p-2 hover:bg-white/5 rounded-lg cursor-pointer transition-colors"
                    >
                      {token}
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Network Selector & Settings */}
          <div className="flex items-center gap-3">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg glass-card hover-glow"
            >
              <img src="/icons/ethereum.svg" alt="ETH" className="w-4 h-4" />
              <span className="text-sm">Ethereum</span>
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-800/50"
            >
              <img src="/icons/settings.svg" alt="Settings" className="w-4 h-4 opacity-50" />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 relative">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={controls}
          className="lg:grid lg:grid-cols-12 lg:gap-6"
        >
          {/* Left Column */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3 mb-6 lg:mb-0 space-y-4"
          >
            <Balance />
            
            {/* Quick Trade Card */}
            <motion.div 
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{ type: "spring", stiffness: 400 }}
              className="rounded-2xl glass-card p-6 hover-glow relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)',
                boxShadow: '0 8px 32px rgba(236, 72, 153, 0.1)'
              }}
            >
              {/* Animated background elements */}
              <div className="absolute inset-0 opacity-30">
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="absolute -right-20 -top-20 w-40 h-40 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full blur-3xl"
                />
              </div>

              <h2 className="text-lg font-medium mb-3">Quick Trade</h2>
              <div className="space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="0.00"
                    className="input-modern w-full h-12 pl-4 pr-24 text-lg"
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 glass-card rounded-lg text-sm">
                    USD
                  </button>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-primary w-full h-12 rounded-lg font-medium"
                >
                  Buy Instantly
                </motion.button>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>Fee: 0.5%</span>
                  <span>Min: $10</span>
                </div>
              </div>
            </motion.div>

            {/* Safety Notice */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-2xl glass-card p-4"
              style={{
                background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(251, 113, 133, 0.1) 100%)'
              }}
            >
              <div className="flex items-start gap-3">
                <span className="text-yellow-500 text-lg">⚠️</span>
                <p className="text-sm text-yellow-500/90">
                  Always verify token addresses. Check our security guide before trading.
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Middle Column */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-6 space-y-6"
          >
            {/* Market Overview */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: '24h Volume', value: '$1.2M', change: 12.5 },
                { label: 'Active Traders', value: '2.5K', change: 8.3 },
                { label: 'Avg. Trade Size', value: '$420', timeframe: 'Last 24h' }
              ].map((stat, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ scale: 1.02 }}
                  className="rounded-2xl glass-card p-4 hover-glow cursor-pointer"
                >
                  <div className="text-sm text-gray-400">{stat.label}</div>
                  <div className="text-lg font-medium mt-1 shimmer">{stat.value}</div>
                  {stat.change ? (
                    <div className="text-xs text-green-400 mt-1 price-up">↑ {stat.change}%</div>
                  ) : (
                    <div className="text-xs text-gray-400 mt-1">{stat.timeframe}</div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Top Gainers with clickable tokens */}
            <div className="rounded-2xl glass-card p-6">
              <h2 className="text-lg font-medium mb-4">🚀 Top Gainers</h2>
              <div className="space-y-4">
                {[
                  { name: 'PEPE', symbol: 'PEPE', price: 0.00001234, change: 125.5, logo: '/icons/pepe.svg' },
                  { name: 'WOJAK', symbol: 'WOJAK', price: 0.0000789, change: 85.3, logo: '/icons/wojak.svg' },
                  { name: 'DOGE', symbol: 'DOGE', price: 0.15, change: 45.2, logo: '/icons/doge.svg' }
                ].map((token, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setSelectedToken({
                        ...token,
                        marketCap: '$16.5B',
                        volume: '$284M',
                        holders: '639K',
                        supply: '1.0B',
                        created: '26d 11h ago',
                        priceChange: token.change
                      });
                      setShowTokenDetail(true);
                    }}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <img src={token.logo} alt={token.name} className="w-8 h-8 rounded-full" />
                      <div>
                        <div className="font-medium">{token.symbol}</div>
                        <div className="text-sm text-gray-400">${token.price}</div>
                      </div>
                    </div>
                    <div className="text-green-400">+{token.change}%</div>
                  </motion.div>
                ))}
              </div>
            </div>

            <Trending />

            {/* Education Section */}
            <motion.div 
              whileHover={{ scale: 1.01 }}
              className="rounded-2xl glass-card p-6 hover-glow"
              style={{
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)'
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-medium">New to Trading?</h2>
                  <p className="text-sm text-gray-300 mt-1">Learn the basics in 5 minutes</p>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 glass-card rounded-lg text-blue-400 text-sm"
                >
                  Start Learning →
                </motion.button>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4">
                {[1, 2, 3].map((step) => (
                  <motion.div 
                    key={step}
                    whileHover={{ scale: 1.05 }}
                    className="text-center"
                  >
                    <div className="w-10 h-10 mx-auto mb-2 rounded-full glass-card flex items-center justify-center">
                      {step}
                    </div>
                    <div className="text-xs">
                      {step === 1 ? 'Connect Wallet' : 
                       step === 2 ? 'Fund Account' : 'Start Trading'}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden lg:block lg:col-span-3"
          >
            <div className="sticky top-24 space-y-4">
              {/* Portfolio Summary */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="rounded-2xl glass-card p-6 hover-glow"
              >
                <h2 className="text-lg font-medium mb-4">Your Portfolio</h2>
                <div className="text-center py-6">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-primary w-full px-6 py-3 rounded-lg font-medium"
                  >
                    Connect Wallet
                  </motion.button>
                  <p className="text-sm text-gray-400 mt-3">
                    Track your trades and portfolio growth
                  </p>
                </div>
              </motion.div>

              {/* Live Activity Feed */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="rounded-2xl glass-card p-6 hover-glow"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium">Live Trades</h2>
                  <span className="px-2 py-1 rounded-full glass-card text-green-400 text-xs pulse">Live</span>
                </div>
                <div className="space-y-3">
                  {[
                    { type: 'Buy', token: 'PEPE', amount: '$1.2K' },
                    { type: 'Sell', token: 'WOJAK', amount: '$450' },
                    { type: 'Buy', token: 'DOGE', amount: '$2.5K' }
                  ].map((trade, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <span className={trade.type === 'Buy' ? 'text-green-400' : 'text-red-400'}>
                          {trade.type}
                        </span>
                        <span>{trade.token}</span>
                      </div>
                      <div className="text-gray-400">{trade.amount}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Mobile Navigation */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-0 left-0 right-0 lg:hidden border-t border-gray-800/50 bg-[#0B0E16]/90 backdrop-blur-xl"
        style={{
          boxShadow: '0 -4px 30px rgba(0, 0, 0, 0.2)'
        }}
      >
        <div className="flex justify-around py-4 px-8">
          <motion.button 
            whileTap={{ scale: 0.95 }}
            className="flex flex-col items-center gap-1"
          >
            <img src="/icons/home.svg" alt="Home" className="w-6 h-6" />
            <span className="text-[10px] text-pink-500">Home</span>
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex flex-col items-center"
          >
            <div className="w-14 h-14 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center -mt-8 shadow-lg shadow-pink-500/20">
              <span className="text-xl">+</span>
            </div>
            <span className="text-[10px] text-gray-400 mt-1">Trade</span>
          </motion.button>
          <motion.button 
            whileTap={{ scale: 0.95 }}
            className="flex flex-col items-center gap-1"
          >
            <img src="/icons/wallet.svg" alt="Portfolio" className="w-6 h-6 opacity-50" />
            <span className="text-[10px] text-gray-400">Portfolio</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Token Detail Modal */}
      <TokenDetail
        isOpen={showTokenDetail}
        onClose={() => setShowTokenDetail(false)}
        token={selectedToken}
      />
    </div>
  );
}
