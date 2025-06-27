
import React from 'react';
import BookingCalendar from './BookingCalendar';

const Bookings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Bookings</h2>
        <p className="text-gray-600">Manage table bookings and reservations</p>
      </div>
      
      <BookingCalendar />
    </div>
  );
};

export default Bookings;
