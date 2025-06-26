
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { toast } from '@/hooks/use-toast';

const TableManagement = () => {
  const [tables, setTables] = useLocalStorage('tables', [
    { id: 1, name: 'Table 1', hourlyRate: 100, isOccupied: false },
    { id: 2, name: 'Table 2', hourlyRate: 100, isOccupied: false },
    { id: 3, name: 'Table 3', hourlyRate: 120, isOccupied: false },
    { id: 4, name: 'Table 4', hourlyRate: 120, isOccupied: false },
  ]);
  
  const [sessions, setSessions] = useLocalStorage('sessions', []);
  const [players] = useLocalStorage('players', []);
  
  const [newSession, setNewSession] = useState({
    tableId: '',
    playerName: '',
    startTime: new Date().toISOString().slice(0, 16),
  });

  const startSession = () => {
    if (!newSession.tableId || !newSession.playerName) {
      toast({
        title: "Error",
        description: "Please select a table and enter player name",
        variant: "destructive",
      });
      return;
    }

    const tableId = parseInt(newSession.tableId);
    const table = tables.find(t => t.id === tableId);
    
    if (!table) return;

    const sessionData = {
      id: Date.now(),
      tableId,
      tableNumber: table.name,
      playerName: newSession.playerName,
      startTime: newSession.startTime,
      hourlyRate: table.hourlyRate,
      endTime: null,
      totalAmount: 0,
    };

    setSessions([...sessions, sessionData]);
    setTables(tables.map(t => 
      t.id === tableId ? { ...t, isOccupied: true } : t
    ));

    setNewSession({
      tableId: '',
      playerName: '',
      startTime: new Date().toISOString().slice(0, 16),
    });

    toast({
      title: "Session Started",
      description: `${newSession.playerName} started playing on ${table.name}`,
    });
  };

  const endSession = (sessionId: number) => {
    const session = sessions.find((s: any) => s.id === sessionId);
    if (!session) return;

    const endTime = new Date();
    const startTime = new Date(session.startTime);
    const durationHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
    const totalAmount = Math.ceil(durationHours * session.hourlyRate);

    setSessions(sessions.map((s: any) => 
      s.id === sessionId 
        ? { ...s, endTime: endTime.toISOString(), totalAmount }
        : s
    ));

    setTables(tables.map(t => 
      t.id === session.tableId ? { ...t, isOccupied: false } : t
    ));

    toast({
      title: "Session Ended",
      description: `Total amount: ₹${totalAmount}`,
    });
  };

  const activeSessions = sessions.filter((s: any) => !s.endTime);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Table Management</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">Start New Session</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Start New Session</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="table">Select Table</Label>
                <select
                  id="table"
                  className="w-full p-2 border rounded-md"
                  value={newSession.tableId}
                  onChange={(e) => setNewSession({...newSession, tableId: e.target.value})}
                >
                  <option value="">Choose a table</option>
                  {tables.filter(t => !t.isOccupied).map((table) => (
                    <option key={table.id} value={table.id}>
                      {table.name} - ₹{table.hourlyRate}/hour
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="player">Player Name</Label>
                <Input
                  id="player"
                  value={newSession.playerName}
                  onChange={(e) => setNewSession({...newSession, playerName: e.target.value})}
                  placeholder="Enter player name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="datetime-local"
                  value={newSession.startTime}
                  onChange={(e) => setNewSession({...newSession, startTime: e.target.value})}
                />
              </div>
              <Button onClick={startSession} className="w-full bg-green-600 hover:bg-green-700">
                Start Session
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {tables.map((table) => (
          <Card key={table.id} className={`${table.isOccupied ? 'border-red-300 bg-red-50' : 'border-green-300 bg-green-50'}`}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">{table.name}</CardTitle>
                <Badge variant={table.isOccupied ? "destructive" : "secondary"}>
                  {table.isOccupied ? "Occupied" : "Available"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-2">₹{table.hourlyRate}/hour</p>
              {table.isOccupied && (
                <div className="text-sm text-red-700">
                  <p>Currently in use</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          {activeSessions.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No active sessions</p>
          ) : (
            <div className="space-y-3">
              {activeSessions.map((session: any) => (
                <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{session.tableNumber}</p>
                    <p className="text-sm text-gray-600">{session.playerName}</p>
                    <p className="text-xs text-gray-500">
                      Started: {new Date(session.startTime).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right space-y-2">
                    <p className="text-sm font-medium">₹{session.hourlyRate}/hour</p>
                    <Button 
                      onClick={() => endSession(session.id)}
                      variant="destructive"
                      size="sm"
                    >
                      End Session
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TableManagement;
