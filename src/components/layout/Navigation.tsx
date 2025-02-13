import React from 'react';
import { useRouter } from 'next/router';
import { Button } from '../ui/button';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Rocket, 
  TrendingUp, 
  Clock, 
  Coins,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Navigation = () => {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const tabs = [
    {
      value: 'trending',
      label: 'Trending',
      icon: <TrendingUp className="w-4 h-4" />,
      href: '/trending'
    },
    {
      value: 'new',
      label: 'New Listings',
      icon: <Clock className="w-4 h-4" />,
      href: '/new'
    },
    {
      value: 'gainers',
      label: 'Top Gainers',
      icon: <Rocket className="w-4 h-4" />,
      href: '/gainers'
    },
    {
      value: 'all',
      label: 'All Tokens',
      icon: <Coins className="w-4 h-4" />,
      href: '/tokens'
    }
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden md:block">
        <Tabs defaultValue={router.pathname.slice(1) || 'trending'} className="w-full">
          <TabsList className="grid grid-cols-4 h-14 items-center bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                onClick={() => router.push(tab.href)}
                className={cn(
                  "data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900",
                  "data-[state=active]:shadow-sm",
                  "h-12 rounded-lg",
                  "transition-all",
                  "flex items-center gap-2"
                )}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <div className="flex items-center justify-between p-4">
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-50">
            <nav className="flex flex-col p-4 space-y-2">
              {tabs.map((tab) => (
                <Button
                  key={tab.value}
                  variant="ghost"
                  className={cn(
                    "justify-start gap-2",
                    router.pathname === tab.href && "bg-gray-100 dark:bg-gray-800"
                  )}
                  onClick={() => {
                    router.push(tab.href);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  {tab.icon}
                  {tab.label}
                </Button>
              ))}
            </nav>
          </div>
        )}
      </div>
    </>
  );
};

export default Navigation;
