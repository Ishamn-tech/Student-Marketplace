import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { CreditCard, Smartphone, Building2, Wallet, QrCode } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../lib/supabaseClient';

export default function Checkout() {
  const { user, cart, clearCart } = useAuth();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('upi');
  
  // Delivery details
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  
  // UPI
  const [upiId, setUpiId] = useState('');
  const [showUpiScanner, setShowUpiScanner] = useState(false);
  
  // Card
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');
  
  // Net banking
  const [selectedBank, setSelectedBank] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user && cart.length === 0) {
      navigate('/cart');
    }
  }, [user, cart, navigate]);

  if (!user) {
    return null;
  }

  if (cart.length === 0) {
    return null;
  }

  const subtotal = cart.reduce((sum, item) => {
    const price = item.product.type === 'rent' ? item.product.rentPrice : item.product.price;
    return sum + (price || 0) * item.quantity;
  }, 0);

  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  const handlePlaceOrder = async () => {
    if (!deliveryDate || !deliveryTime) {
      toast.error('Please select delivery date and time');
      return;
    }

    // Validation based on payment method
    if (paymentMethod === 'upi' && !upiId && !showUpiScanner) {
      toast.error('Please enter UPI ID or scan QR code');
      return;
    }

    if (paymentMethod === 'card') {
      if (!cardNumber || !cardName || !cardExpiry || !cardCVV) {
        toast.error('Please fill in all card details');
        return;
      }
      if (cardNumber.length !== 16) {
        toast.error('Card number must be 16 digits');
        return;
      }
      if (cardCVV.length !== 3) {
        toast.error('CVV must be 3 digits');
        return;
      }
    }

    if (paymentMethod === 'netbanking' && !selectedBank) {
      toast.error('Please select a bank');
      return;
    }

    const paymentMethodName = {
      upi: 'UPI',
      card: 'Card',
      netbanking: 'Net Banking',
      cash: 'Cash on Delivery'
    }[paymentMethod];

    try {
      // 1. Create order record
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total: total,
          payment_method: paymentMethod,
          status: 'completed',
          delivery_date: deliveryDate,
          delivery_time: deliveryTime,
        })
        .select()
        .single();

      if (orderError) {
        console.error('Error creating order:', orderError.message);
        toast.error('Failed to place order in database');
        return;
      }

      // 2. Create order items
      const orderItemsToInsert = cart.map(item => ({
        order_id: orderData.id,
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.type === 'rent' ? (item.product.rentPrice || 0) : item.product.price,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItemsToInsert);

      if (itemsError) {
        console.error('Error creating order items:', itemsError.message);
      }

      // 3. Handle rentals if there are rental items in the cart
      const rentalItems = cart.filter(item => item.product.type === 'rent');
      if (rentalItems.length > 0) {
        const rentalsToInsert = rentalItems.map(item => {
          const rentedDate = new Date();
          const returnDate = new Date();
          returnDate.setDate(rentedDate.getDate() + (item.product.rentDuration || 7));
          return {
            user_id: user.id,
            product_id: item.product.id,
            rented_date: rentedDate.toISOString(),
            return_date: returnDate.toISOString(),
            late_fee: 0,
          };
        });

        const { error: rentalsError } = await supabase
          .from('rentals')
          .insert(rentalsToInsert);

        if (rentalsError) {
          console.error('Error creating rentals:', rentalsError.message);
        }
      }

      toast.success(`Order placed successfully via ${paymentMethodName}!`);
      clearCart();
      navigate('/');
    } catch (err) {
      console.error('Unexpected error placing order:', err);
      toast.error('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-700 to-orange-700 bg-clip-text text-transparent mb-8">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Details */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-amber-900">Delivery Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="deliveryDate">Delivery Date</Label>
                    <Input
                      id="deliveryDate"
                      type="date"
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deliveryTime">Delivery Time</Label>
                    <Input
                      id="deliveryTime"
                      type="time"
                      value={deliveryTime}
                      onChange={(e) => setDeliveryTime(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Delivery Address</Label>
                  <Input
                    id="address"
                    placeholder="Enter your hostel/room details"
                    defaultValue="Hostel Block A, Room 204"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-amber-900">Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
                  <div className="space-y-3">
                    {/* UPI */}
                    <div className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                      <RadioGroupItem value="upi" id="upi" />
                      <Label htmlFor="upi" className="flex items-center gap-3 cursor-pointer flex-1">
                        <Smartphone className="h-5 w-5 text-purple-600" />
                        <div>
                          <div className="font-semibold">UPI</div>
                          <div className="text-sm text-gray-600">Pay via UPI ID or QR Code</div>
                        </div>
                      </Label>
                    </div>

                    {paymentMethod === 'upi' && (
                      <div className="ml-8 space-y-3">
                        <div className="space-y-2">
                          <Label htmlFor="upiId">UPI ID</Label>
                          <Input
                            id="upiId"
                            placeholder="yourname@upi"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                          />
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-600 mb-2">OR</p>
                          <Button 
                            variant="outline" 
                            onClick={() => setShowUpiScanner(!showUpiScanner)}
                          >
                            <QrCode className="h-4 w-4 mr-2" />
                            {showUpiScanner ? 'Hide' : 'Show'} Seller's QR Code
                          </Button>
                          {showUpiScanner && (
                            <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                              <div className="bg-white p-4 rounded-lg inline-block">
                                <QrCode className="h-32 w-32 text-gray-400" />
                                <p className="text-sm text-gray-600 mt-2">Scan to pay</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Card */}
                    <div className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex items-center gap-3 cursor-pointer flex-1">
                        <CreditCard className="h-5 w-5 text-blue-600" />
                        <div>
                          <div className="font-semibold">Credit/Debit Card</div>
                          <div className="text-sm text-gray-600">Visa, Mastercard, RuPay</div>
                        </div>
                      </Label>
                    </div>

                    {paymentMethod === 'card' && (
                      <div className="ml-8 space-y-3">
                        <div className="space-y-2">
                          <Label htmlFor="cardNumber">Card Number</Label>
                          <Input
                            id="cardNumber"
                            placeholder="1234 5678 9012 3456"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cardName">Cardholder Name</Label>
                          <Input
                            id="cardName"
                            placeholder="John Doe"
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="cardExpiry">Expiry Date</Label>
                            <Input
                              id="cardExpiry"
                              placeholder="MM/YY"
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cardCVV">CVV</Label>
                            <Input
                              id="cardCVV"
                              placeholder="123"
                              value={cardCVV}
                              onChange={(e) => setCardCVV(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Net Banking */}
                    <div className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                      <RadioGroupItem value="netbanking" id="netbanking" />
                      <Label htmlFor="netbanking" className="flex items-center gap-3 cursor-pointer flex-1">
                        <Building2 className="h-5 w-5 text-green-600" />
                        <div>
                          <div className="font-semibold">Net Banking</div>
                          <div className="text-sm text-gray-600">All major banks supported</div>
                        </div>
                      </Label>
                    </div>

                    {paymentMethod === 'netbanking' && (
                      <div className="ml-8 space-y-3">
                        <Select
                          value={selectedBank}
                          onValueChange={(value) => setSelectedBank(value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a bank" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sbi">State Bank of India</SelectItem>
                            <SelectItem value="icici">ICICI Bank</SelectItem>
                            <SelectItem value="hdfc">HDFC Bank</SelectItem>
                            <SelectItem value="axis">Axis Bank</SelectItem>
                            <SelectItem value="yes">YES Bank</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {/* Cash */}
                    <div className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                      <RadioGroupItem value="cash" id="cash" />
                      <Label htmlFor="cash" className="flex items-center gap-3 cursor-pointer flex-1">
                        <Wallet className="h-5 w-5 text-orange-600" />
                        <div>
                          <div className="font-semibold">Cash on Delivery</div>
                          <div className="text-sm text-gray-600">Pay when you receive</div>
                        </div>
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 border-0 shadow-2xl bg-gradient-to-br from-amber-600 to-orange-600 text-white">
              <CardHeader>
                <CardTitle className="text-2xl text-white">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Items */}
                <div className="space-y-2">
                  {cart.map((item) => {
                    const price = item.product.type === 'rent' ? item.product.rentPrice : item.product.price;
                    return (
                      <div key={item.product.id} className="flex justify-between text-sm">
                        <span className="text-white/90">
                          {item.product.name} x{item.quantity}
                        </span>
                        <span className="text-white font-semibold">₹{((price || 0) * item.quantity).toFixed(2)}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-white/30 pt-4 space-y-3">
                  <div className="flex justify-between text-white/90">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-white/90">
                    <span>Tax (5%)</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-white/30 pt-3 flex justify-between font-bold text-2xl text-white">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>

                <Button 
                  className="w-full bg-white text-amber-700 hover:bg-gray-100 shadow-xl font-semibold" 
                  size="lg"
                  onClick={handlePlaceOrder}
                >
                  Place Order
                </Button>

                <p className="text-xs text-white/80 text-center">
                  By placing this order, you agree to our terms and conditions
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}