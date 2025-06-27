
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useClub } from '@/contexts/ClubContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';
import LoginScreen from '@/components/LoginScreen';
import OwnerDashboard from '@/components/OwnerDashboard';
import { Club } from '@/types/club';

const OwnerLanding = () => {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const { setSelectedClub } = useClub();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  if (currentUser?.role !== 'owner') {
    navigate('/');
    return null;
  }

  const handleCreateClub = () => {
    navigate('/create-club');
  };

  const handleManageClub = (club: Club) => {
    setSelectedClub(club);
    navigate(`/club/${club.id}`);
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
                <p className="text-sm text-gray-500">Owner Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium">{currentUser.name}</span>
              </div>
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
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <OwnerDashboard onCreateClub={handleCreateClub} onManageClub={handleManageClub} />
      </div>
    </div>
  );
};

export default OwnerLanding;
