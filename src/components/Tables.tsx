
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useClub } from '@/contexts/ClubContext';
import { Clock, Users } from 'lucide-react';

const Tables = () => {
  const { selectedClub, getClubBookings } = useClub();

  if (!selectedClub) {
    return (
      <div className="text-center py-8 text-gray-500">
        Please select a club to view tables
      </div>
    );
  }

  const bookings = getClubBookings(selectedClub.id);
  const now = new Date();
  
  // Get active bookings (currently ongoing)
  const activeBookings = bookings.filter(booking => {
    const startTime = new Date(booking.startTime);
    const endTime = new Date(booking.endTime);
    return now >= startTime && now <= endTime && booking.status === 'confirmed';
  });

  const getTableStatus = (tableId: string) => {
    const activeBooking = activeBookings.find(booking => booking.tableId === tableId);
    return activeBooking ? { isOccupied: true, booking: activeBooking } : { isOccupied: false, booking: null };
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold mb-4">Tables</h2>
          <p className="text-gray-600">Manage your club's tables and availability</p>
        </div>
        <Button variant="outline">
          Add New Table
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {selectedClub.tables?.map((table) => {
          const { isOccupied, booking } = getTableStatus(table.id);
          
          return (
            <Card key={table.id} className={isOccupied ? 'border-orange-300 bg-orange-50' : 'border-green-300 bg-green-50'}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Table {table.number}
                  <Badge variant={isOccupied ? "destructive" : "secondary"}>
                    {isOccupied ? "Occupied" : "Available"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Rate:</span>
                    <span className="font-medium">₹{table.ratePerHour}/hour</span>
                  </div>
                  
                  {table.description && (
                    <p className="text-sm text-gray-500">{table.description}</p>
                  )}
                  
                  {isOccupied && booking && (
                    <div className="mt-3 p-3 bg-white rounded border">
                      <div className="flex items-center space-x-2 mb-2">
                        <Users className="w-4 h-4" />
                        <span className="font-medium text-sm">{booking.playerName}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-gray-600">
                        <Clock className="w-3 h-3" />
                        <span>
                          {new Date(booking.startTime).toLocaleTimeString()} - {new Date(booking.endTime).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex space-x-2 mt-4">
                    <Button size="sm" variant={isOccupied ? "destructive" : "default"} className="flex-1">
                      {isOccupied ? "End Session" : "Book Now"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        }) || (
          <div className="col-span-3 text-center py-8 text-gray-500">
            No tables configured yet
          </div>
        )}
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Table Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{selectedClub.tables?.filter(t => !getTableStatus(t.id).isOccupied).length || 0}</div>
              <div className="text-sm text-gray-600">Available Tables</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{activeBookings.length}</div>
              <div className="text-sm text-gray-600">Occupied Tables</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{selectedClub.tables?.length || 0}</div>
              <div className="text-sm text-gray-600">Total Tables</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Tables;
