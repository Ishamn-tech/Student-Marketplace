import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { ShoppingBag, Package, Clock, User, ShoppingCart, LogOut, Sparkles } from 'lucide-react';
import { FoodNotificationModal } from '../components/FoodNotificationModal';
import { useState } from 'react';

export default function Home() {
  const { user, logout, cart, newFoodNotifications, clearFoodNotifications } = useAuth();
  const navigate = useNavigate();
  const [showFoodModal, setShowFoodModal] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Show food notifications when user logs in
  useEffect(() => {
    if (user && newFoodNotifications.length > 0) {
      setShowFoodModal(true);
    }
  }, [user, newFoodNotifications]);

  const handleCloseFoodModal = () => {
    setShowFoodModal(false);
    clearFoodNotifications();
  };

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-amber-800 via-orange-700 to-amber-800 shadow-lg border-b border-amber-900/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-amber-600 p-2.5 rounded-xl shadow-lg">
              <ShoppingBag className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">
                Student Marketplace
              </h1>
              <p className="text-xs text-white/80">Your campus marketplace</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg border border-white/20">
              <User className="h-5 w-5 text-white" />
              <span className="font-medium text-white">{user.name}</span>
            </div>
            <Link to="/cart">
              <Button variant="outline" size="sm" className="relative bg-white/10 text-white border-white/30 hover:bg-white/20 shadow-sm">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Cart
                {cartItemsCount > 0 && (
                  <span className="ml-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow-lg">
                    {cartItemsCount}
                  </span>
                )}
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={handleLogout} className="bg-white/10 text-white border-white/30 hover:bg-white/20 shadow-sm">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <Sparkles className="h-12 w-12 text-yellow-500 animate-pulse" />
          </div>
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-amber-700 via-orange-700 to-red-700 bg-clip-text text-transparent">
              Welcome to Student Marketplace
            </span>
          </h2>
          <p className="text-2xl text-gray-700 font-medium">
            Buy, Sell, or Rent - Everything students need! ✨
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Sell Card */}
          <Link to="/sell" className="group">
            <Card className="h-full border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50 transform hover:-translate-y-2">
              <CardHeader className="pb-4">
                <div className="bg-gradient-to-br from-amber-600 to-orange-600 p-5 rounded-2xl w-fit mx-auto mb-4 shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110">
                  <Package className="h-14 w-14 text-white" />
                </div>
                <CardTitle className="text-3xl text-center bg-gradient-to-r from-amber-700 to-orange-700 bg-clip-text text-transparent">
                  Sell
                </CardTitle>
                <CardDescription className="text-center text-base">
                  List your items and earn money
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-gray-700 mb-6">
                  <li className="flex items-center gap-2">
                    <span className="text-amber-600">✓</span> Posters & Wallpapers
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-amber-600">✓</span> Drawings & Paintings
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-amber-600">✓</span> Lab Coats & Calculators
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-amber-600">✓</span> Food & Textbooks
                  </li>
                </ul>
                <Button className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-lg text-base py-6">
                  Start Selling →
                </Button>
              </CardContent>
            </Card>
          </Link>

          {/* Buy Card */}
          <Link to="/buy" className="group">
            <Card className="h-full border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden bg-gradient-to-br from-orange-50 to-red-50 transform hover:-translate-y-2">
              <CardHeader className="pb-4">
                <div className="bg-gradient-to-br from-orange-600 to-red-600 p-5 rounded-2xl w-fit mx-auto mb-4 shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110">
                  <ShoppingBag className="h-14 w-14 text-white" />
                </div>
                <CardTitle className="text-3xl text-center bg-gradient-to-r from-orange-700 to-red-700 bg-clip-text text-transparent">
                  Buy
                </CardTitle>
                <CardDescription className="text-center text-base">
                  Browse and purchase items
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-gray-700 mb-6">
                  <li className="flex items-center gap-2">
                    <span className="text-orange-600">✓</span> Wide range of products
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-orange-600">✓</span> Student-friendly prices
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-orange-600">✓</span> Verified sellers
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-orange-600">✓</span> Multiple payment options
                  </li>
                </ul>
                <Button className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 shadow-lg text-base py-6">
                  Browse Products →
                </Button>
              </CardContent>
            </Card>
          </Link>

          {/* Rent Card */}
          <Link to="/rent" className="group">
            <Card className="h-full border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden bg-gradient-to-br from-yellow-50 to-amber-50 transform hover:-translate-y-2">
              <CardHeader className="pb-4">
                <div className="bg-gradient-to-br from-yellow-600 to-amber-600 p-5 rounded-2xl w-fit mx-auto mb-4 shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110">
                  <Clock className="h-14 w-14 text-white" />
                </div>
                <CardTitle className="text-3xl text-center bg-gradient-to-r from-yellow-700 to-amber-700 bg-clip-text text-transparent">
                  Rent
                </CardTitle>
                <CardDescription className="text-center text-base">
                  Rent study materials temporarily
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-gray-700 mb-6">
                  <li className="flex items-center gap-2">
                    <span className="text-amber-600">✓</span> Question Papers (QP)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-amber-600">✓</span> Module Prints
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-amber-600">✓</span> Short-term rentals
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-amber-600">✓</span> Pre-order if unavailable
                  </li>
                </ul>
                <Button className="w-full bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 shadow-lg text-base py-6">
                  View Rentals →
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Info Section */}
        <div className="bg-gradient-to-br from-amber-700 via-orange-700 to-red-700 rounded-3xl shadow-2xl p-10 text-white">
          <h3 className="text-3xl font-bold mb-8 text-center">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="text-5xl font-bold mb-4 text-white/90">1</div>
              <h4 className="font-bold text-xl mb-3">Create Account</h4>
              <p className="text-white/90">
                Sign up with your email and phone number to get started
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="text-5xl font-bold mb-4 text-white/90">2</div>
              <h4 className="font-bold text-xl mb-3">Buy, Sell, or Rent</h4>
              <p className="text-white/90">
                Choose your preferred transaction type and browse items
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="text-5xl font-bold mb-4 text-white/90">3</div>
              <h4 className="font-bold text-xl mb-3">Complete Transaction</h4>
              <p className="text-white/90">
                Select payment method and confirm delivery details
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Food Notification Modal */}
      <FoodNotificationModal
        isOpen={showFoodModal}
        onClose={handleCloseFoodModal}
        foodProducts={newFoodNotifications}
      />
    </div>
  );
}