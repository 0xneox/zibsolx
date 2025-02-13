export const TRADING_FEES = {
  // Trading fees in percentage
  MAKER_FEE: 0.1, // 0.1% for maker orders
  TAKER_FEE: 0.2, // 0.2% for taker orders
  
  // Fiat transaction fees
  FIAT_DEPOSIT_FEE: 1.5, // 1.5% for fiat deposits
  FIAT_WITHDRAWAL_FEE: 1.5, // 1.5% for fiat withdrawals
  
  // Crypto withdrawal fees (in the respective token)
  WITHDRAWAL_FEES: {
    SOL: 0.01, // 0.01 SOL per withdrawal
    USDC: 1, // 1 USDC per withdrawal
    USDT: 1, // 1 USDT per withdrawal
  },
  
  // Minimum trade amounts
  MIN_TRADE_AMOUNT: {
    SOL: 0.1, // Minimum 0.1 SOL per trade
    USDC: 10, // Minimum 10 USDC per trade
    USDT: 10, // Minimum 10 USDT per trade
  },
  
  // KYC Limits
  KYC_LIMITS: {
    UNVERIFIED: {
      DAILY_WITHDRAWAL: 1000, // $1,000 per day
      MONTHLY_WITHDRAWAL: 10000, // $10,000 per month
      FIAT_DISABLED: true, // Fiat transactions disabled
    },
    VERIFIED: {
      DAILY_WITHDRAWAL: 50000, // $50,000 per day
      MONTHLY_WITHDRAWAL: 1000000, // $1,000,000 per month
      FIAT_DISABLED: false, // Fiat transactions enabled
    },
  },
};

// Fee calculation functions
export function calculateTradingFee(amount: number, isMaker: boolean): number {
  const feePercentage = isMaker ? TRADING_FEES.MAKER_FEE : TRADING_FEES.TAKER_FEE;
  return (amount * feePercentage) / 100;
}

export function calculateFiatFee(amount: number, isDeposit: boolean): number {
  const feePercentage = isDeposit
    ? TRADING_FEES.FIAT_DEPOSIT_FEE
    : TRADING_FEES.FIAT_WITHDRAWAL_FEE;
  return (amount * feePercentage) / 100;
}

// Check if user can perform fiat transaction
export function canPerformFiatTransaction(
  isKycVerified: boolean,
  amount: number,
  dailyTotal: number,
  monthlyTotal: number
): {
  allowed: boolean;
  reason?: string;
} {
  const limits = isKycVerified
    ? TRADING_FEES.KYC_LIMITS.VERIFIED
    : TRADING_FEES.KYC_LIMITS.UNVERIFIED;

  if (!isKycVerified && limits.FIAT_DISABLED) {
    return {
      allowed: false,
      reason: "KYC verification required for fiat transactions",
    };
  }

  if (dailyTotal + amount > limits.DAILY_WITHDRAWAL) {
    return {
      allowed: false,
      reason: "Daily withdrawal limit exceeded",
    };
  }

  if (monthlyTotal + amount > limits.MONTHLY_WITHDRAWAL) {
    return {
      allowed: false,
      reason: "Monthly withdrawal limit exceeded",
    };
  }

  return { allowed: true };
}

// Check if trade amount meets minimum requirements
export function meetsMinimumTradeAmount(
  token: keyof typeof TRADING_FEES.MIN_TRADE_AMOUNT,
  amount: number
): boolean {
  return amount >= TRADING_FEES.MIN_TRADE_AMOUNT[token];
}
