import { motion, HTMLMotionProps } from 'framer-motion';
import { animations } from '@/lib/utils/animations';
import React from 'react';

interface BaseMotionProps {
  children: React.ReactNode;
}

// Animated Page Container
export const AnimatedPage: React.FC<HTMLMotionProps<'div'> & BaseMotionProps> = ({ children, ...props }) => (
  <motion.div
    initial="initial"
    animate="enter"
    exit="exit"
    variants={animations.pageVariants}
    {...props}
  >
    {children}
  </motion.div>
);

// Animated Trading Card
export const TradingCard: React.FC<HTMLMotionProps<'div'> & BaseMotionProps> = ({ children, ...props }) => (
  <motion.div
    className="card-hover"
    whileHover={animations.cardHover}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    {...props}
  >
    {children}
  </motion.div>
);

interface ButtonMotionProps extends BaseMotionProps {
  onClick?: () => void;
}

// Animated Button
export const AnimatedButton: React.FC<HTMLMotionProps<'button'> & ButtonMotionProps> = ({ children, onClick, ...props }) => (
  <motion.button
    className="btn-hover"
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    {...props}
  >
    {children}
  </motion.button>
);

interface PriceChangeProps extends BaseMotionProps {
  value: number;
  previousValue: number;
}

// Price Change Animation
export const PriceChange: React.FC<HTMLMotionProps<'span'> & PriceChangeProps> = ({ value, previousValue, ...props }) => {
  const isIncrease = value > previousValue;
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={isIncrease ? 'price-up' : 'price-down'}
      {...props}
    >
      {value}
    </motion.span>
  );
};

interface NotificationProps extends BaseMotionProps {
  message: string;
}

// Notification Toast
export const NotificationToast: React.FC<HTMLMotionProps<'div'> & NotificationProps> = ({ message, ...props }) => (
  <motion.div
    className="chart-tooltip"
    variants={animations.notificationSlide}
    initial="initial"
    animate="animate"
    exit="exit"
    {...props}
  >
    {message}
  </motion.div>
);

export const ChartContainer: React.FC<HTMLMotionProps<'div'> & BaseMotionProps> = ({ children, ...props }) => (
  <motion.div
    variants={animations.chartVariants}
    initial="initial"
    animate="animate"
    className="w-full h-[400px] rounded-lg overflow-hidden"
    {...props}
  >
    {children}
  </motion.div>
);

interface TokenListItemProps extends BaseMotionProps {
  index: number;
}

// Token List Item
export const TokenListItem: React.FC<HTMLMotionProps<'li'> & TokenListItemProps> = ({ children, index, ...props }) => (
  <motion.li
    variants={animations.tokenItem}
    initial="initial"
    animate="animate"
    whileHover="hover"
    custom={index}
    className="touch-feedback mobile-press"
    {...props}
  >
    {children}
  </motion.li>
);

// Loading Skeleton
export const LoadingSkeleton: React.FC<HTMLMotionProps<'div'>> = (props) => (
  <motion.div
    className="w-full h-full rounded-lg bg-primary-100/10"
    animate={{
      opacity: [0.6, 1, 0.6],
      scale: [0.98, 1, 0.98],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        repeatType: "mirror"
      }
    }}
    {...props}
  />
);

interface MenuItemProps extends BaseMotionProps {
  isActive: boolean;
}

// Menu Item
export const MenuItem: React.FC<HTMLMotionProps<'div'> & MenuItemProps> = ({ children, isActive, ...props }) => (
  <motion.div
    className="nav-link"
    whileHover={{ x: 5 }}
    animate={isActive ? { x: 5 } : { x: 0 }}
    {...props}
  >
    {children}
  </motion.div>
);
