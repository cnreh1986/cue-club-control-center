
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useClub } from '@/contexts/ClubContext';
import { Building2, MapPin, Users } from 'lucide-react';

const ClubSelectionScreen = () => {
  const { currentUser, availableClubs, selectClub } = useAuth();
  const { clubs } = useClub();

  const userClubs = clubs.filter(club => availableClubs.includes(club.id));

  const handleClubSelect = (clubId: string) => {
    selectClub(clubId);
    window.location.reload(); // Refresh to update the app state
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">CT</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Select Your Club</h1>
          <p className="text-gray-600">
            Welcome {currentUser?.name}! Please choose which club you'd like to manage.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userClubs.map((club) => (
            <Card key={club.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{club.name}</CardTitle>
                    <Badge variant="secondary">{club.plan}</Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{club.address}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Users className="h-4 w-4" />
                  <span>{club.tables.length} Tables • {club.staff.length} Staff</span>
                </div>
                
                <Button 
                  onClick={() => handleClubSelect(club.id)}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Select Club
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {userClubs.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-gray-500 mb-4">
                <Building2 className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium">No Clubs Assigned</h3>
                <p>You haven't been assigned to any clubs yet. Please contact your administrator.</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ClubSelectionScreen;
