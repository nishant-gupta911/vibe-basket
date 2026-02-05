'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  // No longer blocking - allow access without authentication
  // Authentication is optional for better user experience
  return <>{children}</>;
}
