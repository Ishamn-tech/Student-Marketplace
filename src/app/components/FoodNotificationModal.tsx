import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Product } from '../types';
import { Clock, User, IndianRupee } from 'lucide-react';

interface FoodNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  foodProducts: Product[];
}

export function FoodNotificationModal({ isOpen, onClose, foodProducts }: FoodNotificationModalProps) {
  if (foodProducts.length === 0) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Limited time';
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <span className="text-4xl">🍔</span>
            New Food Available!
          </DialogTitle>
          <DialogDescription>
            Fresh food items have been listed on the marketplace!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {foodProducts.map((product) => (
              <div 
                key={product.id} 
                className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-200 shadow-sm"
              >
                <div className="flex gap-4">
                  {product.image && (
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900 mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                    
                    <div className="flex flex-wrap gap-3 text-sm">
                      <div className="flex items-center gap-1 text-green-700">
                        <IndianRupee className="h-3 w-3" />
                        <span className="font-semibold">₹{product.price}</span>
                      </div>
                      
                      <div className="flex items-center gap-1 text-orange-700">
                        <User className="h-3 w-3" />
                        <span>{product.sellerName}</span>
                      </div>
                      
                      {product.expiresAt && (
                        <div className="flex items-center gap-1 text-red-700">
                          <Clock className="h-3 w-3" />
                          <span>Until {formatDate(product.expiresAt)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 pt-2">
            <Button 
              onClick={onClose}
              className="flex-1 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700"
            >
              Got it! 🍕
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}