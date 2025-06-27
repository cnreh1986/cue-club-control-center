
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useClub } from '@/contexts/ClubContext';
import { useToast } from '@/hooks/use-toast';
import { Booking } from '@/types/booking';
import { CalendarDays, Clock, User, Table } from 'lucide-react';

const BookingCalendar = () => {
  const { selectedClub, getClubBookings, addBooking } = useClub();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [newBooking, setNewBooking] = useState({
    tableId: '',
    playerName: '',
    playerMobile: '',
    startTime: '',
    endTime: '',
    notes: ''
  });

  const bookings = selectedClub ? getClubBookings(selectedClub.id) : [];
  const selectedDateBookings = selectedDate 
    ? bookings.filter(booking => 
        new Date(booking.startTime).toDateString() === selectedDate.toDateString()
      )
    : [];

  const handleCreateBooking = () => {
    if (!selectedClub || !newBooking.tableId || !newBooking.playerName || !newBooking.startTime || !newBooking.endTime) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const booking: Booking = {
      id: `booking_${Date.now()}`,
      clubId: selectedClub.id,
      tableId: newBooking.tableId,
      playerId: `player_${Date.now()}`,
      playerName: newBooking.playerName,
      playerMobile: newBooking.playerMobile,
      startTime: newBooking.startTime,
      endTime: newBooking.endTime,
      status: 'confirmed',
      notes: newBooking.notes,
      createdBy: 'current_user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isRecurring: false,
      paymentStatus: 'none'
    };

    addBooking(booking);
    setShowBookingForm(false);
    setNewBooking({
      tableId: '',
      playerName: '',
      playerMobile: '',
      startTime: '',
      endTime: '',
      notes: ''
    });

    toast({
      title: "Booking Created",
      description: `Booking for ${newBooking.playerName} has been created successfully`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'no-show': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!selectedClub) {
    return (
      <div className="text-center py-8 text-gray-500">
        Please select a club to view bookings
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold mb-4">Booking Calendar</h2>
        <Dialog open={showBookingForm} onOpenChange={setShowBookingForm}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <CalendarDays className="w-4 h-4 mr-2" />
              New Booking
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Booking</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="table">Table</Label>
                <Select value={newBooking.tableId} onValueChange={(value) => setNewBooking({...newBooking, tableId: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a table" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedClub.tables.map((table) => (
                      <SelectItem key={table.id} value={table.id}>
                        Table {table.number} - ₹{table.ratePerHour}/hour
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="playerName">Player Name</Label>
                <Input
                  id="playerName"
                  value={newBooking.playerName}
                  onChange={(e) => setNewBooking({...newBooking, playerName: e.target.value})}
                  placeholder="Enter player name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="playerMobile">Mobile Number</Label>
                <Input
                  id="playerMobile"
                  value={newBooking.playerMobile}
                  onChange={(e) => setNewBooking({...newBooking, playerMobile: e.target.value})}
                  placeholder="Enter mobile number"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="datetime-local"
                  value={newBooking.startTime}
                  onChange={(e) => setNewBooking({...newBooking, startTime: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="datetime-local"
                  value={newBooking.endTime}
                  onChange={(e) => setNewBooking({...newBooking, endTime: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Input
                  id="notes"
                  value={newBooking.notes}
                  onChange={(e) => setNewBooking({...newBooking, notes: e.target.value})}
                  placeholder="Any special notes"
                />
              </div>
              
              <Button onClick={handleCreateBooking} className="w-full bg-green-600 hover:bg-green-700">
                Create Booking
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CalendarDays className="w-5 h-5 mr-2" />
              {selectedDate ? selectedDate.toDateString() : 'Select a date'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDateBookings.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No bookings for this date</p>
            ) : (
              <div className="space-y-3">
                {selectedDateBookings.map((booking) => (
                  <div key={booking.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Table className="w-4 h-4" />
                        <span className="font-medium">
                          Table {selectedClub.tables.find(t => t.id === booking.tableId)?.number}
                        </span>
                      </div>
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        {booking.playerName}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        {new Date(booking.startTime).toLocaleTimeString()} - {new Date(booking.endTime).toLocaleTimeString()}
                      </div>
                      {booking.notes && (
                        <p className="text-gray-500 mt-2">{booking.notes}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookingCalendar;
