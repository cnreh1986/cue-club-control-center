import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wallet, History, UtensilsCrossed, Plus } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useAuth } from '@/contexts/AuthContext';

const PlayerDashboard = () => {
  const { currentUser } = useAuth();
  const [players] = useLocalStorage('players', []);
  
  // Find current player data using mobile number
  const playerData = players.find((p: any) => p.mobile === currentUser?.mobile || p.phone === currentUser?.mobile) || {
    name: currentUser?.name || 'Player',
    walletBalance: 0,
    totalPlayed: 0,
    totalSpent: 0,
    mobile: currentUser?.mobile || ''
  };

  const quickActions = [
    { 
      title: 'Top-up Wallet', 
      icon: Plus, 
      color: 'bg-green-600 hover:bg-green-700',
      action: () => console.log('Top-up wallet')
    },
    { 
      title: 'View History', 
      icon: History, 
      color: 'bg-blue-600 hover:bg-blue-700',
      action: () => console.log('View history')
    },
    { 
      title: 'Order Food', 
      icon: UtensilsCrossed, 
      color: 'bg-orange-600 hover:bg-orange-700',
      action: () => console.log('Order food')
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Welcome, {playerData.name}!</h2>
        <p className="opacity-90">Your gaming dashboard</p>
        {playerData.mobile && (
          <p className="text-sm opacity-75 mt-1">Mobile: {playerData.mobile}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Wallet Balance</CardTitle>
            <Wallet className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900">₹{playerData.walletBalance || 0}</div>
            <Badge variant="secondary" className="mt-2">Available</Badge>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">Games Played</CardTitle>
            <History className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900">{playerData.sessionsCount || 0}</div>
            <p className="text-xs text-blue-600 mt-1">Total sessions</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-800">Total Spent</CardTitle>
            <UtensilsCrossed className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-900">₹{playerData.totalSpent || 0}</div>
            <p className="text-xs text-orange-600 mt-1">All time</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                onClick={action.action}
                className={`${action.color} text-white h-20 flex flex-col space-y-2`}
              >
                <action.icon className="h-6 w-6" />
                <span>{action.title}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No recent activity</p>
            <p className="text-sm">Start playing to see your history here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlayerDashboard;
