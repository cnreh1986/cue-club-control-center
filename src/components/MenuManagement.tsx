
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { toast } from '@/hooks/use-toast';

const MenuManagement = () => {
  const [menuItems, setMenuItems] = useLocalStorage('menuItems', [
    { id: 1, name: 'Tea', category: 'Beverages', price: 15, available: true },
    { id: 2, name: 'Coffee', category: 'Beverages', price: 20, available: true },
    { id: 3, name: 'Samosa', category: 'Snacks', price: 12, available: true },
    { id: 4, name: 'Sandwich', category: 'Snacks', price: 50, available: true },
  ]);
  
  const [orders, setOrders] = useLocalStorage('orders', []);
  const [currentOrder, setCurrentOrder] = useState([]);
  const [newItem, setNewItem] = useState({
    name: '',
    category: 'Beverages',
    price: '',
  });

  const categories = ['Beverages', 'Snacks', 'Main Course', 'Desserts'];

  const addMenuItem = () => {
    if (!newItem.name || !newItem.price) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const itemData = {
      id: Date.now(),
      ...newItem,
      price: Number(newItem.price),
      available: true,
    };

    setMenuItems([...menuItems, itemData]);
    setNewItem({ name: '', category: 'Beverages', price: '' });

    toast({
      title: "Menu Item Added",
      description: `${newItem.name} has been added to the menu`,
    });
  };

  const addToOrder = (item: any) => {
    const existingItem = currentOrder.find((orderItem: any) => orderItem.id === item.id);
    
    if (existingItem) {
      setCurrentOrder(currentOrder.map((orderItem: any) =>
        orderItem.id === item.id 
          ? { ...orderItem, quantity: orderItem.quantity + 1 }
          : orderItem
      ));
    } else {
      setCurrentOrder([...currentOrder, { ...item, quantity: 1 }]);
    }
  };

  const removeFromOrder = (itemId: number) => {
    setCurrentOrder(currentOrder.filter((item: any) => item.id !== itemId));
  };

  const updateQuantity = (itemId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromOrder(itemId);
      return;
    }
    
    setCurrentOrder(currentOrder.map((item: any) =>
      item.id === itemId ? { ...item, quantity } : item
    ));
  };

  const calculateTotal = () => {
    return currentOrder.reduce((total: number, item: any) => 
      total + (item.price * item.quantity), 0
    );
  };

  const placeOrder = () => {
    if (currentOrder.length === 0) {
      toast({
        title: "Error",
        description: "Please add items to the order",
        variant: "destructive",
      });
      return;
    }

    const orderData = {
      id: Date.now(),
      items: currentOrder,
      total: calculateTotal(),
      timestamp: new Date().toISOString(),
      status: 'Pending',
    };

    setOrders([...orders, orderData]);
    setCurrentOrder([]);

    toast({
      title: "Order Placed",
      description: `Order for ₹${calculateTotal()} has been placed`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Menu & Orders</h2>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Add Menu Item</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Menu Item</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="itemName">Item Name</Label>
                  <Input
                    id="itemName"
                    value={newItem.name}
                    onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                    placeholder="Enter item name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    className="w-full p-2 border rounded-md"
                    value={newItem.category}
                    onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={newItem.price}
                    onChange={(e) => setNewItem({...newItem, price: e.target.value})}
                    placeholder="Enter price"
                  />
                </div>
                <Button onClick={addMenuItem} className="w-full bg-green-600 hover:bg-green-700">
                  Add Item
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {categories.map((category) => {
            const categoryItems = menuItems.filter((item: any) => item.category === category);
            if (categoryItems.length === 0) return null;

            return (
              <Card key={category}>
                <CardHeader>
                  <CardTitle>{category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {categoryItems.map((item: any) => (
                      <div 
                        key={item.id} 
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-600">₹{item.price}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={item.available ? "secondary" : "outline"}>
                            {item.available ? "Available" : "Unavailable"}
                          </Badge>
                          {item.available && (
                            <Button 
                              size="sm" 
                              onClick={() => addToOrder(item)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Add
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div>
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Current Order</CardTitle>
            </CardHeader>
            <CardContent>
              {currentOrder.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No items in order</p>
              ) : (
                <div className="space-y-3">
                  {currentOrder.map((item: any) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-gray-600">₹{item.price} each</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          -
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => removeFromOrder(item.id)}
                        >
                          ×
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  <div className="border-t pt-3 mt-4">
                    <div className="flex justify-between font-bold">
                      <span>Total:</span>
                      <span>₹{calculateTotal()}</span>
                    </div>
                    <Button 
                      onClick={placeOrder}
                      className="w-full mt-3 bg-green-600 hover:bg-green-700"
                    >
                      Place Order
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MenuManagement;
