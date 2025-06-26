
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Settings, Building, Users, CreditCard } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { toast } from 'sonner';

const AdminSettings = () => {
  const [clubSettings, setClubSettings] = useLocalStorage('clubSettings', {
    name: 'Cui Tip Snooker Club',
    address: '123 Main Street, City',
    phone: '+91 9876543210',
    email: 'info@cuitip.com',
    workingHours: '10:00 AM - 11:00 PM',
    logo: ''
  });

  const [subscriptionInfo] = useLocalStorage('subscriptionInfo', {
    plan: 'Free',
    expiryDate: null,
    features: ['Basic table management', 'Player tracking', 'Simple reporting']
  });

  const [settings, setSettings] = useState(clubSettings);

  const handleSave = () => {
    setClubSettings(settings);
    toast.success('Settings saved successfully!');
  };

  const settingSections = [
    {
      title: 'Club Information',
      icon: Building,
      fields: [
        { key: 'name', label: 'Club Name', type: 'text' },
        { key: 'address', label: 'Address', type: 'textarea' },
        { key: 'phone', label: 'Phone Number', type: 'text' },
        { key: 'email', label: 'Email', type: 'email' },
        { key: 'workingHours', label: 'Working Hours', type: 'text' }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
          <Settings className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Admin Settings</h2>
          <p className="text-gray-600">Configure your club settings and preferences</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {settingSections.map((section, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <section.icon className="h-5 w-5" />
                  <span>{section.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {section.fields.map((field) => (
                  <div key={field.key}>
                    <Label className="text-sm font-medium">{field.label}</Label>
                    {field.type === 'textarea' ? (
                      <Textarea
                        value={settings[field.key as keyof typeof settings] || ''}
                        onChange={(e) => setSettings({...settings, [field.key]: e.target.value})}
                        className="mt-1"
                      />
                    ) : (
                      <Input
                        type={field.type}
                        value={settings[field.key as keyof typeof settings] || ''}
                        onChange={(e) => setSettings({...settings, [field.key]: e.target.value})}
                        className="mt-1"
                      />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}

          <div className="flex justify-end">
            <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
              Save Settings
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Subscription</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Badge variant={subscriptionInfo.plan === 'Free' ? 'secondary' : 'default'}>
                    {subscriptionInfo.plan} Plan
                  </Badge>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Features Included:</h4>
                  <ul className="text-sm space-y-1">
                    {subscriptionInfo.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Button variant="outline" className="w-full">
                  Upgrade Plan
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Staff Management</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">Manage your staff members and their access permissions.</p>
                <Button variant="outline" className="w-full">
                  Manage Staff
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
