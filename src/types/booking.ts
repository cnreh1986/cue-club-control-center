
export interface Booking {
  id: string;
  clubId: string;
  tableId: string;
  playerId: string;
  playerName: string;
  playerMobile?: string;
  startTime: string;
  endTime: string;
  status: 'confirmed' | 'cancelled' | 'completed' | 'no-show';
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  
  // Recurring booking properties
  isRecurring: boolean;
  recurringPattern?: RecurringPattern;
  recurringSeriesId?: string;
  
  // Payment properties
  paymentStatus: 'none' | 'deposit' | 'full' | 'pending';
  paymentMethod?: 'cash' | 'upi' | 'wallet';
  paymentAmount?: number;
  invoiceId?: string;
  
  // Cancellation
  cancellationReason?: string;
  cancelledAt?: string;
  cancelledBy?: string;
}

export interface RecurringPattern {
  type: 'daily' | 'weekly' | 'monthly' | 'custom';
  interval: number; // every X days/weeks/months
  daysOfWeek?: number[]; // for weekly: [1,3,5] = Mon, Wed, Fri
  endDate?: string;
  maxOccurrences?: number;
}

export interface BookingConflict {
  conflictType: 'overlap' | 'table-unavailable' | 'double-booking';
  existingBooking: Booking;
  message: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  booking: Booking;
  color?: string;
}

export interface BookingFilter {
  clubId?: string;
  tableId?: string;
  playerId?: string;
  startDate?: string;
  endDate?: string;
  status?: Booking['status'];
}

export interface BookingStats {
  totalBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
  noShows: number;
  revenueFromBookings: number;
  occupancyRate: number;
}
