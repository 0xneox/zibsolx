import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiArrowRight, FiCheck } from 'react-icons/fi';

interface TutorialStep {
  title: string;
  description: string;
  targetId: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

const tutorialSteps: TutorialStep[] = [
  {
    title: 'Connect Your Wallet',
    description: 'First, connect your Solana wallet to start trading.',
    targetId: 'wallet-connect-btn',
    position: 'bottom',
  },
  {
    title: 'Select Tokens',
    description: 'Choose which tokens you want to trade.',
    targetId: 'token-select',
    position: 'right',
  },
  {
    title: 'Enter Amount',
    description: 'Enter how much you want to trade.',
    targetId: 'amount-input',
    position: 'left',
  },
  {
    title: 'Review & Confirm',
    description: 'Check the details and confirm your trade.',
    targetId: 'confirm-trade-btn',
    position: 'top',
  },
];

interface TutorialOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export const TutorialOverlay: React.FC<TutorialOverlayProps> = ({
  isOpen,
  onClose,
  onComplete,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [skipped, setSkipped] = useState<number[]>([]);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    setSkipped([...skipped, currentStep]);
    handleNext();
  };

  const getStepPosition = (position: TutorialStep['position']) => {
    const target = document.getElementById(tutorialSteps[currentStep].targetId);
    if (!target) return { top: '50%', left: '50%' };

    const rect = target.getBoundingClientRect();
    switch (position) {
      case 'top':
        return { top: `${rect.top - 120}px`, left: `${rect.left + rect.width / 2}px` };
      case 'bottom':
        return { top: `${rect.bottom + 20}px`, left: `${rect.left + rect.width / 2}px` };
      case 'left':
        return { top: `${rect.top + rect.height / 2}px`, left: `${rect.left - 320}px` };
      case 'right':
        return { top: `${rect.top + rect.height / 2}px`, left: `${rect.right + 20}px` };
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Tutorial Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={getStepPosition(tutorialSteps[currentStep].position)}
            className="fixed z-50 w-80 transform -translate-x-1/2 -translate-y-1/2"
          >
            <div className="p-6 rounded-2xl bg-gray-900 border border-gray-800">
              {/* Progress */}
              <div className="flex gap-1 mb-4">
                {tutorialSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1 flex-1 rounded-full ${
                      index === currentStep
                        ? 'bg-gradient-to-r from-pink-500 to-purple-500'
                        : index < currentStep
                        ? 'bg-green-500'
                        : 'bg-gray-700'
                    }`}
                  />
                ))}
              </div>

              {/* Content */}
              <h3 className="text-lg font-bold mb-2">
                {tutorialSteps[currentStep].title}
              </h3>
              <p className="text-gray-400 mb-6">
                {tutorialSteps[currentStep].description}
              </p>

              {/* Actions */}
              <div className="flex justify-between">
                <button
                  onClick={handleSkip}
                  className="text-gray-400 hover:text-white"
                >
                  Skip
                </button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNext}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 flex items-center gap-2"
                >
                  {currentStep === tutorialSteps.length - 1 ? (
                    <>
                      Finish <FiCheck className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      Next <FiArrowRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              </div>
            </div>

            {/* Target Highlight */}
            <div
              className="absolute w-full h-full pointer-events-none"
              style={{
                boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.75)',
                borderRadius: '8px',
              }}
            />
          </motion.div>

          {/* Close Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed top-4 right-4 z-50 p-2 rounded-lg bg-gray-800 hover:bg-gray-700"
          >
            <FiX className="w-6 h-6" />
          </motion.button>
        </>
      )}
    </AnimatePresence>
  );
};
