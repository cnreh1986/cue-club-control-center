
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Club, ClubStats, Table } from '@/types/club';
import { Booking } from '@/types/booking';
import { useAuth } from '@/contexts/AuthContext';

interface ClubContextType {
  clubs: Club[];
  currentClub: Club | null;
  setCurrentClub: (club: Club | null) => void;
  addClub: (club: Club) => void;
  updateClub: (clubId: string, updates: Partial<Club>) => void;
  getClubStats: (clubId: string) => ClubStats;
  getClubBookings: (clubId: string) => Booking[];
  addBooking: (booking: Booking) => void;
  updateBooking: (bookingId: string, updates: Partial<Booking>) => void;
  deleteBooking: (bookingId: string) => void;
}

const ClubContext = createContext<ClubContextType | null>(null);

export const useClub = () => {
  const context = useContext(ClubContext);
  if (!context) {
    throw new Error('useClub must be used within a ClubProvider');
  }
  return context;
};

export const ClubProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clubs, setClubs] = useLocalStorage<Club[]>('clubs', []);
  const [currentClub, setCurrentClub] = useState<Club | null>(null);
  const { selectedClubId } = useAuth();

  // Update current club when selectedClubId changes
  useEffect(() => {
    if (selectedClubId) {
      const club = clubs.find(c => c.id === selectedClubId);
      setCurrentClub(club || null);
    } else {
      setCurrentClub(null);
    }
  }, [selectedClubId, clubs]);

  const addClub = (club: Club) => {
    // Convert table count to table array if needed
    const clubWithTables = {
      ...club,
      tables: club.tables.length > 0 ? club.tables : Array.from({ length: club.tables.length || 1 }, (_, i) => ({
        id: `table_${club.id}_${i + 1}`,
        number: i + 1,
        ratePerHour: club.tables[0]?.ratePerHour || 100,
        isActive: true
      }))
    };
    
    setClubs(prev => [...prev, clubWithTables]);
  };

  const updateClub = (clubId: string, updates: Partial<Club>) => {
    setClubs(prev => prev.map(club => 
      club.id === clubId ? { ...club, ...updates } : club
    ));
  };

  const getClubBookings = (clubId: string): Booking[] => {
    return JSON.parse(localStorage.getItem(`bookings_${clubId}`) || '[]');
  };

  const addBooking = (booking: Booking) => {
    const existingBookings = getClubBookings(booking.clubId);
    const updatedBookings = [...existingBookings, booking];
    localStorage.setItem(`bookings_${booking.clubId}`, JSON.stringify(updatedBookings));
  };

  const updateBooking = (bookingId: string, updates: Partial<Booking>) => {
    const allClubs = clubs;
    for (const club of allClubs) {
      const bookings = getClubBookings(club.id);
      const bookingIndex = bookings.findIndex(b => b.id === bookingId);
      if (bookingIndex !== -1) {
        bookings[bookingIndex] = { ...bookings[bookingIndex], ...updates };
        localStorage.setItem(`bookings_${club.id}`, JSON.stringify(bookings));
        break;
      }
    }
  };

  const deleteBooking = (bookingId: string) => {
    const allClubs = clubs;
    for (const club of allClubs) {
      const bookings = getClubBookings(club.id);
      const filteredBookings = bookings.filter(b => b.id !== bookingId);
      if (filteredBookings.length !== bookings.length) {
        localStorage.setItem(`bookings_${club.id}`, JSON.stringify(filteredBookings));
        break;
      }
    }
  };

  const getClubStats = (clubId: string): ClubStats => {
    // Get club-specific data from localStorage
    const sessions = JSON.parse(localStorage.getItem(`sessions_${clubId}`) || '[]');
    const players = JSON.parse(localStorage.getItem(`players_${clubId}`) || '[]');
    const bookings = getClubBookings(clubId);
    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyRevenue = sessions
      .filter((session: any) => {
        const sessionDate = new Date(session.startTime);
        return sessionDate.getMonth() === currentMonth && sessionDate.getFullYear() === currentYear && session.endTime;
      })
      .reduce((sum: number, session: any) => sum + (session.totalAmount || 0), 0);
    
    const activeTables = sessions.filter((session: any) => !session.endTime).length;
    const totalPlayers = players.length;
    const totalFoodOrders = sessions.reduce((sum: number, session: any) => sum + (session.foodOrders?.length || 0), 0);
    const outstandingPayments = sessions
      .filter((session: any) => session.endTime && !session.paid)
      .reduce((sum: number, session: any) => sum + (session.totalAmount || 0), 0);

    const totalBookings = bookings.length;
    const club = clubs.find(c => c.id === clubId);
    const tableCount = club?.tables.length || 1;
    
    // Calculate occupancy rate based on bookings
    const today = new Date().toDateString();
    const todayBookings = bookings.filter(b => new Date(b.startTime).toDateString() === today);
    const occupancyRate = tableCount > 0 ? (todayBookings.length / tableCount) * 100 : 0;

    return {
      monthlyRevenue,
      activeTables,
      totalPlayers,
      totalFoodOrders,
      outstandingPayments,
      totalBookings,
      occupancyRate: Math.min(occupancyRate, 100)
    };
  };

  return (
    <ClubContext.Provider value={{
      clubs,
      currentClub,
      setCurrentClub,
      addClub,
      updateClub,
      getClubStats,
      getClubBookings,
      addBooking,
      updateBooking,
      deleteBooking
    }}>
      {children}
    </ClubContext.Provider>
  );
};
