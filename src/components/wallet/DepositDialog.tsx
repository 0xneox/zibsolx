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
import { createRazorpayOrder } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

interface DepositDialogProps {
  open: boolean;
  onClose: () => void;
  onDeposit: () => void;
}

export function DepositDialog({
  open,
  onClose,
  onDeposit,
}: DepositDialogProps) {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<"upi" | "card" | "sol">("upi");
  const { toast } = useToast();

  const handleDeposit = async () => {
    try {
      if (!amount || isNaN(Number(amount))) {
        toast({
          title: "Invalid amount",
          description: "Please enter a valid amount",
          variant: "destructive",
        });
        return;
      }

      const order = await createRazorpayOrder(Number(amount));

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "Solana Memecoin Market",
        description: "Deposit funds",
        order_id: order.id,
        handler: function (response: any) {
          toast({
            title: "Success!",
            description: "Funds will be credited shortly",
          });
          onDeposit();
          onClose();
        },
        prefill: {
          name: "User",
          email: "user@example.com",
        },
        theme: {
          color: "#6366f1",
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process deposit",
        variant: "destructive",
      });
    }
  };

  const quickAmounts = [1000, 5000, 10000, 50000];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Deposit Funds</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Tabs value={method} onValueChange={(value: any) => setMethod(value)}>
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="upi">UPI</TabsTrigger>
              <TabsTrigger value="card">Card</TabsTrigger>
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

          <div className="grid grid-cols-4 gap-2">
            {quickAmounts.map((amt) => (
              <Button
                key={amt}
                variant="outline"
                onClick={() => setAmount(amt.toString())}
              >
                ₹{amt.toLocaleString()}
              </Button>
            ))}
          </div>

          <Button className="w-full" onClick={handleDeposit}>
            Deposit ₹{Number(amount).toLocaleString() || "0"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
