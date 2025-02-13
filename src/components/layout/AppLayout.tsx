import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHome, FiTrendingUp, FiClock, FiBriefcase, FiMenu, FiX, FiDollarSign } from 'react-icons/fi';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { QuickTrade } from '../swap/QuickTrade';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: FiHome },
    { path: '/tokens', label: 'Tokens', icon: FiDollarSign },
    { path: '/trending', label: 'Trending', icon: FiTrendingUp },
    { path: '/history', label: 'History', icon: FiClock },
    { path: '/portfolio', label: 'Portfolio', icon: FiBriefcase },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="relative min-h-screen bg-[#0B0E16] text-white">
      {/* Animated background */}
      <div className="fixed inset-0 bg-gradient-to-br from-pink-500/5 via-purple-500/5 to-blue-500/5 animate-gradient-shift" />

      {/* Desktop Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <motion.img
                  whileHover={{ scale: 1.1 }}
                  src="/logo.svg"
                  alt="Logo"
                  className="w-8 h-8"
                />
                <span className="ml-2 text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                  ZibsolX
                </span>
              </Link>
              <div className="hidden md:block ml-10">
                <div className="flex items-center space-x-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
                        isActive(item.path)
                          ? 'bg-gray-800 text-white'
                          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      }`}
                    >
                      <item.icon className="w-4 h-4 mr-2" />
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Right side buttons */}
            <div className="flex items-center">
              <WalletMultiButton className="!bg-gradient-to-r from-pink-500 to-purple-500 !rounded-xl" />
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden ml-4 p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800"
              >
                {isMobileMenuOpen ? (
                  <FiX className="w-6 h-6" />
                ) : (
                  <FiMenu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-16 z-40 md:hidden bg-gray-900 border-b border-gray-800"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center px-3 py-2 rounded-lg text-base font-medium ${
                    isActive(item.path)
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-[1fr,400px] gap-8">
            <main className="min-h-[calc(100vh-8rem)]">{children}</main>
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <QuickTrade />
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};
