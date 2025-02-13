import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { withdrawFunds } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export interface WithdrawDialogProps {
  open: boolean;
  onClose: () => void;
  balance: number;
}

export function WithdrawDialog({
  open,
  onClose,
  balance,
}: WithdrawDialogProps) {
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const { toast } = useToast();

  const handleWithdraw = async () => {
    try {
      if (!amount || isNaN(Number(amount))) {
        throw new Error("Please enter a valid amount");
      }

      if (Number(amount) > balance) {
        throw new Error("Insufficient balance");
      }

      if (!address) {
        throw new Error("Please enter a wallet address");
      }

      // Call withdraw function
      await withdrawFunds({
        amount: Number(amount),
        address,
        method: "sol",
      });

      toast({
        title: "Withdrawal Initiated",
        description: "Your withdrawal request has been submitted",
      });
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to process withdrawal",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Withdraw Funds</DialogTitle>
          <DialogDescription>
            Withdraw your funds to a Solana wallet
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Amount (SOL)</label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
            />
            <p className="text-sm text-muted-foreground">
              Available: {balance} SOL
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Recipient Address</label>
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter Solana wallet address"
              className="font-mono"
            />
          </div>

          {Number(amount) > balance && (
            <Alert className="bg-red-500/10 border-red-500/50">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <AlertDescription className="text-red-500">
                Insufficient balance
              </AlertDescription>
            </Alert>
          )}

          <Button
            onClick={handleWithdraw}
            className="w-full"
            disabled={!amount || !address || Number(amount) > balance}
          >
            Withdraw {amount || "0"} SOL
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
