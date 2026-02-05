'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X, Loader2 } from 'lucide-react';

// =============================================================================
// LOADING STATES
// =============================================================================

// Skeleton Component
interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'shimmer' | 'none';
}

export function Skeleton({
  className,
  variant = 'rectangular',
  width,
  height,
  animation = 'shimmer',
}: SkeletonProps) {
  const variantStyles = {
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-xl',
  };

  const animationStyles = {
    pulse: 'animate-pulse',
    shimmer: 'skeleton',
    none: '',
  };

  return (
    <div
      className={cn(
        'bg-muted',
        variantStyles[variant],
        animationStyles[animation],
        className
      )}
      style={{ width, height }}
    />
  );
}

// Spinner Component
interface SpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'current' | 'muted';
  className?: string;
}

const spinnerSizes = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
};

export function Spinner({ size = 'md', color = 'primary', className }: SpinnerProps) {
  const colorStyles = {
    primary: 'text-primary',
    current: 'text-current',
    muted: 'text-muted-foreground',
  };

  return (
    <Loader2
      className={cn(
        'animate-spin',
        spinnerSizes[size],
        colorStyles[color],
        className
      )}
    />
  );
}

// Loading Overlay
interface LoadingOverlayProps {
  isLoading: boolean;
  text?: string;
  blur?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function LoadingOverlay({
  isLoading,
  text,
  blur = true,
  className,
  children,
}: LoadingOverlayProps) {
  return (
    <div className={cn('relative', className)}>
      {children}
      {isLoading && (
        <div
          className={cn(
            'absolute inset-0 z-50 flex flex-col items-center justify-center',
            'bg-background/80 transition-all duration-300',
            blur && 'backdrop-blur-sm'
          )}
        >
          <Spinner size="lg" />
          {text && (
            <p className="mt-3 text-sm text-muted-foreground">{text}</p>
          )}
        </div>
      )}
    </div>
  );
}

// Progress Bar
interface ProgressBarProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'success' | 'warning' | 'error';
  showValue?: boolean;
  animated?: boolean;
  className?: string;
}

export function ProgressBar({
  value,
  max = 100,
  size = 'md',
  color = 'primary',
  showValue = false,
  animated = true,
  className,
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizeStyles = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const colorStyles = {
    primary: 'bg-primary',
    success: 'bg-green-500',
    warning: 'bg-amber-500',
    error: 'bg-red-500',
  };

  return (
    <div className={cn('w-full', className)}>
      <div className={cn('w-full bg-muted rounded-full overflow-hidden', sizeStyles[size])}>
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500',
            colorStyles[color],
            animated && 'animate-pulse'
          )}
          style={{
            width: `${percentage}%`,
            transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />
      </div>
      {showValue && (
        <p className="mt-1 text-xs text-muted-foreground text-right">
          {Math.round(percentage)}%
        </p>
      )}
    </div>
  );
}

// =============================================================================
// EMPTY STATES
// =============================================================================

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center py-16 px-4',
        className
      )}
    >
      {icon && (
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-6">
          <span className="text-muted-foreground">{icon}</span>
        </div>
      )}
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground max-w-sm mb-6">
          {description}
        </p>
      )}
      {action}
    </div>
  );
}

// =============================================================================
// ERROR STATES
// =============================================================================

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'An error occurred. Please try again.',
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center py-16 px-4',
        className
      )}
    >
      <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
        <AlertCircle className="w-8 h-8 text-destructive" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 text-sm font-medium text-primary hover:underline"
        >
          Try again
        </button>
      )}
    </div>
  );
}

// =============================================================================
// SUCCESS STATE
// =============================================================================

interface SuccessStateProps {
  title?: string;
  message?: string;
  action?: React.ReactNode;
  className?: string;
}

export function SuccessState({
  title = 'Success!',
  message,
  action,
  className,
}: SuccessStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center py-16 px-4',
        className
      )}
    >
      <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-6">
        <CheckCircle className="w-8 h-8 text-green-500" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      {message && (
        <p className="text-sm text-muted-foreground max-w-sm mb-6">{message}</p>
      )}
      {action}
    </div>
  );
}

// =============================================================================
// ALERT / BANNER
// =============================================================================

interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  message: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  action?: React.ReactNode;
  className?: string;
}

const alertIcons = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: AlertCircle,
};

const alertStyles = {
  info: 'bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400',
  success: 'bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400',
  warning: 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400',
  error: 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400',
};

export function Alert({
  variant = 'info',
  title,
  message,
  dismissible = false,
  onDismiss,
  action,
  className,
}: AlertProps) {
  const Icon = alertIcons[variant];

  return (
    <div
      className={cn(
        'relative flex gap-4 p-4 rounded-xl border',
        alertStyles[variant],
        className
      )}
      role="alert"
    >
      <Icon className="w-5 h-5 shrink-0 mt-0.5" />
      <div className="flex-1">
        {title && <p className="font-semibold mb-1">{title}</p>}
        <p className="text-sm opacity-90">{message}</p>
        {action && <div className="mt-3">{action}</div>}
      </div>
      {dismissible && (
        <button
          onClick={onDismiss}
          className="shrink-0 p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

// =============================================================================
// STATUS BADGE
// =============================================================================

interface StatusBadgeProps {
  status: 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'pending';
  label: string;
  dot?: boolean;
  className?: string;
}

const statusBadgeStyles = {
  success: 'bg-green-500/10 text-green-600 dark:text-green-400',
  warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  error: 'bg-red-500/10 text-red-600 dark:text-red-400',
  info: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  neutral: 'bg-muted text-muted-foreground',
  pending: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
};

const statusDotStyles = {
  success: 'bg-green-500',
  warning: 'bg-amber-500',
  error: 'bg-red-500',
  info: 'bg-blue-500',
  neutral: 'bg-muted-foreground',
  pending: 'bg-purple-500',
};

export function StatusBadge({
  status,
  label,
  dot = true,
  className,
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
        statusBadgeStyles[status],
        className
      )}
    >
      {dot && (
        <span
          className={cn('w-1.5 h-1.5 rounded-full', statusDotStyles[status])}
        />
      )}
      {label}
    </span>
  );
}

// =============================================================================
// OFFLINE STATE
// =============================================================================

interface OfflineStateProps {
  className?: string;
}

export function OfflineState({ className }: OfflineStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center py-16 px-4',
        className
      )}
    >
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-6">
        <svg
          className="w-8 h-8 text-muted-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a5 5 0 01-.586-7.072m7.072 7.072l-2.829-2.829M3 3l18 18"
          />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">
        You&apos;re offline
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm">
        Please check your internet connection and try again.
      </p>
    </div>
  );
}

// =============================================================================
// EXPORTS
// =============================================================================

export default Skeleton;
