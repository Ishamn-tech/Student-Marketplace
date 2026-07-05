export interface User {
  id: string;
  email: string;
  phone: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'poster' | 'wallpaper' | 'drawing' | 'sketch' | 'painting' | 'labcoat' | 'calculator' | 'textbook' | 'hostel-essential' | 'food' | 'others';
  image: string;
  images?: string[]; // Multiple images support
  sellerId: string;
  sellerName: string;
  available: number;
  sold: number;
  reviews: Review[];
  type: 'sell' | 'rent';
  rentDuration?: number; // days
  rentPrice?: number;
  lateFeePerDay?: number;
  createdAt?: string; // For food items timestamp
  expiresAt?: string; // For food items expiry
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface RentalItem {
  product: Product;
  rentedDate: string;
  returnDate: string;
  actualReturnDate?: string;
  lateFee?: number;
}

export interface Transaction {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  paymentMethod: 'upi' | 'card' | 'netbanking' | 'cash';
  status: 'pending' | 'completed' | 'failed';
  deliveryDate?: string;
  deliveryTime?: string;
  createdAt: string;
}