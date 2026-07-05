import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Product } from '../types';
import { toast } from 'sonner';
import { X, Upload } from 'lucide-react';

interface AddProductDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (product: Product) => void;
  userId: string;
  userName: string;
}

export function AddProductDialog({ isOpen, onClose, onAddProduct, userId, userName }: AddProductDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    images: [] as string[],
    available: '',
    type: 'sell' as 'sell' | 'rent',
    rentDuration: '',
    rentPrice: '',
    lateFeePerDay: '',
    expiresAt: '',
  });

  const [newImageUrl, setNewImageUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // In a real app, you would upload these to a server
      // For now, we'll create data URLs for preview
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const imageUrl = reader.result as string;
          setFormData(prev => ({
            ...prev,
            images: [...prev.images, imageUrl]
          }));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.description || !formData.category || !formData.available) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Make images mandatory
    if (formData.images.length === 0) {
      toast.error('Please upload at least one product image');
      return;
    }

    if (formData.type === 'sell' && !formData.price) {
      toast.error('Please enter a price');
      return;
    }

    if (formData.type === 'rent' && (!formData.rentPrice || !formData.rentDuration)) {
      toast.error('Please fill in rental details');
      return;
    }

    if (formData.category === 'food' && !formData.expiresAt) {
      toast.error('Food items must have an expiration date/time');
      return;
    }

    const productImages = formData.images;

    const newProduct: Product = {
      id: `user-${Date.now()}`,
      name: formData.name,
      description: formData.description,
      price: formData.type === 'sell' ? parseFloat(formData.price) : 0,
      category: formData.category as any,
      image: productImages[0],
      images: productImages,
      sellerId: userId,
      sellerName: userName,
      available: parseInt(formData.available),
      sold: 0,
      reviews: [],
      type: formData.type,
      rentDuration: formData.type === 'rent' ? parseInt(formData.rentDuration) : undefined,
      rentPrice: formData.type === 'rent' ? parseFloat(formData.rentPrice) : undefined,
      lateFeePerDay: formData.type === 'rent' && formData.lateFeePerDay ? parseFloat(formData.lateFeePerDay) : undefined,
      createdAt: new Date().toISOString(),
      expiresAt: formData.expiresAt || undefined,
    };

    onAddProduct(newProduct);
    
    // Show notification for food items
    if (formData.category === 'food') {
      toast.success('🍔 Food item listed! Users will be notified.', { duration: 5000 });
    } else {
      toast.success('Product listed successfully!');
    }
    
    // Reset form
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      images: [],
      available: '',
      type: 'sell',
      rentDuration: '',
      rentPrice: '',
      lateFeePerDay: '',
      expiresAt: '',
    });
    
    onClose();
  };

  const addImage = () => {
    if (newImageUrl && !formData.images.includes(newImageUrl)) {
      setFormData({ ...formData, images: [...formData.images, newImageUrl] });
      setNewImageUrl('');
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: updatedImages });
  };

  const categories = [
    { value: 'poster', label: 'Poster' },
    { value: 'wallpaper', label: 'Wallpaper' },
    { value: 'drawing', label: 'Drawing' },
    { value: 'sketch', label: 'Sketch' },
    { value: 'painting', label: 'Painting' },
    { value: 'labcoat', label: 'Lab Coat' },
    { value: 'calculator', label: 'Calculator' },
    { value: 'textbook', label: 'Textbook' },
    { value: 'hostel-essential', label: 'Hostel Essential' },
    { value: 'food', label: 'Food 🍔' },
    { value: 'others', label: 'Others' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>List New Product</DialogTitle>
          <DialogDescription>Enter the details of the product you want to list.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                placeholder="Enter product name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe your product"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          {/* Product Images */}
          <div className="space-y-2">
            <Label>Product Images * (Required)</Label>
            {formData.images.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mb-2">
                {formData.images.map((img, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden border">
                    <img src={img} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {/* File Upload Button */}
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full mb-2"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Images from Device
              </Button>
            </div>

            {/* OR Divider */}
            <div className="flex items-center gap-2 my-2">
              <div className="flex-1 border-t border-gray-300" />
              <span className="text-sm text-gray-500">OR</span>
              <div className="flex-1 border-t border-gray-300" />
            </div>

            {/* URL Input */}
            <div className="flex gap-2">
              <Input
                placeholder="Enter image URL"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
              />
              <Button type="button" onClick={addImage} variant="outline">
                Add
              </Button>
            </div>
            <p className="text-xs text-amber-700 font-medium">⚠️ At least one image is required to list your product</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type *</Label>
              <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sell">For Sale</SelectItem>
                  <SelectItem value="rent">For Rent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="available">Quantity Available *</Label>
              <Input
                id="available"
                type="number"
                min="0"
                placeholder="Enter quantity"
                value={formData.available}
                onChange={(e) => setFormData({ ...formData, available: e.target.value })}
              />
            </div>
          </div>

          {formData.type === 'sell' ? (
            <div className="space-y-2">
              <Label htmlFor="price">Price (₹) *</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                placeholder="Enter price"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rentPrice">Rental Price (₹) *</Label>
                <Input
                  id="rentPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Price"
                  value={formData.rentPrice}
                  onChange={(e) => setFormData({ ...formData, rentPrice: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rentDuration">Duration (days) *</Label>
                <Input
                  id="rentDuration"
                  type="number"
                  min="1"
                  placeholder="Days"
                  value={formData.rentDuration}
                  onChange={(e) => setFormData({ ...formData, rentDuration: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lateFee">Late Fee/Day (₹)</Label>
                <Input
                  id="lateFee"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Fee"
                  value={formData.lateFeePerDay}
                  onChange={(e) => setFormData({ ...formData, lateFeePerDay: e.target.value })}
                />
              </div>
            </div>
          )}

          {formData.category === 'food' && (
            <div className="space-y-2 p-4 bg-orange-50 rounded-lg border border-orange-200">
              <Label htmlFor="expiresAt" className="text-orange-700">Available Until * 🍔</Label>
              <Input
                id="expiresAt"
                type="datetime-local"
                value={formData.expiresAt}
                onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                className="border-orange-300"
              />
              <p className="text-xs text-orange-700">Food items are available for a limited time. Users will be notified when you list this item.</p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">List Product</Button>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}