
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useClub } from '@/contexts/ClubContext';
import { useAuth } from '@/contexts/AuthContext';
import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const ClubSelector = () => {
  const { clubs, selectedClub, setSelectedClub } = useClub();
  const { availableClubs, selectClub } = useAuth();

  // Filter clubs available to the current user
  const userClubs = clubs.filter(club => availableClubs.includes(club.id));

  if (!selectedClub || userClubs.length <= 1) return null;

  const handleClubSelect = (clubId: string) => {
    const club = clubs.find(c => c.id === clubId);
    if (club) {
      setSelectedClub(club);
      selectClub(clubId);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium">Current Club:</span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center space-x-2">
            <span>{selectedClub.name}</span>
            <ChevronDown className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {userClubs.map((club) => (
            <DropdownMenuItem 
              key={club.id}
              onClick={() => handleClubSelect(club.id)}
              className={selectedClub.id === club.id ? 'bg-green-50' : ''}
            >
              {club.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ClubSelector;
