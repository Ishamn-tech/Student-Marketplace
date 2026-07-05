import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { Navbar } from '../components/Navbar';
import { ProductCard } from '../components/ProductCard';
import { ProductDetailModal } from '../components/ProductDetailModal';
import { Input } from '../components/ui/input';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Product } from '../types';
import { Search, Info, Clock } from 'lucide-react';
import { toast } from 'sonner';

export default function Rent() {
  const { user, allProducts, addToCart } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  // Use products loaded from database via context
  const rentProducts = allProducts.filter(p => p.type === 'rent');
  
  const filteredProducts = rentProducts.filter(product => {
    return product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           product.description.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleRent = (product: any, quantity: number) => {
    addToCart({ product, quantity });
    toast.success('Added to cart for rental!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-700 to-orange-700 bg-clip-text text-transparent mb-2">
            Rent Study Materials
          </h1>
          <p className="text-gray-700">Rent question papers, module prints, and more</p>
        </div>

        {/* Info Alert */}
        <Alert className="mb-6 bg-gradient-to-r from-amber-600 to-orange-600 text-white border-0 shadow-xl">
          <Info className="h-5 w-5 text-white" />
          <AlertDescription className="text-white/95">
            <strong>Rental Policy:</strong> Return items by the due date to avoid late fees. 
            Late fees are charged per day as specified for each item. 
            You can pre-order items that are currently unavailable.
          </AlertDescription>
        </Alert>

        {/* Search */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-6 border-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search rentals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white border-gray-200"
            />
          </div>
        </div>

        {/* Results */}
        <div className="mb-6 text-gray-600 font-medium">
          {filteredProducts.length} {filteredProducts.length === 1 ? 'rental' : 'rentals'} available
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <div key={product.id} onClick={() => setSelectedProduct(product)}>
                <ProductCard
                  product={product}
                  onAddToCart={handleRent}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl">
            <div className="text-6xl mb-4">📚</div>
            <p className="text-2xl text-gray-600 mb-2">No rentals found</p>
            <p className="text-gray-500">Try adjusting your search</p>
          </div>
        )}

        {/* How Rental Works */}
        <div className="mt-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl shadow-2xl p-8 text-white">
          <div className="flex items-center gap-3 mb-6">
            <Clock className="h-8 w-8" />
            <h2 className="text-3xl font-bold">How Rental Works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="text-4xl mb-3">1️⃣</div>
              <h3 className="font-bold text-xl mb-2">Select & Rent</h3>
              <p className="text-white/90">
                Choose items and specify rental duration. Pay the rental fee.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="text-4xl mb-3">2️⃣</div>
              <h3 className="font-bold text-xl mb-2">Use & Return</h3>
              <p className="text-white/90">
                Use the materials and return them by the specified date.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="text-4xl mb-3">3️⃣</div>
              <h3 className="font-bold text-xl mb-2">Late Fees</h3>
              <p className="text-white/90">
                Late returns incur daily fees. Pre-order if items are unavailable.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleRent}
      />
    </div>
  );
}