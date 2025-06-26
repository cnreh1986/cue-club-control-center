
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { toast } from '@/hooks/use-toast';

const PlayerManagement = () => {
  const [players, setPlayers] = useLocalStorage('players', []);
  const [newPlayer, setNewPlayer] = useState({
    name: '',
    phone: '',
    walletBalance: 0,
  });
  const [topUpAmount, setTopUpAmount] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const addPlayer = () => {
    if (!newPlayer.name || !newPlayer.phone) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const playerData = {
      id: Date.now(),
      ...newPlayer,
      walletBalance: Number(newPlayer.walletBalance) || 0,
      createdAt: new Date().toISOString(),
      totalSpent: 0,
      sessionsCount: 0,
    };

    setPlayers([...players, playerData]);
    setNewPlayer({ name: '', phone: '', walletBalance: 0 });

    toast({
      title: "Player Added",
      description: `${newPlayer.name} has been added successfully`,
    });
  };

  const topUpWallet = (playerId: number) => {
    const amount = Number(topUpAmount);
    if (!amount || amount <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    setPlayers(players.map((player: any) => 
      player.id === playerId 
        ? { ...player, walletBalance: player.walletBalance + amount }
        : player
    ));

    setTopUpAmount('');
    setSelectedPlayer(null);

    toast({
      title: "Wallet Topped Up",
      description: `₹${amount} added to wallet`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Player Management</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">Add New Player</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Player</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={newPlayer.name}
                  onChange={(e) => setNewPlayer({...newPlayer, name: e.target.value})}
                  placeholder="Enter player's full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={newPlayer.phone}
                  onChange={(e) => setNewPlayer({...newPlayer, phone: e.target.value})}
                  placeholder="Enter phone number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="wallet">Initial Wallet Balance</Label>
                <Input
                  id="wallet"
                  type="number"
                  value={newPlayer.walletBalance}
                  onChange={(e) => setNewPlayer({...newPlayer, walletBalance: Number(e.target.value)})}
                  placeholder="0"
                />
              </div>
              <Button onClick={addPlayer} className="w-full bg-green-600 hover:bg-green-700">
                Add Player
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {players.map((player: any) => (
          <Card key={player.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{player.name}</CardTitle>
                  <p className="text-sm text-gray-600">{player.phone}</p>
                </div>
                <Badge variant={player.walletBalance > 0 ? "secondary" : "outline"}>
                  ₹{player.walletBalance}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span>Total Spent:</span>
                  <span>₹{player.totalSpent || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Sessions:</span>
                  <span>{player.sessionsCount || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Member Since:</span>
                  <span>{new Date(player.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => setSelectedPlayer(player)}
                  >
                    Top Up Wallet
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Top Up Wallet - {player.name}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Current Balance</p>
                      <p className="text-2xl font-bold text-green-600">₹{player.walletBalance}</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="topup">Top Up Amount</Label>
                      <Input
                        id="topup"
                        type="number"
                        value={topUpAmount}
                        onChange={(e) => setTopUpAmount(e.target.value)}
                        placeholder="Enter amount to add"
                      />
                    </div>
                    <Button 
                      onClick={() => topUpWallet(player.id)} 
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      Add to Wallet
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ))}
      </div>

      {players.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500 mb-4">No players registered yet</p>
            <p className="text-sm text-gray-400">Add your first player to get started</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PlayerManagement;
