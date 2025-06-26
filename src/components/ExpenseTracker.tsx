
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { toast } from '@/hooks/use-toast';

const ExpenseTracker = () => {
  const [expenses, setExpenses] = useLocalStorage('expenses', []);
  const [transactions] = useLocalStorage('transactions', []);
  
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    category: 'Operations',
    date: new Date().toISOString().split('T')[0],
  });

  const expenseCategories = [
    { id: 'Operations', label: 'Operations', icon: '⚙️' },
    { id: 'Rent', label: 'Rent', icon: '🏢' },
    { id: 'Salary', label: 'Staff Salary', icon: '👥' },
    { id: 'Utilities', label: 'Utilities', icon: '💡' },
    { id: 'Maintenance', label: 'Maintenance', icon: '🔧' },
    { id: 'Inventory', label: 'Inventory', icon: '📦' },
    { id: 'Marketing', label: 'Marketing', icon: '📢' },
    { id: 'Other', label: 'Other', icon: '📝' },
  ];

  const addExpense = () => {
    if (!newExpense.description || !newExpense.amount) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const expenseData = {
      id: Date.now(),
      ...newExpense,
      amount: Number(newExpense.amount),
      timestamp: new Date().toISOString(),
    };

    setExpenses([...expenses, expenseData]);
    setNewExpense({
      description: '',
      amount: '',
      category: 'Operations',
      date: new Date().toISOString().split('T')[0],
    });

    toast({
      title: "Expense Added",
      description: `₹${newExpense.amount} expense has been recorded`,
    });
  };

  // Calculate today's expenses and revenue
  const today = new Date().toDateString();
  const todayExpenses = expenses.filter((expense: any) => 
    new Date(expense.date).toDateString() === today
  );
  
  const todayRevenue = transactions.filter((t: any) => 
    new Date(t.timestamp).toDateString() === today
  ).reduce((sum: number, t: any) => sum + t.amount + (t.tip || 0), 0);

  const totalTodayExpenses = todayExpenses.reduce((sum: number, expense: any) => 
    sum + expense.amount, 0
  );

  const netProfit = todayRevenue - totalTodayExpenses;

  // Group expenses by category
  const expensesByCategory = expenseCategories.map(category => {
    const categoryExpenses = todayExpenses.filter((expense: any) => 
      expense.category === category.id
    );
    const total = categoryExpenses.reduce((sum: number, expense: any) => 
      sum + expense.amount, 0
    );
    
    return {
      ...category,
      total,
      count: categoryExpenses.length,
    };
  }).filter(category => category.count > 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Expense Tracker</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">Add Expense</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Expense</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Input
                  id="description"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                  placeholder="Enter expense description"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₹) *</Label>
                <Input
                  id="amount"
                  type="number"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                  placeholder="Enter amount"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  className="w-full p-2 border rounded-md"
                  value={newExpense.category}
                  onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                >
                  {expenseCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={newExpense.date}
                  onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
                />
              </div>
              <Button onClick={addExpense} className="w-full bg-green-600 hover:bg-green-700">
                Add Expense
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-red-800">Today's Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900">₹{totalTodayExpenses.toFixed(2)}</div>
            <p className="text-sm text-red-600">{todayExpenses.length} expenses</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-green-800">Today's Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">₹{todayRevenue.toFixed(2)}</div>
            <p className="text-sm text-green-600">Total earnings</p>
          </CardContent>
        </Card>

        <Card className={`bg-gradient-to-br ${netProfit >= 0 ? 'from-blue-50 to-blue-100 border-blue-200' : 'from-orange-50 to-orange-100 border-orange-200'}`}>
          <CardHeader className="pb-3">
            <CardTitle className={`text-lg ${netProfit >= 0 ? 'text-blue-800' : 'text-orange-800'}`}>
              Net Profit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netProfit >= 0 ? 'text-blue-900' : 'text-orange-900'}`}>
              ₹{netProfit.toFixed(2)}
            </div>
            <p className={`text-sm ${netProfit >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
              {netProfit >= 0 ? 'Profit today' : 'Loss today'}
            </p>
          </CardContent>
        </Card>
      </div>

      {expensesByCategory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Today's Expenses by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {expensesByCategory.map((category) => (
                <div key={category.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{category.icon}</span>
                    <div>
                      <p className="font-medium">{category.label}</p>
                      <p className="text-sm text-gray-600">{category.count} expenses</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-red-600">₹{category.total.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Recent Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          {expenses.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No expenses recorded yet</p>
          ) : (
            <div className="space-y-3">
              {expenses.slice(-10).reverse().map((expense: any) => (
                <div key={expense.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">
                      {expenseCategories.find(c => c.id === expense.category)?.icon || '📝'}
                    </span>
                    <div>
                      <p className="font-medium">{expense.description}</p>
                      <p className="text-sm text-gray-600">
                        {expenseCategories.find(c => c.id === expense.category)?.label || 'Other'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(expense.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-red-600">₹{expense.amount}</p>
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

export default ExpenseTracker;
