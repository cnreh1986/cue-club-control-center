
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Navigation = ({ activeTab, setActiveTab }: NavigationProps) => {
  const { currentUser, logout, hasAccess } = useAuth();
  const navigate = useNavigate();

  const allTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', roles: ['owner'] },
    { id: 'tables', label: 'Tables', icon: '🎱', roles: ['owner', 'staff'] },
    { id: 'players', label: 'Players', icon: '👥', roles: ['owner', 'staff'] },
    { id: 'menu', label: 'Menu', icon: '🍽️', roles: ['owner', 'staff'] },
    { id: 'payments', label: 'Payments', icon: '💳', roles: ['owner', 'staff'] },
    { id: 'inventory', label: 'Inventory', icon: '📦', roles: ['staff'] },
    { id: 'expenses', label: 'Expenses', icon: '📝', roles: ['owner'] },
    { id: 'reports', label: 'Reports', icon: '📈', roles: ['owner'] },
    { id: 'admin-settings', label: 'Settings', icon: '⚙️', roles: ['owner'] },
    { id: 'my-wallet', label: 'My Wallet', icon: '💰', roles: ['player'] },
    { id: 'play-history', label: 'Play History', icon: '🎮', roles: ['player'] },
    { id: 'food-orders', label: 'Food Orders', icon: '🍕', roles: ['player'] },
  ];

  // Filter tabs based on user role
  const visibleTabs = allTabs.filter(tab => hasAccess(tab.id));

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner': return 'bg-purple-100 text-purple-800';
      case 'staff': return 'bg-blue-100 text-blue-800';
      case 'player': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Logged in as:</span>
            <Badge className={getRoleColor(currentUser?.role || '')}>
              {currentUser?.name} ({currentUser?.role})
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            onClick={handleBackToHome}
            variant="outline"
            size="sm"
            className="flex items-center space-x-2"
          >
            <Home className="h-4 w-4" />
            <span>Back to Home</span>
          </Button>
          
          <Button
            onClick={logout}
            variant="outline"
            size="sm"
            className="flex items-center space-x-2"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 p-4 bg-white rounded-lg shadow-sm border">
        {visibleTabs.map((tab) => (
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
    </div>
  );
};

export default Navigation;
