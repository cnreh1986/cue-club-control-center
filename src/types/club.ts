
export interface Club {
  id: string;
  name: string;
  address: string;
  contactInfo: {
    phone: string;
    email: string;
  };
  logo?: string;
  tables: {
    count: number;
    ratePerHour: number;
  };
  menu: MenuItem[];
  staff: StaffMember[];
  plan: string;
  ownerId: string;
  createdAt: string;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: 'food' | 'beverage';
  description?: string;
}

export interface StaffMember {
  id: string;
  name: string;
  role: 'staff' | 'manager';
  pin: string;
  clubId: string;
}

export interface ClubStats {
  monthlyRevenue: number;
  activeTables: number;
  totalPlayers: number;
  totalFoodOrders: number;
  outstandingPayments: number;
}
