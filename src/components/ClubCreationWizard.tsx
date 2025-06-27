import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useClub } from '@/contexts/ClubContext';
import { useAuth } from '@/contexts/AuthContext';
import { Club, MenuItem, StaffMember, Table } from '@/types/club';
import { toast } from 'sonner';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

interface ClubCreationWizardProps {
  onComplete: () => void;
}

const ClubCreationWizard = ({ onComplete }: ClubCreationWizardProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [clubData, setClubData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    tableCount: 1,
    ratePerHour: 100,
    menu: [] as MenuItem[],
    staff: [] as StaffMember[]
  });
  
  const { addClub } = useClub();
  const { currentUser } = useAuth();

  const steps = [
    { id: 1, title: 'Basic Info', description: 'Club details' },
    { id: 2, title: 'Tables', description: 'Setup tables' },
    { id: 3, title: 'Menu', description: 'Add menu items' },
    { id: 4, title: 'Staff', description: 'Add staff members' }
  ];

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    // Create tables array
    const tables: Table[] = Array.from({ length: clubData.tableCount }, (_, i) => ({
      id: `table_${i + 1}`,
      number: i + 1,
      ratePerHour: clubData.ratePerHour,
      isActive: true,
      description: `Table ${i + 1}`
    }));

    const newClub: Club = {
      id: `club_${Date.now()}`,
      name: clubData.name,
      address: clubData.address,
      contactInfo: {
        phone: clubData.phone,
        email: clubData.email
      },
      tables: tables,
      menu: clubData.menu,
      staff: clubData.staff,
      plan: 'basic',
      ownerId: currentUser?.id || '',
      createdAt: new Date().toISOString(),
      settings: {
        bookingSettings: {
          advanceBookingDays: 30,
          cancellationPolicy: 'Free cancellation up to 2 hours before booking',
          requireDeposit: false,
          depositAmount: 0,
          allowRecurringBookings: true
        },
        operatingHours: {
          'monday': { isOpen: true, openTime: '09:00', closeTime: '23:00' },
          'tuesday': { isOpen: true, openTime: '09:00', closeTime: '23:00' },
          'wednesday': { isOpen: true, openTime: '09:00', closeTime: '23:00' },
          'thursday': { isOpen: true, openTime: '09:00', closeTime: '23:00' },
          'friday': { isOpen: true, openTime: '09:00', closeTime: '23:00' },
          'saturday': { isOpen: true, openTime: '09:00', closeTime: '23:00' },
          'sunday': { isOpen: true, openTime: '09:00', closeTime: '23:00' }
        }
      }
    };

    addClub(newClub);
    toast.success('Club created successfully!');
    onComplete();
  };

  const addMenuItem = () => {
    const newItem: MenuItem = {
      id: `item_${Date.now()}`,
      name: '',
      price: 0,
      category: 'food',
      isAvailable: true,
      description: ''
    };
    setClubData(prev => ({ ...prev, menu: [...prev.menu, newItem] }));
  };

  const addStaffMember = () => {
    const newStaff: StaffMember = {
      id: `staff_${Date.now()}`,
      name: '',
      role: 'staff',
      pin: '',
      assignedClubs: [],
      permissions: {
        canCreateBookings: true,
        canCancelBookings: false,
        canManagePayments: false,
        canViewReports: false,
        canManageMenu: false,
        canManageInventory: false
      },
      createdAt: new Date().toISOString(),
      isActive: true
    };
    setClubData(prev => ({ ...prev, staff: [...prev.staff, newStaff] }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="clubName">Club Name</Label>
              <Input
                id="clubName"
                value={clubData.name}
                onChange={(e) => setClubData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter club name"
              />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={clubData.address}
                onChange={(e) => setClubData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Enter club address"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={clubData.phone}
                  onChange={(e) => setClubData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Phone number"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={clubData.email}
                  onChange={(e) => setClubData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Email address"
                />
              </div>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="tableCount">Number of Tables</Label>
              <Input
                id="tableCount"
                type="number"
                min="1"
                value={clubData.tableCount}
                onChange={(e) => setClubData(prev => ({ ...prev, tableCount: parseInt(e.target.value) || 1 }))}
              />
            </div>
            <div>
              <Label htmlFor="ratePerHour">Rate per Hour (₹)</Label>
              <Input
                id="ratePerHour"
                type="number"
                min="0"
                value={clubData.ratePerHour}
                onChange={(e) => setClubData(prev => ({ ...prev, ratePerHour: parseInt(e.target.value) || 0 }))}
              />
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Menu Items</h3>
              <Button onClick={addMenuItem} size="sm">Add Item</Button>
            </div>
            <div className="space-y-3">
              {clubData.menu.map((item, index) => (
                <div key={item.id} className="grid grid-cols-3 gap-2 p-3 border rounded-lg">
                  <Input
                    placeholder="Item name"
                    value={item.name}
                    onChange={(e) => {
                      const newMenu = [...clubData.menu];
                      newMenu[index].name = e.target.value;
                      setClubData(prev => ({ ...prev, menu: newMenu }));
                    }}
                  />
                  <Input
                    type="number"
                    placeholder="Price"
                    value={item.price}
                    onChange={(e) => {
                      const newMenu = [...clubData.menu];
                      newMenu[index].price = parseInt(e.target.value) || 0;
                      setClubData(prev => ({ ...prev, menu: newMenu }));
                    }}
                  />
                  <select
                    value={item.category}
                    onChange={(e) => {
                      const newMenu = [...clubData.menu];
                      newMenu[index].category = e.target.value as 'food' | 'beverage';
                      setClubData(prev => ({ ...prev, menu: newMenu }));
                    }}
                    className="px-3 py-2 border rounded-md"
                  >
                    <option value="food">Food</option>
                    <option value="beverage">Beverage</option>
                  </select>
                </div>
              ))}
              {clubData.menu.length === 0 && (
                <p className="text-gray-500 text-center py-4">No menu items added yet</p>
              )}
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Staff Members</h3>
              <Button onClick={addStaffMember} size="sm">Add Staff</Button>
            </div>
            <div className="space-y-3">
              {clubData.staff.map((staff, index) => (
                <div key={staff.id} className="grid grid-cols-3 gap-2 p-3 border rounded-lg">
                  <Input
                    placeholder="Staff name"
                    value={staff.name}
                    onChange={(e) => {
                      const newStaff = [...clubData.staff];
                      newStaff[index].name = e.target.value;
                      setClubData(prev => ({ ...prev, staff: newStaff }));
                    }}
                  />
                  <Input
                    placeholder="PIN"
                    value={staff.pin}
                    onChange={(e) => {
                      const newStaff = [...clubData.staff];
                      newStaff[index].pin = e.target.value;
                      setClubData(prev => ({ ...prev, staff: newStaff }));
                    }}
                  />
                  <select
                    value={staff.role}
                    onChange={(e) => {
                      const newStaff = [...clubData.staff];
                      newStaff[index].role = e.target.value as 'staff' | 'manager';
                      setClubData(prev => ({ ...prev, staff: newStaff }));
                    }}
                    className="px-3 py-2 border rounded-md"
                  >
                    <option value="staff">Staff</option>
                    <option value="manager">Manager</option>
                  </select>
                </div>
              ))}
              {clubData.staff.length === 0 && (
                <p className="text-gray-500 text-center py-4">No staff members added yet</p>
              )}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Create New Club</CardTitle>
          <div className="flex items-center space-x-2 mt-4">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className={`flex items-center space-x-2 ${
                  currentStep >= step.id ? 'text-green-600' : 'text-gray-400'
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    currentStep >= step.id ? 'border-green-600 bg-green-600 text-white' : 'border-gray-300'
                  }`}>
                    {currentStep > step.id ? <Check className="w-4 h-4" /> : step.id}
                  </div>
                  <div className="hidden md:block">
                    <p className="font-medium">{step.title}</p>
                    <p className="text-xs">{step.description}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-8 h-0.5 ${
                    currentStep > step.id ? 'bg-green-600' : 'bg-gray-300'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="min-h-[400px]">
            {renderStep()}
          </div>
          
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            
            <Button onClick={handleNext}>
              {currentStep === 4 ? 'Create Club' : 'Next'}
              {currentStep < 4 && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClubCreationWizard;
