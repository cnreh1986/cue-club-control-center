
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const LoginScreen = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('staff');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleLogin = () => {
    if (!identifier || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    const success = login({ identifier, password, role: selectedRole });
    if (success) {
      toast.success('Login successful!');
    } else {
      toast.error('Invalid credentials');
    }
  };

  const roleConfigs = {
    owner: {
      title: 'Owner Login',
      placeholder: 'Enter password',
      inputType: 'password',
      color: 'bg-purple-600',
      demo: 'Demo: admin123'
    },
    staff: {
      title: 'Staff Login',
      placeholder: 'Enter PIN',
      inputType: 'password',
      color: 'bg-blue-600',
      demo: 'Demo: 1234'
    },
    player: {
      title: 'Player Login',
      placeholder: 'Enter mobile/username',
      inputType: 'text',
      color: 'bg-green-600',
      demo: 'Demo: Coming soon'
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">CT</span>
          </div>
          <CardTitle className="text-2xl">Cui Tip Snooker Club</CardTitle>
          <p className="text-gray-600">Management System</p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div>
            <Label className="text-sm font-medium mb-3 block">Select Your Role</Label>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(roleConfigs) as UserRole[]).map((role) => (
                <Button
                  key={role}
                  variant={selectedRole === role ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedRole(role)}
                  className={selectedRole === role ? roleConfigs[role].color : ''}
                >
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">{roleConfigs[selectedRole].title}</Label>
              <Input
                type="text"
                placeholder="Username/Mobile"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label className="text-sm font-medium">Password/PIN</Label>
              <Input
                type={roleConfigs[selectedRole].inputType}
                placeholder={roleConfigs[selectedRole].placeholder}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1"
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>

            <Badge variant="secondary" className="w-full justify-center">
              {roleConfigs[selectedRole].demo}
            </Badge>

            <Button 
              onClick={handleLogin}
              className={`w-full ${roleConfigs[selectedRole].color}`}
              disabled={selectedRole === 'player'}
            >
              {selectedRole === 'player' ? 'Coming Soon' : 'Login'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginScreen;
