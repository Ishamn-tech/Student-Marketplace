import { Search, ShoppingCart, Menu, MapPin, User } from 'lucide-react';
import { Button } from './ui/button';

interface HeaderProps {
  onCartClick: () => void;
  cartItemsCount: number;
  onSearchChange: (value: string) => void;
  searchQuery: string;
}

export function Header({ onCartClick, cartItemsCount, onSearchChange, searchQuery }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-[#131921] text-white">
      {/* Top header */}
      <div className="px-4 py-2">
        <div className="max-w-[1500px] mx-auto flex items-center gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="text-2xl font-bold">
              <span className="text-white">shop</span>
              <span className="text-[#FF9900]">it</span>
            </div>
          </div>

          {/* Delivery Location */}
          <button className="hidden lg:flex items-center gap-1 hover:outline hover:outline-1 hover:outline-white px-2 py-1 rounded">
            <MapPin className="h-5 w-5" />
            <div className="text-left">
              <div className="text-xs text-gray-300">Deliver to</div>
              <div className="text-sm font-bold">New York 10001</div>
            </div>
          </button>

          {/* Search Bar */}
          <div className="flex-1 max-w-3xl">
            <div className="flex">
              <select className="bg-gray-200 text-gray-900 px-3 py-2 rounded-l border-none focus:outline-none">
                <option>All</option>
                <option>Electronics</option>
                <option>Wearables</option>
                <option>Gaming</option>
                <option>Cameras</option>
              </select>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="flex-1 px-4 py-2 text-gray-900 focus:outline-none"
              />
              <button className="bg-[#FF9900] hover:bg-[#F08000] px-4 py-2 rounded-r">
                <Search className="h-5 w-5 text-gray-900" />
              </button>
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center gap-4">
            <button className="hidden md:flex items-center gap-1 hover:outline hover:outline-1 hover:outline-white px-2 py-1 rounded">
              <User className="h-5 w-5" />
              <div className="text-left">
                <div className="text-xs">Hello, Sign in</div>
                <div className="text-sm font-bold">Account & Lists</div>
              </div>
            </button>

            <button className="hidden md:block hover:outline hover:outline-1 hover:outline-white px-2 py-1 rounded">
              <div className="text-xs">Returns</div>
              <div className="text-sm font-bold">& Orders</div>
            </button>

            <button
              onClick={onCartClick}
              className="flex items-center gap-2 hover:outline hover:outline-1 hover:outline-white px-2 py-1 rounded relative"
            >
              <ShoppingCart className="h-8 w-8" />
              {cartItemsCount > 0 && (
                <span className="absolute top-0 right-0 bg-[#FF9900] text-gray-900 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  {cartItemsCount}
                </span>
              )}
              <span className="font-bold">Cart</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="bg-[#232F3E] px-4 py-2">
        <div className="max-w-[1500px] mx-auto flex items-center gap-6 text-sm">
          <button className="flex items-center gap-2 hover:outline hover:outline-1 hover:outline-white px-2 py-1 rounded">
            <Menu className="h-5 w-5" />
            <span className="font-bold">All</span>
          </button>
          <button className="hover:outline hover:outline-1 hover:outline-white px-2 py-1 rounded">Today's Deals</button>
          <button className="hover:outline hover:outline-1 hover:outline-white px-2 py-1 rounded">Customer Service</button>
          <button className="hover:outline hover:outline-1 hover:outline-white px-2 py-1 rounded">Registry</button>
          <button className="hover:outline hover:outline-1 hover:outline-white px-2 py-1 rounded">Gift Cards</button>
          <button className="hover:outline hover:outline-1 hover:outline-white px-2 py-1 rounded">Sell</button>
        </div>
      </div>
    </header>
  );
}
