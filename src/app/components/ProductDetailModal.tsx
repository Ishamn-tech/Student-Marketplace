import { useState } from 'react';
import { Product } from '../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Star, ShoppingCart, User, Package } from 'lucide-react';
import { toast } from 'sonner';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart?: (product: Product, quantity: number) => void;
}

export function ProductDetailModal({ product, isOpen, onClose, onAddToCart }: ProductDetailModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!product) return null;

  const avgRating = product.reviews.length > 0
    ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
    : 0;

  const price = product.type === 'rent' ? product.rentPrice : product.price;

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product, quantity);
      toast.success('Added to cart!');
      onClose();
    }
  };

  const images = product.images && product.images.length > 0 ? product.images : [product.image];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{product.name}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Images */}
          <div>
            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 mb-3">
              <img
                src={images[selectedImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 ${
                      selectedImageIndex === index ? 'border-blue-600' : 'border-gray-200'
                    }`}
                  >
                    <img src={img} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-4">
            {/* Price & Type */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-gray-900">₹{price}</div>
                {product.type === 'rent' && (
                  <div className="text-sm text-gray-600 mt-1">
                    {product.rentDuration} days rental • ₹{product.lateFeePerDay}/day late fee
                  </div>
                )}
              </div>
              {product.type === 'rent' && (
                <Badge className="bg-purple-600">Rental</Badge>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(avgRating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-600">
                {avgRating.toFixed(1)} ({product.reviews.length} {product.reviews.length === 1 ? 'review' : 'reviews'})
              </span>
            </div>

            {/* Availability */}
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Package className="h-4 w-4 text-green-600" />
                <span className="text-green-600 font-medium">Available: {product.available}</span>
              </div>
              <div className="text-gray-600">Sold: {product.sold}</div>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-gray-700">{product.description}</p>
            </div>

            {/* Seller Info */}
            <div className="border-t pt-4">
              <div className="flex items-center gap-2 text-gray-700">
                <User className="h-4 w-4" />
                <span>Seller: <span className="font-medium">{product.sellerName}</span></span>
              </div>
            </div>

            {/* Add to Cart */}
            {onAddToCart && product.available > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium">Quantity:</label>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      -
                    </Button>
                    <span className="w-12 text-center">{quantity}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setQuantity(Math.min(product.available, quantity + 1))}
                    >
                      +
                    </Button>
                  </div>
                </div>
                <Button className="w-full" size="lg" onClick={handleAddToCart}>
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {product.type === 'rent' ? 'Rent Now' : 'Add to Cart'}
                </Button>
              </div>
            )}

            {product.available === 0 && (
              <Badge variant="destructive" className="w-full justify-center py-2">
                Out of Stock
              </Badge>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        {product.reviews.length > 0 && (
          <div className="mt-6 border-t pt-6">
            <h3 className="font-semibold text-lg mb-4">Customer Reviews</h3>
            <div className="space-y-4">
              {product.reviews.map((review) => (
                <div key={review.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{review.userName}</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-gray-600">{review.date}</span>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}