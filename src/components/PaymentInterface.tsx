
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { toast } from '@/hooks/use-toast';

const PaymentInterface = () => {
  const [transactions, setTransactions] = useLocalStorage('transactions', []);
  const [sessions] = useLocalStorage('sessions', []);
  const [orders] = useLocalStorage('orders', []);
  
  const [payment, setPayment] = useState({
    amount: '',
    method: 'cash',
    description: '',
    tip: '',
  });

  const paymentMethods = [
    { id: 'cash', label: 'Cash', icon: '💵' },
    { id: 'upi', label: 'UPI', icon: '📱' },
    { id: 'card', label: 'Card', icon: '💳' },
    { id: 'wallet', label: 'Wallet', icon: '🪙' },
  ];

  const processPayment = () => {
    if (!payment.amount || Number(payment.amount) <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    const transactionData = {
      id: Date.now(),
      amount: Number(payment.amount),
      tip: Number(payment.tip) || 0,
      method: payment.method,
      description: payment.description,
      timestamp: new Date().toISOString(),
      type: 'income',
    };

    setTransactions([...transactions, transactionData]);
    setPayment({ amount: '', method: 'cash', description: '', tip: '' });

    toast({
      title: "Payment Processed",
      description: `₹${transactionData.amount} received via ${payment.method}`,
    });
  };

  // Calculate today's payment summary
  const today = new Date().toDateString();
  const todayTransactions = transactions.filter((t: any) => 
    new Date(t.timestamp).toDateString() === today
  );

  const paymentSummary = paymentMethods.map(method => {
    const methodTransactions = todayTransactions.filter((t: any) => t.method === method.id);
    const total = methodTransactions.reduce((sum: number, t: any) => sum + t.amount + (t.tip || 0), 0);
    const count = methodTransactions.length;
    
    return {
      ...method,
      total,
      count,
    };
  });

  const totalRevenue = todayTransactions.reduce((sum: number, t: any) => 
    sum + t.amount + (t.tip || 0), 0
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Payment Interface</h2>
        <div className="text-right">
          <p className="text-sm text-gray-600">Today's Total</p>
          <p className="text-2xl font-bold text-green-600">₹{totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Process Payment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input
                id="amount"
                type="number"
                value={payment.amount}
                onChange={(e) => setPayment({...payment, amount: e.target.value})}
                placeholder="Enter amount"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tip">Tip (₹)</Label>
              <Input
                id="tip"
                type="number"
                value={payment.tip}
                onChange={(e) => setPayment({...payment, tip: e.target.value})}
                placeholder="Enter tip amount (optional)"
              />
            </div>

            <div className="space-y-2">
              <Label>Payment Method</Label>
              <div className="grid grid-cols-2 gap-2">
                {paymentMethods.map((method) => (
                  <Button
                    key={method.id}
                    variant={payment.method === method.id ? "default" : "outline"}
                    onClick={() => setPayment({...payment, method: method.id})}
                    className="flex items-center space-x-2"
                  >
                    <span>{method.icon}</span>
                    <span>{method.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={payment.description}
                onChange={(e) => setPayment({...payment, description: e.target.value})}
                placeholder="Payment description (optional)"
              />
            </div>

            {(Number(payment.amount) > 0 || Number(payment.tip) > 0) && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span>Amount:</span>
                  <span>₹{Number(payment.amount) || 0}</span>
                </div>
                {Number(payment.tip) > 0 && (
                  <div className="flex justify-between items-center mb-2">
                    <span>Tip:</span>
                    <span>₹{Number(payment.tip)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center font-bold border-t pt-2">
                  <span>Total:</span>
                  <span>₹{(Number(payment.amount) || 0) + (Number(payment.tip) || 0)}</span>
                </div>
              </div>
            )}

            <Button 
              onClick={processPayment}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Process Payment
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Today's Payment Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {paymentSummary.map((method) => (
                <div key={method.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{method.icon}</span>
                    <div>
                      <p className="font-medium">{method.label}</p>
                      <p className="text-sm text-gray-600">{method.count} transactions</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">₹{method.total.toFixed(2)}</p>
                  </div>
                </div>
              ))}
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center font-bold text-lg">
                  <span>Total Revenue:</span>
                  <span className="text-green-600">₹{totalRevenue.toFixed(2)}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {todayTransactions.length} total transactions today
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {todayTransactions.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No transactions today</p>
          ) : (
            <div className="space-y-3">
              {todayTransactions.slice(-10).reverse().map((transaction: any) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">
                      {paymentMethods.find(m => m.id === transaction.method)?.icon || '💰'}
                    </span>
                    <div>
                      <p className="font-medium">
                        {paymentMethods.find(m => m.id === transaction.method)?.label || 'Unknown'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(transaction.timestamp).toLocaleTimeString()}
                      </p>
                      {transaction.description && (
                        <p className="text-xs text-gray-500">{transaction.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">₹{transaction.amount}</p>
                    {transaction.tip > 0 && (
                      <p className="text-sm text-green-600">+₹{transaction.tip} tip</p>
                    )}
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

export default PaymentInterface;
