import React from 'react';

export function Balance() {
  return (
    <div className="rounded-2xl bg-gray-800/20 p-6">
      <div className="space-y-4">
        {/* Balance Header */}
        <div>
          <div className="text-sm text-gray-400">Total balance</div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-2xl font-semibold">$0.00</span>
            <div className="flex items-center text-xs text-gray-400">
              <span className="text-green-400">▲ 0%</span>
              <span className="ml-1">All time</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-4">
          <button className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-pink-500 flex items-center justify-center mb-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 6V18M6 12H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="text-sm">Deposit</span>
          </button>

          <button className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-pink-500 flex items-center justify-center mb-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="text-sm">Send</span>
          </button>

          <button className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-pink-500 flex items-center justify-center mb-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 12H5M5 12L11 18M5 12L11 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="text-sm">Withdraw</span>
          </button>
        </div>

        {/* Cash Balance */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
          <div className="flex items-center gap-2">
            <span className="text-gray-400">Cash</span>
            <span className="text-sm text-gray-400">*</span>
          </div>
          <div className="flex items-center gap-2">
            <span>$0.00</span>
            <button className="w-6 h-6 rounded-full bg-pink-500 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 6V18M6 12H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Moonshots Balance */}
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Moonshots</span>
          <span>$0.00</span>
        </div>
      </div>
    </div>
  );
}
