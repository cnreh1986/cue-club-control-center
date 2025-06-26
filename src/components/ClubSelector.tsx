
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useClub } from '@/contexts/ClubContext';
import { ChevronDown } from 'lucide-react';

const ClubSelector = () => {
  const { clubs, currentClub, setCurrentClub } = useClub();

  if (!currentClub || clubs.length <= 1) return null;

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium">Current Club:</span>
      <div className="relative">
        <Button variant="outline" size="sm" className="flex items-center space-x-2">
          <span>{currentClub.name}</span>
          <ChevronDown className="w-4 h-4" />
        </Button>
        {/* Dropdown implementation would go here */}
      </div>
    </div>
  );
};

export default ClubSelector;
