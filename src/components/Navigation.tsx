
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Navigation = ({ activeTab, setActiveTab }: NavigationProps) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'tables', label: 'Tables', icon: '🎱' },
    { id: 'players', label: 'Players', icon: '👥' },
    { id: 'menu', label: 'Menu', icon: '🍽️' },
    { id: 'payments', label: 'Payments', icon: '💳' },
    { id: 'expenses', label: 'Expenses', icon: '📝' },
  ];

  return (
    <div className="flex flex-wrap gap-2 p-4 bg-white rounded-lg shadow-sm border">
      {tabs.map((tab) => (
        <Button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          variant={activeTab === tab.id ? "default" : "outline"}
          className={cn(
            "flex items-center space-x-2 transition-all duration-200",
            activeTab === tab.id 
              ? "bg-green-600 hover:bg-green-700 text-white shadow-md" 
              : "hover:bg-green-50 hover:text-green-700 hover:border-green-300"
          )}
        >
          <span>{tab.icon}</span>
          <span>{tab.label}</span>
        </Button>
      ))}
    </div>
  );
};

export default Navigation;
