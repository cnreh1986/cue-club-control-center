
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useClub } from '@/contexts/ClubContext';
import { Calendar, Users, DollarSign, UtensilsCrossed } from 'lucide-react';

const Dashboard = () => {
  const { selectedClub, getClubStats, getClubBookings } = useClub();

  if (!selectedClub) {
    return (
      <div className="text-center py-8 text-gray-500">
        Please select a club to view dashboard
      </div>
    );
  }

  const stats = getClubStats(selectedClub.id);
  const bookings = getClubBookings(selectedClub.id);
  
  // Get today's bookings
  const today = new Date().toDateString();
  const todayBookings = bookings.filter(booking => 
    new Date(booking.startTime).toDateString() === today
  );

  // Calculate today's revenue (for completed/confirmed bookings)
  const todayRevenue = todayBookings
    .filter(booking => booking.status === 'confirmed' || booking.status === 'completed')
    .reduce((sum, booking) => {
      const duration = (new Date(booking.endTime).getTime() - new Date(booking.startTime).getTime()) / (1000 * 60 * 60);
      const table = selectedClub.tables.find(t => t.id === booking.tableId);
      return sum + (duration * (table?.ratePerHour || 0));
    }, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
        <p className="text-gray-600">Welcome to {selectedClub.name} management dashboard</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-blue-600" />
              Today's Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{todayBookings.length}</div>
            <p className="text-xs text-gray-600 mt-1">
              {todayBookings.filter(b => b.status === 'confirmed').length} confirmed
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <DollarSign className="w-4 h-4 mr-2 text-green-600" />
              Today's Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₹{todayRevenue}</div>
            <p className="text-xs text-gray-600 mt-1">
              Monthly: ₹{stats.monthlyRevenue}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <UtensilsCrossed className="w-4 h-4 mr-2 text-orange-600" />
              Active Tables
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.activeTables}</div>
            <p className="text-xs text-gray-600 mt-1">
              of {selectedClub.tables.length} total
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Users className="w-4 h-4 mr-2 text-purple-600" />
              Staff Members
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{selectedClub.staff.length}</div>
            <p className="text-xs text-gray-600 mt-1">
              Total Players: {stats.totalPlayers}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            {todayBookings.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No bookings for today</p>
            ) : (
              <div className="space-y-3">
                {todayBookings.slice(0, 5).map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">{booking.playerName}</div>
                      <div className="text-sm text-gray-600">
                        Table {selectedClub.tables.find(t => t.id === booking.tableId)?.number}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {new Date(booking.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - 
                        {new Date(booking.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                      <div className={`text-xs px-2 py-1 rounded ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {booking.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Occupancy Rate</span>
                <span className="font-medium">{stats.occupancyRate.toFixed(1)}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Bookings</span>
                <span className="font-medium">{stats.totalBookings}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Outstanding Payments</span>
                <span className="font-medium text-red-600">₹{stats.outstandingPayments}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Food Orders</span>
                <span className="font-medium">{stats.totalFoodOrders}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
