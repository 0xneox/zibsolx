import { animate, spring } from 'framer-motion';

export const animations = {
  // Page Transitions
  pageVariants: {
    initial: { opacity: 0, y: 20 },
    enter: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: [0.61, 1, 0.88, 1] }
    },
    exit: { 
      opacity: 0, 
      y: 20,
      transition: { duration: 0.3, ease: [0.61, 1, 0.88, 1] }
    }
  },

  // Trading Chart Animations
  chartVariants: {
    initial: { opacity: 0, scale: 0.97 },
    enter: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: [0.61, 1, 0.88, 1] }
    },
    update: {
      scale: [1, 1.02, 1],
      transition: { duration: 0.3 }
    }
  },

  // Button Hover Effects
  buttonHover: {
    scale: 1.02,
    transition: { duration: 0.2 }
  },

  // Price Change Flash
  priceFlash: (isIncrease: boolean) => ({
    backgroundColor: isIncrease ? 'rgba(0, 255, 0, 0.1)' : 'rgba(255, 0, 0, 0.1)',
    transition: { duration: 0.3 }
  }),

  // Success Animation
  success: {
    scale: [1, 1.2, 1],
    rotate: [0, 360, 360],
    transition: { duration: 0.5 }
  },

  // Card Hover
  cardHover: {
    y: -5,
    boxShadow: '0 20px 25px -5px rgba(0, 102, 255, 0.1), 0 10px 10px -5px rgba(0, 102, 255, 0.04)',
    transition: { duration: 0.2 }
  },

  // Mobile Gestures
  swipeTransition: {
    x: [-20, 0],
    opacity: [0, 1],
    transition: { duration: 0.3 }
  },

  // Loading States
  loadingPulse: {
    opacity: [0.6, 1, 0.6],
    scale: [0.98, 1, 0.98],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      repeatType: "mirror"
    }
  } as const,

  // Notification Slide
  notificationSlide: {
    initial: { x: 100, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 100, opacity: 0 },
    transition: { type: "spring", stiffness: 100, damping: 15 }
  },

  // Menu Expansion
  menuExpand: {
    enter: {
      opacity: 1,
      height: "auto",
      transition: { duration: 0.3, ease: "easeOut" }
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: { duration: 0.2, ease: "easeIn" }
    }
  },

  // Token List Item
  tokenItem: {
    initial: { opacity: 0, x: -20 },
    animate: (index: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: index * 0.05 }
    }),
    hover: {
      backgroundColor: "rgba(0, 102, 255, 0.05)",
      x: 5,
      transition: { duration: 0.2 }
    }
  }
};
