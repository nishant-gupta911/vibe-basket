'use client';

import dynamic from 'next/dynamic';

const CartPage = dynamic(() => import('@/components/pages/CartPage'), { 
  ssr: false,
  loading: () => (
    <div className="container mx-auto px-4 py-8">
      <div className="animate-pulse">
        <div className="h-10 w-48 bg-secondary rounded mb-8" />
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-secondary rounded-xl" />
            ))}
          </div>
          <div className="lg:col-span-1">
            <div className="h-64 bg-secondary rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  )
});

export default function Page() {
  return <CartPage />
}
