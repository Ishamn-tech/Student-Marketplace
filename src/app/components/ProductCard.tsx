import { Star, ShoppingCart } from 'lucide-react';
import { Product } from '../types';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product, quantity: number) => void;
  showAddToCart?: boolean;
}

export function ProductCard({ product, onAddToCart, showAddToCart = true }: ProductCardProps) {
  const avgRating = product.reviews.length > 0
    ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
    : 0;

  const price = product.type === 'rent' ? product.rentPrice : product.price;

  return (
    <div className="bg-white rounded-xl border hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-1 group">
      <div className="aspect-square overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>
      
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-sm line-clamp-2 flex-1">{product.name}</h3>
          {product.type === 'rent' && (
            <Badge variant="secondary" className="flex-shrink-0">Rental</Badge>
          )}
        </div>

        <p className="text-xs text-gray-600 line-clamp-2">{product.description}</p>

        <div className="flex items-center gap-1">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < Math.floor(avgRating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-600">
            ({product.reviews.length})
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-xl font-bold text-gray-900">₹{price}</div>
            {product.type === 'rent' && (
              <div className="text-xs text-gray-500">
                {product.rentDuration} days • ₹{product.lateFeePerDay}/day late fee
              </div>
            )}
          </div>
          <div className="text-xs text-gray-600">
            <div className="text-green-600">Available: {product.available}</div>
            <div>Sold: {product.sold}</div>
          </div>
        </div>

        <div className="text-xs text-gray-600">
          Seller: <span className="font-medium">{product.sellerName}</span>
        </div>

        {showAddToCart && onAddToCart && product.available > 0 && (
          <Button 
            className="w-full" 
            size="sm"
            onClick={() => onAddToCart(product, 1)}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {product.type === 'rent' ? 'Rent Now' : 'Add to Cart'}
          </Button>
        )}

        {product.available === 0 && (
          <Badge variant="destructive" className="w-full justify-center">
            Out of Stock
          </Badge>
        )}
      </div>
    </div>
  );
}
