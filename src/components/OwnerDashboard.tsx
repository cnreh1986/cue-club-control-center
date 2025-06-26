
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useClub } from '@/contexts/ClubContext';
import { useAuth } from '@/contexts/AuthContext';
import { Club } from '@/types/club';
import { DollarSign, Users, Calendar, UtensilsCrossed, AlertCircle, Plus } from 'lucide-react';

interface OwnerDashboardProps {
  onCreateClub: () => void;
  onManageClub: (club: Club) => void;
}

const OwnerDashboard = ({ onCreateClub, onManageClub }: OwnerDashboardProps) => {
  const { clubs, getClubStats } = useClub();
  const { currentUser } = useAuth();

  const ownerClubs = clubs.filter(club => club.ownerId === currentUser?.id);

  if (ownerClubs.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Plus className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Welcome to Cui Tip Management</h2>
        <p className="text-gray-600 mb-6">Create your first club to get started</p>
        <Button onClick={onCreateClub} size="lg" className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" />
          Create Your First Club
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">My Clubs</h1>
          <p className="text-gray-600">Manage all your snooker clubs from one place</p>
        </div>
        <Button onClick={onCreateClub} className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" />
          Create New Club
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {ownerClubs.map((club) => {
          const stats = getClubStats(club.id);
          
          return (
            <Card key={club.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{club.name}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{club.address}</p>
                  </div>
                  <Badge variant="secondary">{club.plan}</Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <DollarSign className="w-5 h-5 text-green-600 mx-auto mb-1" />
                    <div className="text-lg font-bold text-green-900">₹{stats.monthlyRevenue}</div>
                    <div className="text-xs text-green-600">This Month</div>
                  </div>
                  
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                    <div className="text-lg font-bold text-blue-900">{stats.activeTables}</div>
                    <div className="text-xs text-blue-600">Active Now</div>
                  </div>
                  
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <Users className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                    <div className="text-lg font-bold text-purple-900">{stats.totalPlayers}</div>
                    <div className="text-xs text-purple-600">Total Players</div>
                  </div>
                  
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <UtensilsCrossed className="w-5 h-5 text-orange-600 mx-auto mb-1" />
                    <div className="text-lg font-bold text-orange-900">{stats.totalFoodOrders}</div>
                    <div className="text-xs text-orange-600">Food Orders</div>
                  </div>
                </div>

                {stats.outstandingPayments > 0 && (
                  <div className="flex items-center space-x-2 p-3 bg-red-50 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <div className="text-sm">
                      <span className="font-medium text-red-900">₹{stats.outstandingPayments}</span>
                      <span className="text-red-600 ml-1">outstanding</span>
                    </div>
                  </div>
                )}

                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => console.log('View reports for', club.id)}
                  >
                    View Reports
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => onManageClub(club)}
                  >
                    Manage Club
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default OwnerDashboard;
