import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedLogoProps {
  className?: string;
}

const AnimatedLogo = ({ className }: AnimatedLogoProps) => {
  return (
    <div className={className}>
      <motion.svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        initial="hidden"
        animate="visible"
      >
        {/* Background Circle */}
        <motion.circle
          cx="20"
          cy="20"
          r="20"
          className="fill-purple-500/10"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />

        {/* Z */}
        <motion.path
          d="M12 12H28M12 28H28M28 12L12 28"
          stroke="url(#gradient)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeInOut", delay: 0.5 }}
        />

        {/* Gradient Definition */}
        <defs>
          <linearGradient id="gradient" x1="12" y1="12" x2="28" y2="28">
            <stop stopColor="#818CF8" />
            <stop offset="1" stopColor="#C084FC" />
          </linearGradient>
        </defs>
      </motion.svg>
    </div>
  );
};

export default AnimatedLogo;
