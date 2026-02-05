'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { ThemeProvider } from 'next-themes'
import { PremiumThemeProvider } from '@/design-system/theme-provider'
import { useState, useEffect } from 'react'
import { useAuth } from '@/features/auth/useAuth'

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const { checkAuth } = useAuth();

  useEffect(() => {
    // Check auth silently on app load
    checkAuth();
  }, []);

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange={false}
      >
        <PremiumThemeProvider>
          <TooltipProvider>
            <AuthInitializer>
              {children}
            </AuthInitializer>
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </PremiumThemeProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
