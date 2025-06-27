
import { Club } from '@/types/club';
import { Booking } from '@/types/booking';

export const initializeDummyData = () => {
  // Check if data already exists
  const existingClubs = localStorage.getItem('clubs');
  if (existingClubs && JSON.parse(existingClubs).length > 0) {
    return; // Data already exists
  }

  // Sample clubs
  const sampleClubs: Club[] = [
    {
      id: 'club_1',
      name: 'Royal Snooker Club',
      address: 'MG Road, Bangalore',
      phone: '+91 9876543210',
      email: 'info@royalsnooker.com',
      ownerId: '1',
      plan: 'premium',
      isActive: true,
      staff: [
        {
          id: 'staff_1',
          name: 'Raj Kumar',
          role: 'manager',
          mobile: '9876543211',
          pin: '1234'
        },
        {
          id: 'staff_2',
          name: 'Priya Sharma',
          role: 'counter',
          mobile: '9876543212',
          pin: '5678'
        }
      ],
      tables: [
        {
          id: 'table_1_1',
          number: 1,
          ratePerHour: 150,
          isActive: true,
          description: 'Premium table with LED lighting'
        },
        {
          id: 'table_1_2',
          number: 2,
          ratePerHour: 150,
          isActive: true,
          description: 'Standard tournament table'
        },
        {
          id: 'table_1_3',
          number: 3,
          ratePerHour: 120,
          isActive: true,
          description: 'Practice table'
        },
        {
          id: 'table_1_4',
          number: 4,
          ratePerHour: 120,
          isActive: true,
          description: 'Practice table'
        }
      ],
      menu: [
        {
          id: 'menu_1_1',
          name: 'Tea',
          price: 20,
          category: 'beverages',
          isAvailable: true,
          description: 'Fresh masala tea'
        },
        {
          id: 'menu_1_2',
          name: 'Coffee',
          price: 25,
          category: 'beverages',
          isAvailable: true,
          description: 'Hot coffee'
        },
        {
          id: 'menu_1_3',
          name: 'Samosa',
          price: 15,
          category: 'snacks',
          isAvailable: true,
          description: 'Crispy samosa'
        },
        {
          id: 'menu_1_4',
          name: 'Sandwich',
          price: 40,
          category: 'snacks',
          isAvailable: true,
          description: 'Veg sandwich'
        }
      ],
      settings: {
        currency: 'INR',
        timezone: 'Asia/Kolkata',
        operatingHours: {
          open: '09:00',
          close: '23:00'
        }
      }
    },
    {
      id: 'club_2',
      name: 'Elite Cue Sports',
      address: 'Brigade Road, Bangalore',
      phone: '+91 9876543213',
      email: 'contact@elitecue.com',
      ownerId: '1',
      plan: 'standard',
      isActive: true,
      staff: [
        {
          id: 'staff_3',
          name: 'Amit Singh',
          role: 'manager',
          mobile: '9876543214',
          pin: '9999'
        }
      ],
      tables: [
        {
          id: 'table_2_1',
          number: 1,
          ratePerHour: 100,
          isActive: true,
          description: 'Standard table'
        },
        {
          id: 'table_2_2',
          number: 2,
          ratePerHour: 100,
          isActive: true,
          description: 'Standard table'
        }
      ],
      menu: [
        {
          id: 'menu_2_1',
          name: 'Tea',
          price: 15,
          category: 'beverages',
          isAvailable: true
        },
        {
          id: 'menu_2_2',
          name: 'Biscuits',
          price: 20,
          category: 'snacks',
          isAvailable: true
        }
      ],
      settings: {
        currency: 'INR',
        timezone: 'Asia/Kolkata',
        operatingHours: {
          open: '10:00',
          close: '22:00'
        }
      }
    }
  ];

  // Sample bookings for today and upcoming days
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const sampleBookings: Booking[] = [
    {
      id: 'booking_1',
      clubId: 'club_1',
      tableId: 'table_1_1',
      playerId: 'player_1',
      playerName: 'Arjun Patel',
      playerMobile: '9876543215',
      startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 0).toISOString(),
      endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 16, 0).toISOString(),
      status: 'confirmed',
      notes: 'Birthday celebration booking',
      createdBy: 'staff_1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isRecurring: false,
      paymentStatus: 'paid'
    },
    {
      id: 'booking_2',
      clubId: 'club_1',
      tableId: 'table_1_2',
      playerId: 'player_2',
      playerName: 'Deepak Kumar',
      playerMobile: '9876543216',
      startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 18, 0).toISOString(),
      endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 20, 0).toISOString(),
      status: 'confirmed',
      notes: 'Regular weekly session',
      createdBy: 'staff_1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isRecurring: true,
      paymentStatus: 'pending'
    },
    {
      id: 'booking_3',
      clubId: 'club_1',
      tableId: 'table_1_3',
      playerId: 'player_3',
      playerName: 'Rahul Sharma',
      playerMobile: '9876543217',
      startTime: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 10, 0).toISOString(),
      endTime: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 12, 0).toISOString(),
      status: 'confirmed',
      notes: 'Practice session',
      createdBy: 'staff_2',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isRecurring: false,
      paymentStatus: 'none'
    }
  ];

  // Store data in localStorage
  localStorage.setItem('clubs', JSON.stringify(sampleClubs));
  
  // Store bookings for each club
  sampleClubs.forEach(club => {
    const clubBookings = sampleBookings.filter(booking => booking.clubId === club.id);
    localStorage.setItem(`bookings_${club.id}`, JSON.stringify(clubBookings));
  });

  // Update user assignments
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const updatedUsers = users.map((user: any) => {
    if (user.id === '2') { // Staff member
      return { ...user, assignedClubs: ['club_1', 'club_2'] };
    }
    return user;
  });
  localStorage.setItem('users', JSON.stringify(updatedUsers));

  console.log('Dummy data initialized successfully');
};
