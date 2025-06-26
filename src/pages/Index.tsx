
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Users, Calendar, TrendingUp } from 'lucide-react';
import Navigation from '@/components/Navigation';
import TableManagement from '@/components/TableManagement';
import PlayerManagement from '@/components/PlayerManagement';
import MenuManagement from '@/components/MenuManagement';
import PaymentInterface from '@/components/PaymentInterface';
import ExpenseTracker from '@/components/ExpenseTracker';
import PlayerDashboard from '@/components/PlayerDashboard';
import AdminSettings from '@/components/AdminSettings';
import Reports from '@/components/Reports';
import Inventory from '@/components/Inventory';
import LoginScreen from '@/components/LoginScreen';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useLocalStorage('activeTab', 'dashboard');
  const [sessions] = useLocalStorage('sessions', []);
  const [players] = useLocalStorage('players', []);
  const [expenses] = useLocalStorage('expenses', []);

  // If not authenticated, show login screen
  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  // For players, show their dashboard by default
  if (currentUser?.role === 'player' && activeTab === 'dashboard') {
    setActiveTab('my-wallet');
  }

  // Calculate stats for owner dashboard
  const today = new Date().toDateString();
  const todaySessions = sessions.filter((session: any) => 
    new Date(session.startTime).toDateString() === today
  );
  
  const todayRevenue = todaySessions.reduce((sum: number, session: any) => 
    sum + (session.totalAmount || 0), 0
  );
  
  const todayExpenses = expenses.filter((expense: any) => 
    new Date(expense.date).toDateString() === today
  ).reduce((sum: number, expense: any) => sum + expense.amount, 0);

  const activeSessions = sessions.filter((session: any) => !session.endTime).length;

  const renderActiveContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-green-800">Today's Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-900">₹{todayRevenue.toFixed(2)}</div>
                  <p className="text-xs text-green-600 mt-1">From {todaySessions.length} sessions</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-blue-800">Active Sessions</CardTitle>
                  <Calendar className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-900">{activeSessions}</div>
                  <p className="text-xs text-blue-600 mt-1">Currently playing</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-purple-800">Total Players</CardTitle>
                  <Users className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-900">{players.length}</div>
                  <p className="text-xs text-purple-600 mt-1">Registered members</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-orange-800">Net Profit</CardTitle>
                  <TrendingUp className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-900">₹{(todayRevenue - todayExpenses).toFixed(2)}</div>
                  <p className="text-xs text-orange-600 mt-1">Today's net earnings</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {todaySessions.slice(0, 5).map((session: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">Table {session.tableNumber}</p>
                          <p className="text-sm text-gray-600">{session.playerName}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">₹{session.totalAmount || 0}</p>
                          <Badge variant={session.endTime ? "secondary" : "default"}>
                            {session.endTime ? "Completed" : "Active"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                    {todaySessions.length === 0 && (
                      <p className="text-gray-500 text-center py-4">No sessions today</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      onClick={() => setActiveTab('tables')}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      Start Session
                    </Button>
                    <Button 
                      onClick={() => setActiveTab('players')}
                      variant="outline"
                    >
                      Add Player
                    </Button>
                    <Button 
                      onClick={() => setActiveTab('menu')}
                      variant="outline"
                    >
                      Take Order
                    </Button>
                    <Button 
                      onClick={() => setActiveTab('expenses')}
                      variant="outline"
                    >
                      Add Expense
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case 'tables':
        return <TableManagement />;
      case 'players':
        return <PlayerManagement />;
      case 'menu':
        return <MenuManagement />;
      case 'payments':
        return <PaymentInterface />;
      case 'expenses':
        return <ExpenseTracker />;
      case 'reports':
        return <Reports />;
      case 'admin-settings':
        return <AdminSettings />;
      case 'inventory':
        return <Inventory />;
      case 'my-wallet':
      case 'play-history':
      case 'food-orders':
        return <PlayerDashboard />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CT</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Cui Tip Snooker Club</h1>
                <p className="text-sm text-gray-500">Management System</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{new Date().toLocaleDateString()}</p>
              <p className="text-xs text-gray-500">{new Date().toLocaleTimeString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="mt-6">
          {renderActiveContent()}
        </div>
      </div>
    </div>
  );
};

export default Index;
