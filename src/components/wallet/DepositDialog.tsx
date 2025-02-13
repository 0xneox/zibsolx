import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { createRazorpayOrder } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Copy } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";

interface DepositDialogProps {
  open: boolean;
  onClose: () => void;
  isKycVerified: boolean;
}

export function DepositDialog({
  open,
  onClose,
  isKycVerified,
}: DepositDialogProps) {
  const { walletAddress } = useAuth();
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<"upi" | "card" | "sol">("sol");
  const { toast } = useToast();

  const handleDeposit = async () => {
    try {
      if (!amount || isNaN(Number(amount))) {
        throw new Error("Please enter a valid amount");
      }

      if (!isKycVerified && method !== "sol") {
        throw new Error("KYC verification required for fiat deposits");
      }

      if (method === "sol") {
        // Copy wallet address to clipboard
        await navigator.clipboard.writeText(walletAddress || "");
        toast({
          title: "Wallet Address Copied",
          description: "Send SOL to this address to deposit",
        });
        return;
      }

      // Create Razorpay order for fiat deposits
      const order = await createRazorpayOrder(Number(amount));

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "Zibsol Trading",
        description: "Deposit funds to your trading account",
        order_id: order.id,
        handler: function (response: any) {
          toast({
            title: "Deposit Successful",
            description: `Payment ID: ${response.razorpay_payment_id}`,
          });
          onClose();
        },
        prefill: {
          method: method === "upi" ? "upi" : "card",
        },
        theme: {
          color: "#6366f1",
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to process deposit",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Deposit Funds</DialogTitle>
          <DialogDescription>
            Add funds to your trading account
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue={method} onValueChange={(v) => setMethod(v as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="sol">Solana</TabsTrigger>
            <TabsTrigger value="upi" disabled={!isKycVerified}>
              UPI
            </TabsTrigger>
            <TabsTrigger value="card" disabled={!isKycVerified}>
              Card
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sol" className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Send SOL to this address:
              </p>
              <div className="flex items-center gap-2">
                <Input
                  value={walletAddress || ""}
                  readOnly
                  className="font-mono"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    navigator.clipboard.writeText(walletAddress || "")
                  }
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="upi" className="space-y-4">
            {!isKycVerified ? (
              <Alert className="bg-yellow-500/10 border-yellow-500/50">
                <AlertCircle className="h-4 w-4 text-yellow-500" />
                <AlertDescription className="text-yellow-500">
                  KYC verification required for UPI deposits
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Amount (INR)</label>
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                  />
                </div>
                <Button onClick={handleDeposit} className="w-full">
                  Proceed to Pay
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="card" className="space-y-4">
            {!isKycVerified ? (
              <Alert className="bg-yellow-500/10 border-yellow-500/50">
                <AlertCircle className="h-4 w-4 text-yellow-500" />
                <AlertDescription className="text-yellow-500">
                  KYC verification required for card deposits
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Amount (INR)</label>
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                  />
                </div>
                <Button onClick={handleDeposit} className="w-full">
                  Proceed to Pay
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
