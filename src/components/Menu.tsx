
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useClub } from '@/contexts/ClubContext';

const Menu = () => {
  const { selectedClub } = useClub();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Menu</h2>
        <p className="text-gray-600">Manage your club's food and beverage menu</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {selectedClub?.menu?.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {item.name}
                <Badge variant={item.isAvailable ? "default" : "secondary"}>
                  {item.isAvailable ? "Available" : "Unavailable"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-lg font-semibold">₹{item.price}</p>
                <Badge variant="outline">{item.category}</Badge>
                {item.description && (
                  <p className="text-sm text-gray-500">{item.description}</p>
                )}
              </div>
            </CardContent>
          </Card>
        )) || (
          <div className="col-span-2 text-center py-8 text-gray-500">
            No menu items configured yet
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;
