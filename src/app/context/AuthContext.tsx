import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, CartItem, RentalItem, Product } from '../types';
import { supabase } from '../lib/supabaseClient';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, phone: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  rentals: RentalItem[];
  addRental: (rental: RentalItem) => void;
  userProducts: Product[];
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  allProducts: Product[];
  newFoodNotifications: Product[];
  clearFoodNotifications: () => void;
  updateUser: (userData: Partial<User>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [rentals, setRentals] = useState<RentalItem[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [userProducts, setUserProducts] = useState<Product[]>([]);
  const [newFoodNotifications, setNewFoodNotifications] = useState<Product[]>([]);

  // Helper to map DB record to frontend Product structure
  const mapProduct = (p: any): Product => ({
    id: p.id,
    name: p.name,
    description: p.description,
    price: Number(p.price),
    category: p.category,
    image: p.image,
    images: p.images,
    sellerId: p.seller_id,
    sellerName: p.seller_name,
    available: p.available,
    sold: p.sold,
    type: p.type,
    rentDuration: p.rent_duration,
    rentPrice: p.rent_price ? Number(p.rent_price) : undefined,
    lateFeePerDay: p.late_fee_per_day ? Number(p.late_fee_per_day) : undefined,
    expiresAt: p.expires_at,
    createdAt: p.created_at,
    reviews: p.reviews ? p.reviews.map((r: any) => ({
      id: r.id,
      userId: r.user_id,
      userName: r.user_name,
      rating: r.rating,
      comment: r.comment,
      date: r.created_at.split('T')[0],
    })) : [],
  });

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, reviews(*)');

      if (error) {
        console.error('Error fetching products:', error.message);
        return;
      }

      if (data) {
        setAllProducts(data.map(mapProduct));
      }
    } catch (err) {
      console.error('Unexpected error fetching products:', err);
    }
  };

  const handleSession = async (session: any) => {
    if (session?.user) {
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();

        if (profile && !error) {
          setUser({
            id: profile.id,
            email: profile.email,
            phone: profile.phone,
            name: profile.name,
          });
        } else {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            phone: session.user.user_metadata?.phone || '',
            name: session.user.user_metadata?.name || '',
          });
        }
      } catch (err) {
        console.error('Error handling session profile retrieval:', err);
      }
    } else {
      setUser(null);
    }
  };

  // Load user session and listen for auth changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      handleSession(session);
    });

    fetchProducts();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Listen to Postgres insertion changes on products for new food items
  useEffect(() => {
    const channel = supabase
      .channel('realtime-food-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'products',
          filter: 'category=eq.food',
        },
        (payload) => {
          const newProduct = payload.new;
          setNewFoodNotifications(prev => [...prev, mapProduct(newProduct)]);
          fetchProducts(); // Refresh list to show new food items
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Load user's cart and rentals from localStorage
  useEffect(() => {
    if (user) {
      const storedCart = localStorage.getItem(`cart_${user.id}`);
      const storedRentals = localStorage.getItem(`rentals_${user.id}`);

      if (storedCart) setCart(JSON.parse(storedCart));
      else setCart([]);

      if (storedRentals) setRentals(JSON.parse(storedRentals));
      else setRentals([]);
    } else {
      setCart([]);
      setRentals([]);
    }
  }, [user]);

  // Load user's products when user/allProducts change
  useEffect(() => {
    if (user) {
      const userProds = allProducts.filter(p => p.sellerId === user.id);
      setUserProducts(userProds);
    } else {
      setUserProducts([]);
    }
  }, [user, allProducts]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(`cart_${user.id}`, JSON.stringify(cart));
    }
  }, [cart, user]);

  // Save rentals to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(`rentals_${user.id}`, JSON.stringify(rentals));
    }
  }, [rentals, user]);

  const signup = async (email: string, phone: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            phone,
          }
        }
      });

      if (error) {
        console.error('Signup error:', error.message);
        return { success: false, error: error.message };
      }

      return { success: data.user !== null, error: data.user ? undefined : 'Failed to register user.' };
    } catch (error: any) {
      console.error('Error during signup:', error);
      return { success: false, error: error.message || 'An unexpected error occurred during signup.' };
    }
  };

  const login = async (emailOrPhone: string, password: string): Promise<boolean> => {
    try {
      let email = emailOrPhone;

      // If logging in by phone number, resolve the email from the profiles table
      if (!emailOrPhone.includes('@')) {
        const { data, error } = await supabase
          .from('profiles')
          .select('email')
          .eq('phone', emailOrPhone)
          .maybeSingle();

        if (data && !error) {
          email = data.email;
        } else {
          console.error('Login profile resolution error or phone number not found');
          return false;
        }
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error.message);
        return false;
      }

      return !!data.user;
    } catch (error) {
      console.error('Error during login:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const addToCart = (item: CartItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === item.product.id);
      if (existing) {
        return prev.map(i => 
          i.product.id === item.product.id 
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    setCart(prev => 
      prev.map(item => 
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const addRental = (rental: RentalItem) => {
    setRentals(prev => [...prev, rental]);
  };

  const addProduct = async (product: Product) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('products')
        .insert({
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
          image: product.image,
          images: product.images || [product.image],
          seller_id: user.id,
          seller_name: user.name,
          available: product.available,
          sold: 0,
          type: product.type,
          rent_duration: product.rentDuration || null,
          rent_price: product.rentPrice || null,
          late_fee_per_day: product.lateFeePerDay || null,
          expires_at: product.expiresAt || null,
        });

      if (error) {
        console.error('Error listing product:', error.message);
        throw error;
      }

      await fetchProducts();
    } catch (error) {
      console.error('Error during addProduct:', error);
    }
  };

  const updateProduct = async (product: Product) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
          image: product.image,
          images: product.images,
          available: product.available,
          sold: product.sold,
          type: product.type,
          rent_duration: product.rentDuration || null,
          rent_price: product.rentPrice || null,
          late_fee_per_day: product.lateFeePerDay || null,
          expires_at: product.expiresAt || null,
        })
        .eq('id', product.id);

      if (error) {
        console.error('Error updating product:', error.message);
        throw error;
      }

      await fetchProducts();
    } catch (error) {
      console.error('Error during updateProduct:', error);
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) {
        console.error('Error deleting product:', error.message);
        throw error;
      }

      await fetchProducts();
    } catch (error) {
      console.error('Error during deleteProduct:', error);
    }
  };

  const clearFoodNotifications = () => {
    setNewFoodNotifications([]);
  };

  const updateUser = async (userData: Partial<User>): Promise<boolean> => {
    if (!user) return false;
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: userData.name,
          phone: userData.phone,
          email: userData.email,
        })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating profile:', error.message);
        return false;
      }

      setUser(prev => prev ? { ...prev, ...userData } : null);
      return true;
    } catch (error) {
      console.error('Error during updateUser:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      signup,
      logout,
      cart,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      rentals,
      addRental,
      userProducts,
      addProduct,
      updateProduct,
      deleteProduct,
      allProducts,
      newFoodNotifications,
      clearFoodNotifications,
      updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}