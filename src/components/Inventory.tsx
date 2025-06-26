
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Package, AlertTriangle, Plus, Minus } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { toast } from 'sonner';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  unit: string;
  lastUpdated: string;
}

const Inventory = () => {
  const [inventory, setInventory] = useLocalStorage<InventoryItem[]>('inventory', [
    { id: '1', name: 'Coca Cola', category: 'Beverages', currentStock: 24, minStock: 10, unit: 'bottles', lastUpdated: new Date().toISOString() },
    { id: '2', name: 'Samosa', category: 'Snacks', currentStock: 15, minStock: 20, unit: 'pieces', lastUpdated: new Date().toISOString() },
    { id: '3', name: 'Tea', category: 'Beverages', currentStock: 8, minStock: 15, unit: 'cups', lastUpdated: new Date().toISOString() },
  ]);

  const [newItem, setNewItem] = useState({
    name: '',
    category: 'Beverages',
    currentStock: 0,
    minStock: 5,
    unit: 'pieces'
  });

  const updateStock = (id: string, change: number) => {
    setInventory(inventory.map(item => 
      item.id === id 
        ? { ...item, currentStock: Math.max(0, item.currentStock + change), lastUpdated: new Date().toISOString() }
        : item
    ));
    toast.success('Stock updated successfully');
  };

  const addNewItem = () => {
    if (!newItem.name) {
      toast.error('Please enter item name');
      return;
    }

    const item: InventoryItem = {
      id: Date.now().toString(),
      ...newItem,
      lastUpdated: new Date().toISOString()
    };

    setInventory([...inventory, item]);
    setNewItem({ name: '', category: 'Beverages', currentStock: 0, minStock: 5, unit: 'pieces' });
    toast.success('Item added to inventory');
  };

  const lowStockItems = inventory.filter(item => item.currentStock <= item.minStock);
  const categories = ['Beverages', 'Snacks', 'Main Course', 'Desserts', 'Others'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center">
            <Package className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Inventory Management</h2>
            <p className="text-gray-600">Track and manage your stock levels</p>
          </div>
        </div>
      </div>

      {lowStockItems.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-orange-800">
              <AlertTriangle className="h-5 w-5" />
              <span>Low Stock Alert</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lowStockItems.map(item => (
                <div key={item.id} className="flex items-center justify-between bg-white p-3 rounded-lg">
                  <div>
                    <span className="font-medium">{item.name}</span>
                    <Badge variant="destructive" className="ml-2">Low Stock</Badge>
                  </div>
                  <span className="text-sm text-gray-600">
                    {item.currentStock}/{item.minStock} {item.unit}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Current Inventory</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {inventory.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div>
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-gray-500">{item.category}</p>
                        </div>
                        {item.currentStock <= item.minStock && (
                          <Badge variant="destructive">Low Stock</Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="font-medium">{item.currentStock} {item.unit}</div>
                        <div className="text-xs text-gray-500">Min: {item.minStock}</div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateStock(item.id, -1)}
                          disabled={item.currentStock === 0}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateStock(item.id, 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Add New Item</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Item Name</label>
                <Input
                  value={newItem.name}
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                  placeholder="Enter item name"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Category</label>
                <select
                  value={newItem.category}
                  onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                  className="w-full p-2 border rounded-md"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-sm font-medium">Current Stock</label>
                  <Input
                    type="number"
                    value={newItem.currentStock}
                    onChange={(e) => setNewItem({...newItem, currentStock: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Min Stock</label>
                  <Input
                    type="number"
                    value={newItem.minStock}
                    onChange={(e) => setNewItem({...newItem, minStock: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Unit</label>
                <Input
                  value={newItem.unit}
                  onChange={(e) => setNewItem({...newItem, unit: e.target.value})}
                  placeholder="e.g., pieces, bottles, kg"
                />
              </div>

              <Button onClick={addNewItem} className="w-full bg-orange-600 hover:bg-orange-700">
                Add Item
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
