'use client';

import * as React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

// =============================================================================
// PREMIUM CARD COMPONENT
// Unified card system with hover effects, depth, and variants
// =============================================================================

interface PremiumCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'glass' | 'interactive';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  radius?: 'sm' | 'md' | 'lg' | 'xl';
  hoverable?: boolean;
  clickable?: boolean;
  glow?: boolean;
}

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

const radiusStyles = {
  sm: 'rounded-lg',
  md: 'rounded-xl',
  lg: 'rounded-2xl',
  xl: 'rounded-3xl',
};

const PremiumCard = React.forwardRef<HTMLDivElement, PremiumCardProps>(
  (
    {
      className,
      variant = 'default',
      padding = 'md',
      radius = 'lg',
      hoverable = false,
      clickable = false,
      glow = false,
      children,
      ...props
    },
    ref
  ) => {
    const variantStyles = {
      default: 'bg-card border border-border shadow-sm',
      elevated: 'bg-card shadow-lg shadow-black/5 dark:shadow-black/20',
      outlined: 'bg-transparent border-2 border-border',
      glass: [
        'bg-white/70 dark:bg-black/40',
        'backdrop-blur-xl backdrop-saturate-150',
        'border border-white/20 dark:border-white/10',
      ].join(' '),
      interactive: [
        'bg-card border border-border shadow-sm',
        'transition-all duration-500 ease-out',
        'hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-black/30',
        'hover:-translate-y-2 hover:border-primary/30',
      ].join(' '),
    };

    return (
      <div
        ref={ref}
        className={cn(
          'relative overflow-hidden',
          radiusStyles[radius],
          paddingStyles[padding],
          variantStyles[variant],
          hoverable && variant !== 'interactive' && [
            'transition-all duration-500',
            'hover:shadow-lg hover:-translate-y-1',
          ],
          clickable && 'cursor-pointer',
          glow && 'hover:shadow-primary/20',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

PremiumCard.displayName = 'PremiumCard';

// =============================================================================
// CARD HEADER
// =============================================================================

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, title, subtitle, action, children, ...props }, ref) => {
    if (children) {
      return (
        <div ref={ref} className={cn('mb-4', className)} {...props}>
          {children}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn('flex items-start justify-between mb-4', className)}
        {...props}
      >
        <div>
          {title && (
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          )}
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

// =============================================================================
// CARD CONTENT
// =============================================================================

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('', className)} {...props} />
));

CardContent.displayName = 'CardContent';

// =============================================================================
// CARD FOOTER
// =============================================================================

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('mt-4 pt-4 border-t border-border', className)}
    {...props}
  />
));

CardFooter.displayName = 'CardFooter';

// =============================================================================
// PREMIUM IMAGE CARD
// For product, category, and editorial cards
// =============================================================================

interface ImageCardProps extends React.HTMLAttributes<HTMLDivElement> {
  src: string;
  alt: string;
  aspectRatio?: 'square' | 'portrait' | 'landscape' | 'cinema';
  overlay?: 'none' | 'gradient' | 'dark' | 'light';
  hoverZoom?: boolean;
  badge?: React.ReactNode;
  children?: React.ReactNode;
}

const aspectRatioStyles = {
  square: 'aspect-square',
  portrait: 'aspect-[3/4]',
  landscape: 'aspect-[4/3]',
  cinema: 'aspect-[16/9]',
};

const overlayStyles = {
  none: '',
  gradient: 'after:absolute after:inset-0 after:bg-gradient-to-t after:from-black/60 after:via-black/20 after:to-transparent',
  dark: 'after:absolute after:inset-0 after:bg-black/40',
  light: 'after:absolute after:inset-0 after:bg-white/40',
};

const ImageCard = React.forwardRef<HTMLDivElement, ImageCardProps>(
  (
    {
      className,
      src,
      alt,
      aspectRatio = 'portrait',
      overlay = 'gradient',
      hoverZoom = true,
      badge,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'relative overflow-hidden rounded-2xl group',
          aspectRatioStyles[aspectRatio],
          overlayStyles[overlay],
          className
        )}
        {...props}
      >
        {/* Image */}
        <Image
          src={src}
          alt={alt}
          fill
          className={cn(
            'object-cover transition-transform duration-700',
            hoverZoom && 'group-hover:scale-110'
          )}
          style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
        />

        {/* Badge */}
        {badge && (
          <div className="absolute top-4 left-4 z-10">{badge}</div>
        )}

        {/* Content Overlay */}
        {children && (
          <div className="absolute inset-0 z-10 flex flex-col justify-end p-6">
            {children}
          </div>
        )}
      </div>
    );
  }
);

ImageCard.displayName = 'ImageCard';

// =============================================================================
// SKELETON CARD (Loading State)
// =============================================================================

interface SkeletonCardProps {
  variant?: 'product' | 'category' | 'article' | 'user';
  className?: string;
}

function SkeletonCard({ variant = 'product', className }: SkeletonCardProps) {
  const variants = {
    product: (
      <div className={cn('space-y-4', className)}>
        <div className="aspect-[3/4] rounded-2xl skeleton" />
        <div className="space-y-2">
          <div className="h-4 w-3/4 rounded skeleton" />
          <div className="h-3 w-1/2 rounded skeleton" />
          <div className="h-5 w-1/4 rounded skeleton mt-2" />
        </div>
      </div>
    ),
    category: (
      <div className={cn('aspect-square rounded-2xl skeleton', className)} />
    ),
    article: (
      <div className={cn('space-y-4', className)}>
        <div className="aspect-video rounded-2xl skeleton" />
        <div className="space-y-2">
          <div className="h-5 w-full rounded skeleton" />
          <div className="h-4 w-5/6 rounded skeleton" />
          <div className="h-3 w-1/3 rounded skeleton mt-2" />
        </div>
      </div>
    ),
    user: (
      <div className={cn('flex items-center gap-4', className)}>
        <div className="w-12 h-12 rounded-full skeleton" />
        <div className="space-y-2 flex-1">
          <div className="h-4 w-1/2 rounded skeleton" />
          <div className="h-3 w-1/3 rounded skeleton" />
        </div>
      </div>
    ),
  };

  return variants[variant];
}

// =============================================================================
// EXPORTS
// =============================================================================

export {
  PremiumCard,
  CardHeader,
  CardContent,
  CardFooter,
  ImageCard,
  SkeletonCard,
};

export default PremiumCard;
