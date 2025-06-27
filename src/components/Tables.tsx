
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useClub } from '@/contexts/ClubContext';

const Tables = () => {
  const { selectedClub } = useClub();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Tables</h2>
        <p className="text-gray-600">Manage your club's tables and availability</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {selectedClub?.tables?.map((table) => (
          <Card key={table.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Table {table.number}
                <Badge variant={table.isActive ? "default" : "secondary"}>
                  {table.isActive ? "Active" : "Inactive"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Rate: ₹{table.ratePerHour}/hour</p>
                {table.description && (
                  <p className="text-sm text-gray-500">{table.description}</p>
                )}
              </div>
            </CardContent>
          </Card>
        )) || (
          <div className="col-span-3 text-center py-8 text-gray-500">
            No tables configured yet
          </div>
        )}
      </div>
    </div>
  );
};

export default Tables;
