'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Product, Category } from '@/types';
import apiClient from '@/lib/api';
import { X, Upload } from 'lucide-react';

interface ProductFormModalProps {
  mode: 'create' | 'edit'; // 'create' atau 'edit'
  productId?: number | null; // Hanya diperlukan jika mode='edit'
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  categories: Category[];
}

const initialFormState = {
  id: 0,
  name: '',
  price: '',
  stock: 0,
  image: null,
  is_active: null,
  category: { id: 0, name: '' },
  created_at: '',
  updated_at: '',
};

export function ProductFormModal({
  mode,
  productId,
  isOpen,
  onClose,
  onSave,
  categories,
}: ProductFormModalProps) {
  const [formData, setFormData] = useState<Partial<Product>>(initialFormState);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch product detail saat modal dibuka dengan mode edit
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && productId) {
        fetchProductDetail();
      } else if (mode === 'create') {
        // Reset form untuk create
        setFormData(initialFormState);
        setImageFile(null);
        setImagePreview(null);
        setError(null);
      }
    }
  }, [isOpen, mode, productId]);

  const fetchProductDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get(`/products/${productId}`);
      const product = response.data.data;
      setFormData(product);
      setImagePreview(product.image);
      setImageFile(null);
    } catch (err) {
      console.error('Error fetching product:', err);
      setError('Gagal mengambil data product');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      // Preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      const data = new FormData();
      data.append('name', formData.name || '');
      data.append('price', (formData.price || '').toString());
      data.append('stock', (formData.stock || 0).toString());
      data.append('category_id', (formData.category?.id || categories[0]?.id || 1).toString());

      if (imageFile) {
        data.append('image', imageFile);
      }

      let response;

      if (mode === 'create') {
        response = await apiClient.post('/products', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        // penting: method spoofing di body, bukan query
        data.append('_method', 'PUT');

        response = await apiClient.post(`/products/${formData.id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      onSave();
      onClose();
    } catch (err: any) {
      console.error('Full error:', err);
      console.error('Error response:', err.response?.data);
      setError(err.response?.data?.message || 'Gagal menyimpan product');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  const title = mode === 'create' ? 'Tambah Product Baru' : 'Edit Product';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="py-8 text-center">Loading...</div>
        ) : (
          <div className="space-y-6">
            {error && (
              <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            {/* Image Section */}
            <div className="space-y-3">
              <Label>Product Image</Label>
              <div className="flex gap-4">
                {/* Preview */}
                <div className="w-32 h-32 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 overflow-hidden">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center text-gray-400">
                      <Upload className="w-6 h-6 mx-auto mb-1" />
                      <p className="text-xs">No Image</p>
                    </div>
                  )}
                </div>

                {/* Upload Input */}
                <div className="flex-1">
                  <label className="flex flex-col items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-coffee-400 bg-gray-50 hover:bg-gray-100 transition">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Click untuk upload</span> atau drag and drop
                      </p>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>

                  {imageFile && (
                    <button
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview(formData.image_url as string);
                      }}
                      className="mt-3 text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
                    >
                      <X className="w-4 h-4" />
                      Remove new image
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Espresso"
                  value={formData.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="border-coffee-200 focus:border-coffee-600"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price (Rp) *</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="e.g., 25000"
                  value={formData.price || ''}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  className="border-coffee-200 focus:border-coffee-600"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock">Stock *</Label>
                <Input
                  id="stock"
                  type="number"
                  placeholder="e.g., 50"
                  value={formData.stock || 0}
                  onChange={(e) => handleInputChange('stock', parseInt(e.target.value))}
                  className="border-coffee-200 focus:border-coffee-600"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={formData.category?.id || (categories[0]?.id || 0)}
                  onChange={(e) => {
                    const categoryId = parseInt(e.target.value);
                    const selectedCategory = categories.find(c => c.id === categoryId);
                    if (selectedCategory) {
                      handleInputChange('category', selectedCategory);
                    }
                  }}
                  className="w-full px-3 py-2 border border-coffee-200 rounded-md focus:border-coffee-600 focus:ring-1 focus:ring-coffee-600"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving || loading}
            className="bg-coffee-700 hover:bg-coffee-800"
          >
            {saving ? 'Saving...' : mode === 'create' ? 'Add Product' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}