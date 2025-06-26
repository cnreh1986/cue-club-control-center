
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
}

interface AuthContextType {
  currentUser: User | null;
  login: (credentials: { identifier: string; password: string; role: UserRole }) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
  hasAccess: (module: string) => boolean;
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
    { id: '2', name: 'Staff Member', role: 'staff', pin: '1234' },
    { id: '3', name: 'John Player', role: 'player', mobile: '9876543210', pin: '5678' },
    { id: '4', name: 'Sarah Player', role: 'player', mobile: '8765432109', pin: '9999' },
  ]);
  const [currentUser, setCurrentUser] = useLocalStorage<User | null>('currentUser', null);

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
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const hasAccess = (module: string): boolean => {
    if (!currentUser) return false;
    
    const permissions = {
      owner: ['dashboard', 'tables', 'players', 'menu', 'payments', 'expenses', 'admin-settings', 'reports', 'staff-management'],
      staff: ['tables', 'menu', 'payments', 'inventory'],
      player: ['my-wallet', 'play-history', 'food-orders']
    };
    
    return permissions[currentUser.role].includes(module);
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      login,
      logout,
      isAuthenticated: !!currentUser,
      hasAccess
    }}>
      {children}
    </AuthContext.Provider>
  );
};
