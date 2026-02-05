'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/design-system/components/loading-states';

const ProfilePage = dynamic(() => import('@/components/pages/ProfilePage'), { 
  ssr: false,
  loading: () => (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-32 rounded-xl" />
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </div>
    </div>
  )
});

export default function Page() {
  return <ProfilePage />
}
