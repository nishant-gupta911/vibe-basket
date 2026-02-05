'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Package, Heart, MapPin, CreditCard, LogOut, Settings, CheckCircle } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { PremiumButton } from '@/design-system/components/premium-button';
import { PremiumCard } from '@/design-system/components/premium-card';
import { Reveal, Slide, Scale, StaggerContainer, HoverLift } from '@/design-system/components/motion';
import { Skeleton, EmptyState, StatusBadge } from '@/design-system/components/loading-states';
import { useAuth } from '@/features/auth/useAuth';
import { orderService, Order } from '@/features/orders/orderService';
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

  if (!isAuthenticated || !user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <Reveal>
            <PremiumCard variant="elevated" className="max-w-md mx-auto text-center p-8">
              <div className="w-20 h-20 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-4">
                <User size={40} className="text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Sign In Required</h2>
              <p className="text-muted-foreground mb-6">
                Please sign in to view your profile and order history.
              </p>
              <div className="flex gap-3 justify-center">
                <Link href="/login">
                  <PremiumButton variant="premium">Sign In</PremiumButton>
                </Link>
                <Link href="/register">
                  <PremiumButton variant="outline">Create Account</PremiumButton>
                </Link>
              </div>
            </PremiumCard>
          </Reveal>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
            {/* Profile Header */}
            <Reveal>
              <PremiumCard variant="elevated" className="p-6 mb-6">
                <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <User size={32} className="text-primary" />
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-foreground">{user?.name}</h1>
                  <p className="text-muted-foreground">{user?.email}</p>
                </div>
                <PremiumButton variant="outline" onClick={handleLogout} className="gap-2">
                  <LogOut size={16} />
                  Sign Out
                </PremiumButton>
              </div>
            </PremiumCard>
          </Reveal>

            {/* Quick Stats */}
            <Reveal delay={0.1}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Orders', value: orders.length.toString() },
                  { label: 'Wishlist', value: '0' },
                  { label: 'Reviews', value: '0' },
                  { label: 'Points', value: '0' },
                ].map((stat, index) => (
                  <Scale key={index} delay={index * 0.05}>
                    <HoverLift>
                      <PremiumCard variant="default" className="p-4 text-center">
                        <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                      </PremiumCard>
                    </HoverLift>
                  </Scale>
                ))}
              </div>
            </Reveal>

          {/* Menu */}
          <Reveal delay={0.2}>
            <PremiumCard variant="default" className="overflow-hidden">
              <h2 className="text-lg font-semibold p-4 border-b border-border">Account</h2>
              <nav>
                {menuItems.map((item, index) => (
                  <HoverLift key={index} lift={2}>
                    <div
                      className="flex items-center justify-between px-4 py-4 hover:bg-secondary/50 transition-all duration-300 border-b border-border last:border-0 cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <item.icon size={20} className="text-muted-foreground" />
                        <span className="font-medium">{item.label}</span>
                      </div>
                      {item.count !== undefined && item.count > 0 && (
                        <span className="bg-primary/10 text-primary text-sm px-2 py-0.5 rounded-full">
                          {item.count}
                        </span>
                      )}
                    </div>
                  </HoverLift>
                ))}
              </nav>
            </PremiumCard>
          </Reveal>

          {/* Recent Orders Preview */}
          <Reveal delay={0.3}>
            <PremiumCard variant="elevated" className="mt-6 overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h2 className="text-lg font-semibold">Recent Orders</h2>
              </div>
              {isLoadingOrders ? (
                <div className="p-6 space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-20" />
                  ))}
                </div>
              ) : orders.length === 0 ? (
                <div className="p-6">
                  <EmptyState
                    icon={Package}
                    title="No orders yet"
                    message="Start shopping to see your orders here"
                    action={{
                      label: 'Browse Products',
                      onClick: () => window.location.href = '/products',
                    }}
                  />
                </div>
              ) : (
                <StaggerContainer staggerDelay={0.05} className="divide-y divide-border">
                  {orders.slice(0, 3).map((order) => (
                    <Slide key={order.id} direction="left">
                      <div className="p-4 hover:bg-secondary/30 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-semibold">Order #{order.id}</p>
                          <StatusBadge
                            status={
                              order.status === 'DELIVERED' ? 'success' :
                              order.status === 'SHIPPED' ? 'info' :
                              order.status === 'PENDING' ? 'warning' :
                              'default'
                            }
                          >
                            {order.status}
                          </StatusBadge>
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
                    </Slide>
                  ))}
                </StaggerContainer>
              )}
            </PremiumCard>
          </Reveal>
        </div>
      </div>
    </Layout>
  );
}
