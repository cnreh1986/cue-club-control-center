
export interface Club {
  id: string;
  name: string;
  address: string;
  contactInfo: {
    phone: string;
    email: string;
  };
  logo?: string;
  tables: Table[];
  menu: MenuItem[];
  staff: StaffMember[];
  plan: string;
  ownerId: string;
  createdAt: string;
  settings: ClubSettings;
}

export interface Table {
  id: string;
  number: number;
  ratePerHour: number;
  isActive: boolean;
  description?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: 'food' | 'beverage';
  description?: string;
  isAvailable: boolean;
}

export interface StaffMember {
  id: string;
  name: string;
  role: 'staff' | 'manager';
  pin: string;
  assignedClubs: string[]; // Array of club IDs
  permissions: StaffPermissions;
  createdAt: string;
  isActive: boolean;
}

export interface StaffPermissions {
  canCreateBookings: boolean;
  canCancelBookings: boolean;
  canManagePayments: boolean;
  canViewReports: boolean;
  canManageMenu: boolean;
  canManageInventory: boolean;
}

export interface ClubSettings {
  bookingSettings: {
    advanceBookingDays: number;
    cancellationPolicy: string;
    requireDeposit: boolean;
    depositAmount: number;
    allowRecurringBookings: boolean;
  };
  operatingHours: {
    [key: string]: { // day of week
      isOpen: boolean;
      openTime: string;
      closeTime: string;
    };
  };
}

export interface ClubStats {
  monthlyRevenue: number;
  activeTables: number;
  totalPlayers: number;
  totalFoodOrders: number;
  outstandingPayments: number;
  totalBookings: number;
  occupancyRate: number;
}
