
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useClub } from '@/contexts/ClubContext';
import { useNavigate } from 'react-router-dom';
import LoginScreen from '@/components/LoginScreen';
import OwnerDashboard from '@/components/OwnerDashboard';
import { Club } from '@/types/club';

const OwnerLanding = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const { setCurrentClub } = useClub();
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
    setCurrentClub(club);
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
