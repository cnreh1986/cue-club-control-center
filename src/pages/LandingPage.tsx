
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Trophy, 
  Users, 
  CreditCard, 
  FileText, 
  BarChart3, 
  Shield, 
  Wifi, 
  Building2,
  Clock,
  ChefHat,
  Star,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Trophy,
      title: 'Table Management',
      description: 'Start/stop sessions, set hourly rates, and monitor usage in real time.'
    },
    {
      icon: CreditCard,
      title: 'Easy Payments',
      description: 'Record game and food payments, track dues, and accept offline transactions.'
    },
    {
      icon: ChefHat,
      title: 'Food & Beverage Orders',
      description: 'Quick ordering interface for staff, kitchen-friendly views included.'
    },
    {
      icon: FileText,
      title: 'Expense Tracking',
      description: 'Log rent, salaries, and expenses directly — integrated into your daily reports.'
    },
    {
      icon: BarChart3,
      title: 'Daily Reports',
      description: 'Instant insights into revenue, orders, and balances — exportable in PDF or CSV.'
    },
    {
      icon: Users,
      title: 'Multi-Role Access',
      description: 'Role-based dashboards for owners, staff, and players. Secure and streamlined.'
    },
    {
      icon: Wifi,
      title: 'Offline-First Design',
      description: 'Works even without internet — syncs automatically when online.'
    },
    {
      icon: Building2,
      title: 'Multi-Club Ready (V2)',
      description: 'Manage multiple branches from one account — coming soon.'
    }
  ];

  const dashboardFeatures = [
    'Total revenue today',
    'Active tables',
    'Live food orders',
    'Player dues',
    'Club-by-club performance metrics'
  ];

  const targetAudience = [
    { icon: Trophy, title: 'Snooker & Pool Club Owners' },
    { icon: Users, title: 'Club Managers' },
    { icon: ChefHat, title: 'Kitchen Staff' },
    { icon: FileText, title: 'Accountants & Auditors' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">SnookerClub Pro</span>
            </div>
            <Button 
              onClick={() => navigate('/')} 
              variant="outline"
              className="border-green-600 text-green-600 hover:bg-green-50"
            >
              Login
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Run Your Snooker & Pool Club{' '}
            <span className="text-green-600">Like a Pro.</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            From table sessions to snacks and payments — manage everything in one powerful, offline-ready platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-green-600 hover:bg-green-700 text-white px-8"
              onClick={() => navigate('/')}
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-green-600 text-green-600 hover:bg-green-50 px-8"
            >
              Book a Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Why Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why SnookerClub Pro?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            <strong>Built for Club Owners, by Club Owners.</strong>
          </p>
          <p className="text-gray-600 max-w-3xl mx-auto">
            We understand the daily challenges of managing tables, tracking payments, and keeping operations smooth during peak hours. SnookerClub Pro brings it all together in one easy-to-use platform.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Key Features</h2>
            <p className="text-lg text-gray-600">Everything you need to manage your club efficiently</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <feature.icon className="w-8 h-8 text-green-600 mb-2" />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Snapshot */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Owner Dashboard Snapshot</h2>
            <p className="text-lg text-gray-600">Keep an eye on all your clubs with:</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboardFeatures.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3 p-4 rounded-lg bg-green-50">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-800 font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Target Audience */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Who Is It For?</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {targetAudience.map((audience, index) => (
              <div key={index} className="text-center p-6 rounded-lg bg-white shadow-sm">
                <audience.icon className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-800">{audience.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
          </div>
          
          <Card className="p-8">
            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
              ))}
            </div>
            <blockquote className="text-lg text-gray-700 italic mb-4">
              "Before SnookerClub Pro, we were juggling paper logs and calculators. Now it's one tap, and everything's recorded!"
            </blockquote>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-800">Amit Sharma</p>
                <p className="text-gray-600">CueZone Billiards, Pune</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to take your club digital?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Join hundreds of snooker and pool clubs already streamlining their operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-green-600 hover:bg-gray-50 px-8"
              onClick={() => navigate('/')}
            >
              Start Free Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-green-600 px-8"
            >
              See a Live Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">SnookerClub Pro</span>
          </div>
          <p className="text-gray-400">
            © 2024 SnookerClub Pro. All rights reserved. Built with ❤️ for club owners.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
