import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Bell, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface PriceAlert {
  id: string;
  tokenAddress: string;
  tokenSymbol: string;
  targetPrice: number;
  condition: "above" | "below";
  createdAt: Date;
}

export function PriceAlerts() {
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [newAlert, setNewAlert] = useState({
    tokenSymbol: "",
    targetPrice: "",
    condition: "above" as "above" | "below",
  });
  const { toast } = useToast();

  useEffect(() => {
    // Load alerts from localStorage
    const savedAlerts = localStorage.getItem("priceAlerts");
    if (savedAlerts) {
      setAlerts(JSON.parse(savedAlerts));
    }
  }, []);

  const saveAlerts = (newAlerts: PriceAlert[]) => {
    localStorage.setItem("priceAlerts", JSON.stringify(newAlerts));
    setAlerts(newAlerts);
  };

  const addAlert = () => {
    if (!newAlert.tokenSymbol || !newAlert.targetPrice) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const alert: PriceAlert = {
      id: Date.now().toString(),
      tokenAddress: "", // Will be filled when implementing token search
      tokenSymbol: newAlert.tokenSymbol,
      targetPrice: parseFloat(newAlert.targetPrice),
      condition: newAlert.condition,
      createdAt: new Date(),
    };

    saveAlerts([...alerts, alert]);
    setNewAlert({ tokenSymbol: "", targetPrice: "", condition: "above" });
    
    toast({
      title: "Alert Created",
      description: `You will be notified when ${alert.tokenSymbol} goes ${alert.condition} $${alert.targetPrice}`,
    });
  };

  const removeAlert = (id: string) => {
    saveAlerts(alerts.filter((alert) => alert.id !== id));
  };

  return (
    <Card className="p-4">
      <h2 className="text-xl font-bold mb-4">Price Alerts</h2>
      
      <div className="flex gap-2 mb-4">
        <Input
          placeholder="Token Symbol (e.g., SOL)"
          value={newAlert.tokenSymbol}
          onChange={(e) => setNewAlert({ ...newAlert, tokenSymbol: e.target.value })}
        />
        <Input
          type="number"
          placeholder="Target Price"
          value={newAlert.targetPrice}
          onChange={(e) => setNewAlert({ ...newAlert, targetPrice: e.target.value })}
        />
        <select
          className="border rounded px-3 py-2 bg-background"
          value={newAlert.condition}
          onChange={(e) => setNewAlert({ ...newAlert, condition: e.target.value as "above" | "below" })}
        >
          <option value="above">Above</option>
          <option value="below">Below</option>
        </select>
        <Button onClick={addAlert}>
          <Bell className="w-4 h-4 mr-2" />
          Add Alert
        </Button>
      </div>

      <div className="space-y-2">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="flex items-center justify-between p-2 border rounded hover:bg-muted/50"
          >
            <div className="flex items-center gap-2">
              <Badge variant={alert.condition === "above" ? "default" : "destructive"}>
                {alert.condition === "above" ? "↑" : "↓"}
              </Badge>
              <span className="font-medium">{alert.tokenSymbol}</span>
              <span className="text-muted-foreground">
                {alert.condition} ${alert.targetPrice}
              </span>
            </div>
            <Button variant="ghost" size="icon" onClick={() => removeAlert(alert.id)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
}
