import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, TrendingUp, Clock, DollarSign } from "lucide-react";

interface ChainSelectorProps {
  selectedView: "trending" | "new" | "all" | "gainers";
  onSelect: (view: "trending" | "new" | "all" | "gainers") => void;
}

export function ChainSelector({ selectedView, onSelect }: ChainSelectorProps) {
  return (
    <Tabs
      value={selectedView}
      onValueChange={(value: any) => onSelect(value)}
      className="w-full"
    >
      <TabsList className="grid grid-cols-4 w-full max-w-[600px]">
        <TabsTrigger value="trending" className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          Trending
        </TabsTrigger>
        <TabsTrigger value="new" className="flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          New
        </TabsTrigger>
        <TabsTrigger value="gainers" className="flex items-center gap-2">
          <DollarSign className="w-4 h-4" />
          Top Gainers
        </TabsTrigger>
        <TabsTrigger value="all" className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          All Tokens
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
