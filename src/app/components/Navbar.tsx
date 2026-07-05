import { Link } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, User, ShoppingCart, LogOut } from 'lucide-react';
import { Button } from './ui/button';

export function Navbar() {
  const { user, logout, cart } = useAuth();
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg-gradient-to-r from-amber-800 via-orange-700 to-amber-800 shadow-lg border-b border-amber-900/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-amber-600 p-2 rounded-lg shadow-md">
              <ShoppingBag className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white hidden sm:block">
              Student Marketplace
            </h1>
          </Link>

          <nav className="flex items-center gap-4">
            {user && (
              <>
                <Link to="/sell">
                  <Button variant="ghost" size="sm" className="text-white hover:bg-amber-700 hover:text-white">Sell</Button>
                </Link>
                <Link to="/buy">
                  <Button variant="ghost" size="sm" className="text-white hover:bg-amber-700 hover:text-white">Buy</Button>
                </Link>
                <Link to="/rent">
                  <Button variant="ghost" size="sm" className="text-white hover:bg-amber-700 hover:text-white">Rent</Button>
                </Link>
              </>
            )}
          </nav>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link to="/profile">
                  <Button variant="ghost" size="sm" className="hidden md:flex items-center gap-2 text-white hover:bg-amber-700">
                    <User className="h-4 w-4" />
                    <span>{user.name}</span>
                  </Button>
                </Link>
                <Link to="/cart">
                  <Button variant="outline" size="sm" className="relative bg-white/10 text-white border-white/30 hover:bg-white/20">
                    <ShoppingCart className="h-4 w-4" />
                    {cartItemsCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow-md">
                        {cartItemsCount}
                      </span>
                    )}
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={logout} className="bg-white/10 text-white border-white/30 hover:bg-white/20">
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm" className="bg-white/10 text-white border-white/30 hover:bg-white/20">Login</Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white shadow-md">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}