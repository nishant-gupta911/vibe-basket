'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Package, Heart, MapPin, CreditCard, LogOut, Settings } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/features/auth/useAuth';
import { orderService, Order } from '@/features/orders/orderService';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { toast } from 'sonner';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    try {
      setIsLoadingOrders(true);
      const response = await orderService.getOrders();
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  const menuItems = [
    { icon: Package, label: 'My Orders', count: orders.length },
    { icon: Heart, label: 'Wishlist', href: '#', count: 0 },
    { icon: MapPin, label: 'Addresses', href: '#' },
    { icon: CreditCard, label: 'Payment Methods', href: '#' },
    { icon: Settings, label: 'Account Settings', href: '#' },
  ];

  return (
    <ProtectedRoute>
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Profile Header */}
            <div className="bg-card rounded-xl border border-border p-6 mb-6">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <User size={32} className="text-primary" />
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-foreground">{user?.name}</h1>
                  <p className="text-muted-foreground">{user?.email}</p>
                </div>
                <Button variant="outline" onClick={handleLogout} className="gap-2">
                  <LogOut size={16} />
                  Sign Out
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Orders', value: orders.length.toString() },
                { label: 'Wishlist', value: '0' },
                { label: 'Reviews', value: '0' },
                { label: 'Points', value: '0' },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="bg-card rounded-xl border border-border p-4 text-center"
                >
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>

          {/* Menu */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <h2 className="text-lg font-semibold p-4 border-b border-border">Account</h2>
            <nav>
              {menuItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between px-4 py-4 hover:bg-secondary/50 transition-colors border-b border-border last:border-0 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={20} className="text-muted-foreground" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {item.count !== undefined && item.count > 0 && (
                    <span className="bg-secondary text-secondary-foreground text-sm px-2 py-0.5 rounded-full">
                      {item.count}
                    </span>
                  )}
                </div>
              ))}
            </nav>
          </div>

          {/* Recent Orders Preview */}
          <div className="bg-card rounded-xl border border-border mt-6 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-semibold">Recent Orders</h2>
            </div>
            {isLoadingOrders ? (
              <div className="p-6 text-center text-muted-foreground">
                <p>Loading orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">
                <Package size={40} className="mx-auto mb-3 opacity-50" />
                <p>No orders yet</p>
                <Link href="/products">
                  <Button variant="link" className="text-primary mt-2">
                    Start shopping
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {orders.slice(0, 3).map((order) => (
                  <div key={order.id} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold">Order #{order.id}</p>
                      <span className={`text-sm px-2 py-1 rounded-full ${
                        order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                        order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    <p className="font-bold text-foreground">
                      ${order.totalAmount.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  </ProtectedRoute>
  );
}
