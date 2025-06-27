import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import LoginScreen from '@/components/LoginScreen';
import Navigation from '@/components/Navigation';
import Dashboard from '@/components/Dashboard';
import Tables from '@/components/Tables';
import Players from '@/components/Players';
import Menu from '@/components/Menu';
import Payments from '@/components/Payments';
import Inventory from '@/components/Inventory';
import Expenses from '@/components/Expenses';
import Reports from '@/components/Reports';
import AdminSettings from '@/components/AdminSettings';
import MyWallet from '@/components/MyWallet';
import PlayHistory from '@/components/PlayHistory';
import FoodOrders from '@/components/FoodOrders';
import ClubSelector from '@/components/ClubSelector';
import MyBookings from '@/components/MyBookings';
import ClubSelectionScreen from "@/components/ClubSelectionScreen";

const Index = () => {
  const { currentUser, isAuthenticated, needsClubSelection } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  // Show club selection if user needs to select a club
  if (needsClubSelection) {
    return <ClubSelectionScreen />;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'tables': return <Tables />;
      case 'players': return <Players />;
      case 'menu': return <Menu />;
      case 'payments': return <Payments />;
      case 'inventory': return <Inventory />;
      case 'expenses': return <Expenses />;
      case 'reports': return <Reports />;
      case 'admin-settings': return <AdminSettings />;
      case 'my-wallet': return <MyWallet />;
      case 'play-history': return <PlayHistory />;
      case 'food-orders': return <FoodOrders />;
      case 'my-bookings': return <MyBookings />;
      default: return <div>Tab content for {activeTab}</div>;
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
                <h1 className="text-xl font-bold text-gray-900">Cui Tip Management</h1>
                <p className="text-sm text-gray-500">Dashboard Overview</p>
              </div>
            </div>
            <ClubSelector />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
          <div className="md:col-span-2">
            <div className="min-h-[500px] bg-white rounded-lg shadow-sm border p-4">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
