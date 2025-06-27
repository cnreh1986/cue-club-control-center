
import React, { createContext, useContext, useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export type UserRole = 'owner' | 'staff' | 'player';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  mobile?: string;
  pin?: string;
  password?: string;
  assignedClubs?: string[]; // For staff members
}

interface AuthContextType {
  currentUser: User | null;
  selectedClubId: string | null;
  availableClubs: string[];
  login: (credentials: { identifier: string; password: string; role: UserRole }) => boolean;
  logout: () => void;
  selectClub: (clubId: string) => void;
  isAuthenticated: boolean;
  hasAccess: (module: string) => boolean;
  needsClubSelection: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users] = useLocalStorage<User[]>('users', [
    { id: '1', name: 'Nadeem (Owner)', role: 'owner', password: 'admin123' },
    { id: '2', name: 'Staff Member', role: 'staff', pin: '1234', assignedClubs: [] },
    { id: '3', name: 'John Player', role: 'player', mobile: '9876543210', pin: '5678' },
    { id: '4', name: 'Sarah Player', role: 'player', mobile: '8765432109', pin: '9999' },
  ]);
  const [currentUser, setCurrentUser] = useLocalStorage<User | null>('currentUser', null);
  const [selectedClubId, setSelectedClubId] = useLocalStorage<string | null>('selectedClubId', null);

  // Get available clubs for current user
  const getAvailableClubs = (): string[] => {
    if (!currentUser) return [];
    
    const clubs = JSON.parse(localStorage.getItem('clubs') || '[]');
    
    if (currentUser.role === 'owner') {
      return clubs.filter((club: any) => club.ownerId === currentUser.id).map((club: any) => club.id);
    }
    
    if (currentUser.role === 'staff') {
      return currentUser.assignedClubs || [];
    }
    
    return [];
  };

  const availableClubs = getAvailableClubs();
  const needsClubSelection = currentUser?.role !== 'player' && availableClubs.length > 1 && !selectedClubId;

  const login = (credentials: { identifier: string; password: string; role: UserRole }): boolean => {
    const user = users.find(u => {
      if (u.role !== credentials.role) return false;
      
      // For owner and staff, check password/pin
      if (u.role === 'owner' && u.password === credentials.password) return true;
      if (u.role === 'staff' && u.pin === credentials.password) return true;
      
      // For players, check mobile number and pin
      if (u.role === 'player') {
        return (u.mobile === credentials.identifier || u.name.toLowerCase().includes(credentials.identifier.toLowerCase())) 
               && u.pin === credentials.password;
      }
      
      return false;
    });
    
    if (user) {
      setCurrentUser(user);
      
      // Auto-select club if user has only one club
      const userClubs = user.role === 'owner' 
        ? JSON.parse(localStorage.getItem('clubs') || '[]').filter((club: any) => club.ownerId === user.id)
        : user.assignedClubs || [];
      
      if (userClubs.length === 1) {
        setSelectedClubId(userClubs[0].id || userClubs[0]);
      }
      
      // Redirect based on role and club selection needs
      if (user.role === 'owner' && userClubs.length === 0) {
        window.location.href = '/owner-dashboard';
        return true;
      }
      
      if (user.role !== 'player' && userClubs.length > 1) {
        // Will show club selector
        window.location.href = '/app';
        return true;
      }
      
      // Redirect to appropriate dashboard
      if (user.role === 'owner') {
        window.location.href = '/owner-dashboard';
      } else {
        window.location.href = '/app';
      }
      
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    setSelectedClubId(null);
    window.location.href = '/';
  };

  const selectClub = (clubId: string) => {
    setSelectedClubId(clubId);
  };

  const hasAccess = (module: string): boolean => {
    if (!currentUser) return false;
    
    const permissions = {
      owner: ['dashboard', 'tables', 'players', 'menu', 'payments', 'expenses', 'admin-settings', 'reports', 'staff-management', 'bookings'],
      staff: ['tables', 'menu', 'payments', 'inventory', 'bookings'],
      player: ['my-wallet', 'play-history', 'food-orders', 'my-bookings']
    };
    
    return permissions[currentUser.role].includes(module);
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      selectedClubId,
      availableClubs,
      login,
      logout,
      selectClub,
      isAuthenticated: !!currentUser,
      hasAccess,
      needsClubSelection
    }}>
      {children}
    </AuthContext.Provider>
  );
};
