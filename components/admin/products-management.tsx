'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Product, Category } from '@/types';
import apiClient from '@/lib/api';
import { ProductFormModal } from './product-form-modal';

export function ProductsManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsRes, categoriesRes] = await Promise.all([
        apiClient.get('/products'),
        apiClient.get('/categories'),
      ]);
      setProducts(productsRes.data.data || []);
      setCategories(categoriesRes.data.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin mau hapus product ini?')) return;

    try {
      await apiClient.delete(`/products/${id}`);
      setProducts(products.filter((p) => p.id !== id));
      alert('Product berhasil dihapus!');
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Gagal menghapus product');
    }
  };

  const handleAddClick = () => {
    setFormMode('create');
    setEditingId(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (id: string) => {
    setFormMode('edit');
    setEditingId(parseInt(id));
    setIsFormOpen(true);
  };

  const handleSave = () => {
    fetchData(); // Refresh list setelah save
  };

  if (loading) {
    return <div className="text-center py-12 text-slate-600">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-slate-900">Products Management</h2>
        <Button
          className="gap-2 bg-amber-500 hover:bg-amber-600 text-slate-900"
          onClick={handleAddClick}
        >
          <Plus className="w-4 h-4" />
          Add Product
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-slate-900">Daftar Product</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left py-3 px-4 font-semibold text-slate-900">ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-900">Gambar</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-900">Nama Product</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-900">Harga</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-900">Stock</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-900">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 text-slate-700">{product.id}</td>
                    <td className="py-3 px-4">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-10 h-10 rounded object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded bg-slate-200 flex items-center justify-center text-xs text-slate-600">
                          No Image
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-900">{product.name}</td>
                    <td className="py-3 px-4 text-amber-600 font-semibold">Rp {Number(product.price).toLocaleString()}</td>
                    <td className="py-3 px-4 text-slate-700">{product.stock}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1"
                          onClick={() => handleEditClick(product.id)}
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="gap-1"
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                          Hapus
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Form Modal - untuk Create & Edit */}
      <ProductFormModal
        mode={formMode}
        productId={editingId}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSave}
        categories={categories}
      />
    </div>
  );
}