'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Package, Heart, MapPin, CreditCard, LogOut, Settings } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();

  if (!isAuthenticated || !user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in to view your profile</h1>
          <Link href="/login">
            <Button className="bg-primary hover:bg-primary/90">Sign In</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    router.push('/');
  };

  const menuItems = [
    { icon: Package, label: 'My Orders', href: '#', count: 3 },
    { icon: Heart, label: 'Wishlist', href: '#', count: 12 },
    { icon: MapPin, label: 'Addresses', href: '#' },
    { icon: CreditCard, label: 'Payment Methods', href: '#' },
    { icon: Settings, label: 'Account Settings', href: '#' },
  ];

  return (
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
                <h1 className="text-2xl font-bold text-foreground">{user.name}</h1>
                <p className="text-muted-foreground">{user.email}</p>
                <p className="text-sm text-muted-foreground mt-1">Member since January 2024</p>
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
              { label: 'Orders', value: '12' },
              { label: 'Wishlist', value: '24' },
              { label: 'Reviews', value: '8' },
              { label: 'Points', value: '1,250' },
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
                <a
                  key={index}
                  href={item.href}
                  className="flex items-center justify-between px-4 py-4 hover:bg-secondary/50 transition-colors border-b border-border last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={20} className="text-muted-foreground" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {item.count && (
                    <span className="bg-secondary text-secondary-foreground text-sm px-2 py-0.5 rounded-full">
                      {item.count}
                    </span>
                  )}
                </a>
              ))}
            </nav>
          </div>

          {/* Recent Orders Preview */}
          <div className="bg-card rounded-xl border border-border mt-6 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-semibold">Recent Orders</h2>
              <a href="#" className="text-primary text-sm hover:underline">
                View All
              </a>
            </div>
            <div className="p-6 text-center text-muted-foreground">
              <Package size={40} className="mx-auto mb-3 opacity-50" />
              <p>No orders yet</p>
              <Link href="/products">
                <Button variant="link" className="text-primary mt-2">
                  Start shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
