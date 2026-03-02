'use client';

import { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { PremiumButton } from '@/design-system/components/premium-button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/features/auth/useAuth';
import { useRouter } from 'next/navigation';
import { adminProductService, AdminProductInput } from '@/features/admin/adminProductService';
import { Product } from '@/types';
import { toast } from 'sonner';

export default function AdminProductsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [form, setForm] = useState<AdminProductInput>({
    title: '',
    description: '',
    category: '',
    price: 0,
    image: '',
    inStock: true,
    stock: 0,
    tags: [],
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (user?.role !== 'admin') {
      router.push('/products');
      return;
    }
    fetchProducts();
  }, [isAuthenticated, router, user?.role]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await adminProductService.list();
      setProducts(response.data.products || []);
    } catch {
      toast.error('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      await adminProductService.create({
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        tags: form.tags || [],
      });
      toast.success('Product created');
      setForm({
        title: '',
        description: '',
        category: '',
        price: 0,
        image: '',
        inStock: true,
        stock: 0,
        tags: [],
      });
      fetchProducts();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to create product');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await adminProductService.remove(id);
      toast.success('Product deleted');
      setProducts(products.filter((item) => item.id !== id));
    } catch {
      toast.error('Failed to delete product');
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Products</h1>
          <p className="text-muted-foreground">Create and manage products.</p>
        </div>

        <div className="grid gap-4 max-w-2xl bg-card border border-border rounded-2xl p-6">
          <Input
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <Textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <Input
            placeholder="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              placeholder="Price"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
            />
            <Input
              type="number"
              placeholder="Stock"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
            />
          </div>
          <Input
            placeholder="Image URL"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
          />
          <Input
            placeholder="Tags (comma separated)"
            value={form.tags?.join(', ') || ''}
            onChange={(e) => setForm({ ...form, tags: e.target.value.split(',').map((tag) => tag.trim()).filter(Boolean) })}
          />
          <PremiumButton variant="premium" onClick={handleCreate}>
            Create Product
          </PremiumButton>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Existing Products</h2>
          {isLoading ? (
            <p className="text-muted-foreground">Loading products...</p>
          ) : (
            <div className="grid gap-3">
              {products.map((product) => (
                <div key={product.id} className="flex items-center justify-between bg-card border border-border rounded-xl p-4">
                  <div>
                    <p className="font-medium text-foreground">{product.name}</p>
                    <p className="text-sm text-muted-foreground">{product.category}</p>
                  </div>
                  <PremiumButton variant="outline" onClick={() => handleDelete(product.id)}>
                    Delete
                  </PremiumButton>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
