import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Wallet, Plus, ArrowDownUp } from "lucide-react";
import { useState } from "react";
import { DepositDialog } from "./DepositDialog";
import { WithdrawDialog } from "./WithdrawDialog";

interface WalletHeaderProps {
  balance: number;
  onDeposit: () => void;
  onWithdraw: () => void;
}

export function WalletHeader({
  balance,
  onDeposit,
  onWithdraw,
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
              <p className="text-2xl font-bold">₹{balance.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              className="bg-white/10 hover:bg-white/20 text-white"
              onClick={() => setDepositOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Deposit
            </Button>
            <Button
              variant="secondary"
              className="bg-white/10 hover:bg-white/20 text-white"
              onClick={() => setWithdrawOpen(true)}
            >
              <ArrowDownUp className="w-4 h-4 mr-2" />
              Withdraw
            </Button>
          </div>
        </div>
      </Card>

      <DepositDialog
        open={depositOpen}
        onClose={() => setDepositOpen(false)}
        onDeposit={onDeposit}
      />
      <WithdrawDialog
        open={withdrawOpen}
        onClose={() => setWithdrawOpen(false)}
        onWithdraw={onWithdraw}
      />
    </>
  );
}
