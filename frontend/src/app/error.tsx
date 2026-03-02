'use client';

import { useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { PremiumButton } from '@/design-system/components/premium-button';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // No-op: avoid leaking technical errors to the UI
  }, [error]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-3">Something went wrong</h1>
        <p className="text-muted-foreground mb-6">
          We hit a snag. Please try again or return to shopping.
        </p>
        <div className="flex items-center justify-center gap-3">
          <PremiumButton variant="outline" onClick={() => reset()}>
            Try again
          </PremiumButton>
          <PremiumButton variant="premium" onClick={() => window.location.assign('/products')}>
            Go to products
          </PremiumButton>
        </div>
      </div>
    </Layout>
  );
}
