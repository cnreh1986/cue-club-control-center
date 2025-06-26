
import React, { createContext, useContext, useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Club, ClubStats } from '@/types/club';

interface ClubContextType {
  clubs: Club[];
  currentClub: Club | null;
  setCurrentClub: (club: Club | null) => void;
  addClub: (club: Club) => void;
  updateClub: (clubId: string, updates: Partial<Club>) => void;
  getClubStats: (clubId: string) => ClubStats;
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

  const addClub = (club: Club) => {
    setClubs(prev => [...prev, club]);
  };

  const updateClub = (clubId: string, updates: Partial<Club>) => {
    setClubs(prev => prev.map(club => 
      club.id === clubId ? { ...club, ...updates } : club
    ));
  };

  const getClubStats = (clubId: string): ClubStats => {
    // Get club-specific data from localStorage
    const sessions = JSON.parse(localStorage.getItem(`sessions_${clubId}`) || '[]');
    const players = JSON.parse(localStorage.getItem(`players_${clubId}`) || '[]');
    const expenses = JSON.parse(localStorage.getItem(`expenses_${clubId}`) || '[]');
    
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

    return {
      monthlyRevenue,
      activeTables,
      totalPlayers,
      totalFoodOrders,
      outstandingPayments
    };
  };

  return (
    <ClubContext.Provider value={{
      clubs,
      currentClub,
      setCurrentClub,
      addClub,
      updateClub,
      getClubStats
    }}>
      {children}
    </ClubContext.Provider>
  );
};
