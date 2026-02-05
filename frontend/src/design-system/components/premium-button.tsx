'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// =============================================================================
// PREMIUM BUTTON VARIANTS
// =============================================================================

const premiumButtonVariants = cva(
  // Base styles - shared across all variants
  [
    'relative inline-flex items-center justify-center gap-2',
    'font-medium whitespace-nowrap select-none',
    'transition-all duration-300',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    'disabled:pointer-events-none disabled:opacity-50',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0',
  ].join(' '),
  {
    variants: {
      variant: {
        // Primary - Glowing premium button
        primary: [
          'bg-primary text-primary-foreground',
          'shadow-md hover:shadow-xl hover:shadow-primary/25',
          'hover:-translate-y-0.5 active:translate-y-0',
          'before:absolute before:inset-0 before:rounded-[inherit]',
          'before:bg-gradient-to-t before:from-black/10 before:to-transparent before:opacity-0',
          'hover:before:opacity-100 before:transition-opacity',
          'after:absolute after:inset-0 after:rounded-[inherit]',
          'after:bg-gradient-to-b after:from-white/20 after:to-transparent after:opacity-0',
          'active:after:opacity-100 after:transition-opacity',
        ].join(' '),

        // Secondary - Subtle with fill hover
        secondary: [
          'bg-secondary text-secondary-foreground',
          'border border-border/50',
          'hover:bg-secondary/80 hover:border-border',
          'shadow-sm hover:shadow-md',
        ].join(' '),

        // Outline - Border with fill on hover
        outline: [
          'border-2 border-primary/50 text-primary bg-transparent',
          'hover:bg-primary hover:text-primary-foreground hover:border-primary',
          'hover:shadow-lg hover:shadow-primary/20',
          'hover:-translate-y-0.5 active:translate-y-0',
        ].join(' '),

        // Ghost - Minimal with background on hover
        ghost: [
          'text-foreground/80 bg-transparent',
          'hover:bg-secondary hover:text-foreground',
        ].join(' '),

        // Link - Text with animated underline
        link: [
          'text-primary bg-transparent p-0 h-auto',
          'underline-offset-4 hover:underline',
          'focus-visible:ring-0 focus-visible:ring-offset-0',
        ].join(' '),

        // Destructive - Error/danger actions
        destructive: [
          'bg-destructive text-destructive-foreground',
          'shadow-md hover:shadow-lg hover:shadow-destructive/25',
          'hover:bg-destructive/90',
          'hover:-translate-y-0.5 active:translate-y-0',
        ].join(' '),

        // Premium - Gold gradient with glow
        premium: [
          'text-primary-foreground',
          'bg-gradient-to-r from-primary via-primary to-[hsl(38,80%,45%)]',
          'shadow-lg shadow-primary/30',
          'hover:shadow-xl hover:shadow-primary/40',
          'hover:-translate-y-1 active:translate-y-0',
          'before:absolute before:inset-0 before:rounded-[inherit]',
          'before:bg-gradient-to-t before:from-black/10 before:to-white/10',
          'before:opacity-0 hover:before:opacity-100 before:transition-opacity',
        ].join(' '),

        // Glass - Frosted glass effect
        glass: [
          'bg-white/10 text-foreground backdrop-blur-xl',
          'border border-white/20',
          'hover:bg-white/20 hover:border-white/30',
          'shadow-lg shadow-black/5',
          'dark:bg-black/20 dark:border-white/10',
          'dark:hover:bg-black/30 dark:hover:border-white/20',
        ].join(' '),

        // Icon - Circular icon button
        icon: [
          'bg-transparent text-foreground/70',
          'hover:bg-secondary hover:text-foreground',
          'rounded-full aspect-square p-0',
        ].join(' '),
      },

      size: {
        xs: 'h-7 px-2.5 text-xs rounded-md [&_svg]:w-3 [&_svg]:h-3',
        sm: 'h-9 px-4 text-sm rounded-lg [&_svg]:w-4 [&_svg]:h-4',
        md: 'h-11 px-5 text-sm rounded-xl [&_svg]:w-4 [&_svg]:h-4',
        lg: 'h-12 px-7 text-base rounded-xl [&_svg]:w-5 [&_svg]:h-5',
        xl: 'h-14 px-9 text-lg rounded-2xl [&_svg]:w-5 [&_svg]:h-5',
        icon: 'h-10 w-10 rounded-full',
        'icon-sm': 'h-8 w-8 rounded-full',
        'icon-lg': 'h-12 w-12 rounded-full',
      },

      fullWidth: {
        true: 'w-full',
      },
    },

    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

// =============================================================================
// BUTTON PROPS
// =============================================================================

export interface PremiumButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof premiumButtonVariants> {
  asChild?: boolean;
  loading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

// =============================================================================
// PREMIUM BUTTON COMPONENT
// =============================================================================

const PremiumButton = React.forwardRef<HTMLButtonElement, PremiumButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      asChild = false,
      loading = false,
      loadingText,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';
    const isDisabled = disabled || loading;

    return (
      <Comp
        className={cn(premiumButtonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {/* Loading Spinner */}
        {loading && (
          <Loader2 className="animate-spin" />
        )}

        {/* Left Icon */}
        {!loading && leftIcon && (
          <span className="shrink-0">{leftIcon}</span>
        )}

        {/* Button Content */}
        <span className="relative z-10">
          {loading && loadingText ? loadingText : children}
        </span>

        {/* Right Icon */}
        {!loading && rightIcon && (
          <span className="shrink-0">{rightIcon}</span>
        )}
      </Comp>
    );
  }
);

PremiumButton.displayName = 'PremiumButton';

// =============================================================================
// ICON BUTTON COMPONENT
// =============================================================================

export interface IconButtonProps
  extends Omit<PremiumButtonProps, 'leftIcon' | 'rightIcon' | 'loadingText'> {
  icon: React.ReactNode;
  'aria-label': string;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, className, size = 'icon', variant = 'icon', ...props }, ref) => {
    return (
      <PremiumButton
        ref={ref}
        variant={variant}
        size={size}
        className={className}
        {...props}
      >
        {icon}
      </PremiumButton>
    );
  }
);

IconButton.displayName = 'IconButton';

// =============================================================================
// BUTTON GROUP COMPONENT
// =============================================================================

interface ButtonGroupProps {
  children: React.ReactNode;
  className?: string;
  attached?: boolean;
}

const ButtonGroup = ({ children, className, attached = false }: ButtonGroupProps) => {
  return (
    <div
      className={cn(
        'inline-flex items-center',
        attached && [
          'gap-0',
          '[&>button]:rounded-none',
          '[&>button:first-child]:rounded-l-xl',
          '[&>button:last-child]:rounded-r-xl',
          '[&>button:not(:last-child)]:border-r-0',
        ],
        !attached && 'gap-2',
        className
      )}
    >
      {children}
    </div>
  );
};

// =============================================================================
// EXPORTS
// =============================================================================

export { PremiumButton, IconButton, ButtonGroup, premiumButtonVariants };
export default PremiumButton;
