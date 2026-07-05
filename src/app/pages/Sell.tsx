import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { Navbar } from '../components/Navbar';
import { AddProductDialog } from '../components/AddProductDialog';
import { EditProductDialog } from '../components/EditProductDialog';
import { ProductDetailModal } from '../components/ProductDetailModal';
import { ProductCard } from '../components/ProductCard';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Product } from '../types';
import { Plus, Package, ChevronRight, Edit2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Sell() {
  const { user, allProducts, addProduct, deleteProduct, updateProduct, notifyFoodAvailable } = useAuth();
  const navigate = useNavigate();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  // Use products loaded from database via context
  const combinedProducts = allProducts;

  const categories = [
    { value: 'poster', label: 'Online Posters', icon: '🎨', color: 'from-amber-500 to-orange-500' },
    { value: 'wallpaper', label: 'Wallpaper Designs', icon: '🖼️', color: 'from-orange-500 to-red-500' },
    { value: 'drawing', label: 'Drawings', icon: '✏️', color: 'from-yellow-600 to-amber-600' },
    { value: 'sketch', label: 'Sketches', icon: '🖊️', color: 'from-amber-600 to-orange-600' },
    { value: 'painting', label: 'Paintings', icon: '🎭', color: 'from-orange-600 to-red-600' },
    { value: 'labcoat', label: 'Lab Coats', icon: '🥼', color: 'from-amber-700 to-orange-700' },
    { value: 'calculator', label: 'Calculators', icon: '🔢', color: 'from-orange-700 to-red-700' },
    { value: 'textbook', label: 'Textbooks', icon: '📚', color: 'from-amber-800 to-orange-800' },
    { value: 'hostel-essential', label: 'Hostel Essentials', icon: '🏠', color: 'from-yellow-700 to-amber-700' },
    { value: 'food', label: 'Food 🍔', icon: '🍕', color: 'from-orange-500 to-amber-500' },
    { value: 'others', label: 'Others', icon: '📦', color: 'from-stone-600 to-amber-600' }
  ];

  const getCategoryProducts = (categoryValue: string) => {
    return combinedProducts.filter(p => p.category === categoryValue && p.type === 'sell');
  };

  const userProducts = allProducts.filter(p => p.sellerId === user.id);

  const handleEditProduct = (product: Product) => {
    setProductToEdit(product);
    setIsAddDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-700 to-orange-700 bg-clip-text text-transparent mb-2">
                Sell Your Items
              </h1>
              <p className="text-gray-700">List your products and start earning</p>
            </div>
            <Button 
              onClick={() => setIsAddDialogOpen(true)} 
              className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-lg"
              size="lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              List New Product
            </Button>
          </div>
        </div>

        {/* Product Categories */}
        <Card className="mb-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-amber-900">Product Categories</CardTitle>
            <CardDescription>Click on a category to view products</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {categories.map(category => {
                const productCount = getCategoryProducts(category.value).length;
                return (
                  <div
                    key={category.value}
                    onClick={() => setSelectedCategory(selectedCategory === category.value ? null : category.value)}
                    className="group cursor-pointer"
                  >
                    <div className={`bg-gradient-to-br ${category.color} p-6 rounded-xl text-white shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300`}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-4xl">{category.icon}</div>
                        <ChevronRight className={`h-6 w-6 transition-transform duration-300 ${selectedCategory === category.value ? 'rotate-90' : ''}`} />
                      </div>
                      <h3 className="font-bold text-lg mb-1">{category.label}</h3>
                      <p className="text-white/90 text-sm">{productCount} products available</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Category Products Display */}
        {selectedCategory && (
          <Card className="mb-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-amber-900">
                {categories.find(c => c.value === selectedCategory)?.label}
              </CardTitle>
              <CardDescription>
                {getCategoryProducts(selectedCategory).length} products in this category
              </CardDescription>
            </CardHeader>
            <CardContent>
              {getCategoryProducts(selectedCategory).length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {getCategoryProducts(selectedCategory).map(product => (
                    <div key={product.id} onClick={() => setSelectedProduct(product)}>
                      <ProductCard
                        product={product}
                        showAddToCart={false}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Package className="h-16 w-16 mx-auto mb-4 text-amber-400" />
                  <p className="text-gray-600">No products in this category yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Your Listed Products */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-amber-900">Your Listed Products</CardTitle>
            <CardDescription>
              {userProducts.length} {userProducts.length === 1 ? 'product' : 'products'} listed
            </CardDescription>
          </CardHeader>
          <CardContent>
            {userProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {userProducts.map(product => (
                  <div key={product.id} className="relative group">
                    <div onClick={() => setSelectedProduct(product)}>
                      <ProductCard
                        product={product}
                        showAddToCart={false}
                      />
                    </div>
                    <Button
                      size="sm"
                      className="absolute top-2 right-2 bg-amber-600 hover:bg-amber-700 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditProduct(product);
                      }}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center">
                <Package className="h-20 w-20 mx-auto mb-4 text-amber-400" />
                <p className="text-xl text-gray-600 mb-2">No products listed yet</p>
                <p className="text-gray-500 mb-6">Start selling by listing your first product</p>
                <Button 
                  onClick={() => setIsAddDialogOpen(true)} 
                  className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
                  size="lg"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  List Your First Product
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Seller Tips */}
        <div className="mt-12 bg-gradient-to-br from-amber-700 to-orange-700 rounded-2xl shadow-2xl p-8 text-white">
          <h2 className="text-3xl font-bold mb-6">Selling Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="text-4xl mb-3">📸</div>
              <h3 className="font-bold text-xl mb-2">Quality Photos</h3>
              <p className="text-white/90">
                Use clear, well-lit photos to showcase your products
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="text-4xl mb-3">💰</div>
              <h3 className="font-bold text-xl mb-2">Fair Pricing</h3>
              <p className="text-white/90">
                Research similar products and price competitively
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="text-4xl mb-3">📝</div>
              <h3 className="font-bold text-xl mb-2">Detailed Description</h3>
              <p className="text-white/90">
                Provide complete information about condition and features
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Add Product Dialog */}
      {user && (
        <AddProductDialog
          isOpen={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          onAddProduct={addProduct}
          userId={user.id}
          userName={user.name}
        />
      )}

      {/* Edit Product Dialog */}
      {productToEdit && (
        <EditProductDialog
          isOpen={isAddDialogOpen}
          onClose={() => {
            setIsAddDialogOpen(false);
            setProductToEdit(null);
          }}
          onUpdateProduct={(updatedProduct) => {
            updateProduct(updatedProduct);
            setIsAddDialogOpen(false);
            setProductToEdit(null);
          }}
          product={productToEdit}
        />
      )}

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}