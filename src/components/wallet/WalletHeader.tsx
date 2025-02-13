import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Wallet, Plus, ArrowDownUp, AlertCircle } from "lucide-react";
import { useState } from "react";
import { DepositDialog } from "./DepositDialog";
import { WithdrawDialog } from "./WithdrawDialog";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface WalletHeaderProps {
  balance: number;
  isKycVerified: boolean;
  onConnectWallet: () => Promise<void>;
}

export function WalletHeader({
  balance,
  isKycVerified,
  onConnectWallet,
}: WalletHeaderProps) {
  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);

  return (
    <>
      <Card className="p-6 bg-gradient-to-r from-purple-900 to-indigo-900 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Wallet className="w-8 h-8" />
            <div>
              <p className="text-sm text-white/70">Available Balance</p>
              <p className="text-2xl font-bold">{balance} SOL</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {balance === 0 ? (
              <Button
                onClick={onConnectWallet}
                variant="secondary"
                className="bg-white/10 hover:bg-white/20"
              >
                Connect Wallet
              </Button>
            ) : (
              <>
                <Button
                  onClick={() => setDepositOpen(true)}
                  variant="secondary"
                  className="bg-white/10 hover:bg-white/20"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Deposit
                </Button>
                <Button
                  onClick={() => setWithdrawOpen(true)}
                  variant="secondary"
                  className="bg-white/10 hover:bg-white/20"
                >
                  <ArrowDownUp className="w-4 h-4 mr-2" />
                  Withdraw
                </Button>
              </>
            )}
          </div>
        </div>
        {!isKycVerified && (
          <Alert className="mt-4 bg-yellow-500/10 border-yellow-500/50">
            <AlertCircle className="h-4 w-4 text-yellow-500" />
            <AlertDescription className="text-yellow-500">
              Complete KYC verification to enable fiat deposits and withdrawals
            </AlertDescription>
          </Alert>
        )}
      </Card>

      <DepositDialog
        open={depositOpen}
        onClose={() => setDepositOpen(false)}
        isKycVerified={isKycVerified}
      />
      <WithdrawDialog
        open={withdrawOpen}
        onClose={() => setWithdrawOpen(false)}
        balance={balance}
      />
    </>
  );
}
