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

interface EditProductDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateProduct: (product: Product) => void;
  product: Product;
}

export function EditProductDialog({ isOpen, onClose, onUpdateProduct, product }: EditProductDialogProps) {
  const [formData, setFormData] = useState({
    name: product.name,
    description: product.description,
    price: product.price.toString(),
    category: product.category,
    images: product.images || [product.image],
    available: product.available.toString(),
    type: product.type,
    rentDuration: product.rentDuration?.toString() || '',
    rentPrice: product.rentPrice?.toString() || '',
    lateFeePerDay: product.lateFeePerDay?.toString() || '',
    expiresAt: product.expiresAt || '',
  });

  const [newImageUrl, setNewImageUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.description || !formData.category || !formData.available) {
      toast.error('Please fill in all required fields');
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

    const updatedProduct: Product = {
      ...product,
      name: formData.name,
      description: formData.description,
      price: formData.type === 'sell' ? parseFloat(formData.price) : 0,
      category: formData.category as any,
      image: formData.images[0] || product.image,
      images: formData.images,
      available: parseInt(formData.available),
      type: formData.type,
      rentDuration: formData.type === 'rent' ? parseInt(formData.rentDuration) : undefined,
      rentPrice: formData.type === 'rent' ? parseFloat(formData.rentPrice) : undefined,
      lateFeePerDay: formData.type === 'rent' && formData.lateFeePerDay ? parseFloat(formData.lateFeePerDay) : undefined,
      expiresAt: formData.category === 'food' ? formData.expiresAt : undefined,
    };

    onUpdateProduct(updatedProduct);
    toast.success('Product updated successfully!');
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
    if (updatedImages.length === 0) {
      toast.error('Product must have at least one image');
      return;
    }
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
    { value: 'food', label: 'Food' },
    { value: 'others', label: 'Others' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>Make changes to your product details</DialogDescription>
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
            <Label>Product Images</Label>
            <div className="grid grid-cols-4 gap-2 mb-2">
              {formData.images.map((img, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden border">
                  <img src={img} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
                  {formData.images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Enter image URL"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
              />
              <Button type="button" onClick={addImage} variant="outline">
                Add
              </Button>
              <Button type="button" onClick={() => fileInputRef.current?.click()} variant="outline">
                Upload
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setNewImageUrl(reader.result as string);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </div>
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
            <div className="space-y-2">
              <Label htmlFor="expiresAt">Available Until *</Label>
              <Input
                id="expiresAt"
                type="datetime-local"
                value={formData.expiresAt}
                onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
              />
              <p className="text-xs text-gray-600">Food items are available for a limited time</p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">Update Product</Button>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}