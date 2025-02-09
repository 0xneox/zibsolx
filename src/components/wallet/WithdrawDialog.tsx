import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { withdrawFunds } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

interface WithdrawDialogProps {
  open: boolean;
  onClose: () => void;
  onWithdraw: () => void;
}

export function WithdrawDialog({
  open,
  onClose,
  onWithdraw,
}: WithdrawDialogProps) {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<"bank" | "upi" | "sol">("bank");
  const [details, setDetails] = useState("");
  const { toast } = useToast();

  const handleWithdraw = async () => {
    try {
      if (!amount || isNaN(Number(amount))) {
        toast({
          title: "Invalid amount",
          description: "Please enter a valid amount",
          variant: "destructive",
        });
        return;
      }

      if (!details) {
        toast({
          title: "Missing details",
          description:
            method === "bank"
              ? "Please enter bank details"
              : "Please enter UPI ID",
          variant: "destructive",
        });
        return;
      }

      await withdrawFunds(Number(amount), method, details);

      toast({
        title: "Withdrawal initiated",
        description: "Your funds will be transferred shortly",
      });

      onWithdraw();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process withdrawal",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Withdraw Funds</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Tabs value={method} onValueChange={(value: any) => setMethod(value)}>
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="bank">Bank</TabsTrigger>
              <TabsTrigger value="upi">UPI</TabsTrigger>
              <TabsTrigger value="sol">Solana</TabsTrigger>
            </TabsList>
          </Tabs>

          <div>
            <p className="text-sm text-muted-foreground mb-2">Amount (INR)</p>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
            />
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-2">
              {method === "bank"
                ? "Bank Details"
                : method === "upi"
                  ? "UPI ID"
                  : "Solana Address"}
            </p>
            <Input
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder={
                method === "bank"
                  ? "Enter account details"
                  : method === "upi"
                    ? "Enter UPI ID"
                    : "Enter Solana address"
              }
            />
          </div>

          <Button className="w-full" onClick={handleWithdraw}>
            Withdraw ₹{Number(amount).toLocaleString() || "0"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
