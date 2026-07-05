import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { ShoppingBag, Trash2, Plus, Minus } from 'lucide-react';
import { toast } from 'sonner';

export default function Cart() {
  const { user, cart, updateCartQuantity, removeFromCart } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const subtotal = cart.reduce((sum, item) => {
    const price = item.product.type === 'rent' ? item.product.rentPrice : item.product.price;
    return sum + (price || 0) * item.quantity;
  }, 0);

  const tax = subtotal * 0.05; // 5% tax
  const total = subtotal + tax;

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-8">
          Shopping Cart
        </h1>

        {cart.length === 0 ? (
          <Card className="border-0 shadow-2xl bg-white/70 backdrop-blur-sm">
            <CardContent className="py-20 text-center">
              <ShoppingBag className="h-20 w-20 mx-auto mb-6 text-orange-400" />
              <p className="text-2xl text-gray-700 font-semibold mb-2">Your cart is empty</p>
              <p className="text-gray-500 mb-8">Start shopping to add items to your cart</p>
              <Button 
                onClick={() => navigate('/buy')}
                className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 shadow-lg"
                size="lg"
              >
                Browse Products
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => {
                const price = item.product.type === 'rent' ? item.product.rentPrice : item.product.price;
                return (
                  <Card key={item.product.id} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-24 h-24 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{item.product.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {item.product.description}
                          </p>
                          {item.product.type === 'rent' && (
                            <p className="text-xs text-purple-600 mb-2">
                              Rental: {item.product.rentDuration} days • ₹{item.product.lateFeePerDay}/day late fee
                            </p>
                          )}
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateCartQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center">{item.quantity}</span>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                                disabled={item.quantity >= item.product.available}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => {
                                removeFromCart(item.product.id);
                                toast.success('Item removed from cart');
                              }}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Remove
                            </Button>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">₹{(price || 0) * item.quantity}</p>
                          <p className="text-sm text-gray-600">₹{price} each</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24 border-0 shadow-2xl bg-gradient-to-br from-orange-600 to-amber-600 text-white">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-6 text-white">Order Summary</h2>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-white/90 text-base">
                      <span>Subtotal ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                      <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-white/90 text-base">
                      <span>Tax (5%)</span>
                      <span>₹{tax.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-white/30 pt-4 flex justify-between font-bold text-2xl text-white">
                      <span>Total</span>
                      <span>₹{total.toFixed(2)}</span>
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-white text-orange-600 hover:bg-gray-100 shadow-xl font-semibold" 
                    size="lg"
                    onClick={handleCheckout}
                  >
                    Proceed to Checkout
                  </Button>

                  <div className="mt-4 text-sm text-white/80 text-center">
                    <p>🔒 Safe and secure checkout</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}