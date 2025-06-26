
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoginScreen from '@/components/LoginScreen';
import ClubCreationWizard from '@/components/ClubCreationWizard';

const CreateClub = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  if (currentUser?.role !== 'owner') {
    navigate('/');
    return null;
  }

  const handleComplete = () => {
    navigate('/owner-dashboard');
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
                <p className="text-sm text-gray-500">Create New Club</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-6">
        <ClubCreationWizard onComplete={handleComplete} />
      </div>
    </div>
  );
};

export default CreateClub;
