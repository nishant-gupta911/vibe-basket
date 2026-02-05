'use client';

import Link from 'next/link';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { PremiumButton } from '@/design-system/components/premium-button';
import { PremiumCard } from '@/design-system/components/premium-card';
import { Layout } from '@/components/layout/Layout';
import { Reveal, Scale, Fade } from '@/design-system/components/motion';

export default function NotFoundPage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-md mx-auto text-center">
          <Reveal>
            <PremiumCard variant="glass" className="p-8">
              <Scale delay={0.1}>
                <div className="text-8xl font-bold bg-gradient-to-br from-primary to-primary/50 bg-clip-text text-transparent mb-4">
                  404
                </div>
              </Scale>
              <Fade delay={0.2}>
                <h1 className="text-2xl font-bold text-foreground mb-2">Page Not Found</h1>
                <p className="text-muted-foreground mb-8">
                  Sorry, the page you&apos;re looking for doesn&apos;t exist or has been moved.
                </p>
              </Fade>
              <Fade delay={0.3}>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/">
                    <PremiumButton variant="premium" className="gap-2 w-full sm:w-auto">
                      <Home size={16} />
                      Go Home
                    </PremiumButton>
                  </Link>
                  <PremiumButton
                    variant="outline"
                    onClick={() => window.history.back()}
                    className="gap-2"
                  >
                    <ArrowLeft size={16} />
                    Go Back
                  </PremiumButton>
                </div>
              </Fade>
            </PremiumCard>
          </Reveal>
        </div>
      </div>
    </Layout>
  );
}
