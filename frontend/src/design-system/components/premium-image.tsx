'use client';

import * as React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

// =============================================================================
// PREMIUM IMAGE COMPONENT
// With blur-up loading, zoom-on-hover, skeleton loading, and motion reveal
// =============================================================================

interface PremiumImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  aspectRatio?: 'square' | 'portrait' | 'landscape' | 'cinema' | 'auto';
  className?: string;
  containerClassName?: string;
  priority?: boolean;
  quality?: number;
  hoverZoom?: boolean;
  overlay?: 'none' | 'gradient' | 'vignette' | 'dark' | 'light';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  objectFit?: 'cover' | 'contain' | 'fill' | 'none';
  showSkeleton?: boolean;
  onLoad?: () => void;
}

const aspectRatioMap = {
  square: 'aspect-square',
  portrait: 'aspect-[3/4]',
  landscape: 'aspect-[4/3]',
  cinema: 'aspect-[16/9]',
  auto: '',
};

const roundedMap = {
  none: 'rounded-none',
  sm: 'rounded-lg',
  md: 'rounded-xl',
  lg: 'rounded-2xl',
  xl: 'rounded-3xl',
  '2xl': 'rounded-[2rem]',
  full: 'rounded-full',
};

const overlayMap = {
  none: '',
  gradient: 'after:absolute after:inset-0 after:bg-gradient-to-t after:from-black/50 after:to-transparent',
  vignette: 'after:absolute after:inset-0 after:shadow-[inset_0_0_100px_rgba(0,0,0,0.3)]',
  dark: 'after:absolute after:inset-0 after:bg-black/30',
  light: 'after:absolute after:inset-0 after:bg-white/30',
};

export function PremiumImage({
  src,
  alt,
  width,
  height,
  fill = true,
  aspectRatio = 'auto',
  className,
  containerClassName,
  priority = false,
  quality = 85,
  hoverZoom = false,
  overlay = 'none',
  rounded = 'lg',
  objectFit = 'cover',
  showSkeleton = true,
  onLoad,
}: PremiumImageProps) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div
      className={cn(
        'relative overflow-hidden',
        aspectRatioMap[aspectRatio],
        roundedMap[rounded],
        overlayMap[overlay],
        hoverZoom && 'group',
        containerClassName
      )}
    >
      {/* Skeleton Loader */}
      {showSkeleton && isLoading && (
        <div className="absolute inset-0 skeleton animate-pulse" />
      )}

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 bg-muted flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <svg
              className="w-8 h-8 mx-auto mb-2 opacity-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-xs">Failed to load</span>
          </div>
        </div>
      )}

      {/* Image */}
      <Image
        src={src}
        alt={alt}
        {...(fill ? { fill: true } : { width, height })}
        priority={priority}
        quality={quality}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          'transition-all duration-700',
          objectFit === 'cover' && 'object-cover',
          objectFit === 'contain' && 'object-contain',
          objectFit === 'fill' && 'object-fill',
          objectFit === 'none' && 'object-none',
          isLoading ? 'scale-105 blur-sm opacity-0' : 'scale-100 blur-0 opacity-100',
          hoverZoom && 'group-hover:scale-110',
          className
        )}
        style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
      />
    </div>
  );
}

// =============================================================================
// AVATAR COMPONENT
// =============================================================================

interface AvatarProps {
  src?: string;
  alt: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  status?: 'online' | 'offline' | 'away' | 'busy' | 'none';
  className?: string;
}

const avatarSizeMap = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
  '2xl': 'w-24 h-24 text-2xl',
};

const statusColors = {
  online: 'bg-green-500',
  offline: 'bg-gray-400',
  away: 'bg-amber-500',
  busy: 'bg-red-500',
  none: '',
};

const statusSizeMap = {
  xs: 'w-1.5 h-1.5 border',
  sm: 'w-2 h-2 border',
  md: 'w-2.5 h-2.5 border-2',
  lg: 'w-3 h-3 border-2',
  xl: 'w-4 h-4 border-2',
  '2xl': 'w-5 h-5 border-2',
};

export function Avatar({
  src,
  alt,
  name,
  size = 'md',
  status = 'none',
  className,
}: AvatarProps) {
  const [hasError, setHasError] = React.useState(false);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={cn('relative inline-flex shrink-0', className)}>
      <div
        className={cn(
          'relative overflow-hidden rounded-full bg-muted',
          'flex items-center justify-center font-medium',
          avatarSizeMap[size]
        )}
      >
        {src && !hasError ? (
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover"
            onError={() => setHasError(true)}
          />
        ) : name ? (
          <span className="text-muted-foreground">{getInitials(name)}</span>
        ) : (
          <svg
            className="w-1/2 h-1/2 text-muted-foreground"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        )}
      </div>

      {/* Status Indicator */}
      {status !== 'none' && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full border-background',
            statusColors[status],
            statusSizeMap[size]
          )}
        />
      )}
    </div>
  );
}

// =============================================================================
// AVATAR GROUP
// =============================================================================

interface AvatarGroupProps {
  avatars: Array<{ src?: string; name: string; alt: string }>;
  max?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

export function AvatarGroup({
  avatars,
  max = 4,
  size = 'md',
  className,
}: AvatarGroupProps) {
  const displayed = avatars.slice(0, max);
  const remaining = avatars.length - max;

  const overlapMap = {
    xs: '-ml-1.5',
    sm: '-ml-2',
    md: '-ml-3',
    lg: '-ml-4',
  };

  return (
    <div className={cn('flex items-center', className)}>
      {displayed.map((avatar, index) => (
        <div
          key={index}
          className={cn(index > 0 && overlapMap[size])}
          style={{ zIndex: displayed.length - index }}
        >
          <Avatar
            src={avatar.src}
            name={avatar.name}
            alt={avatar.alt}
            size={size}
            className="ring-2 ring-background"
          />
        </div>
      ))}

      {remaining > 0 && (
        <div
          className={cn(
            'relative flex items-center justify-center rounded-full bg-muted',
            'text-muted-foreground font-medium ring-2 ring-background',
            overlapMap[size],
            avatarSizeMap[size]
          )}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
}

// =============================================================================
// IMAGE GALLERY
// =============================================================================

interface ImageGalleryProps {
  images: Array<{ src: string; alt: string }>;
  columns?: 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  aspectRatio?: 'square' | 'portrait' | 'landscape';
  className?: string;
}

export function ImageGallery({
  images,
  columns = 3,
  gap = 'md',
  aspectRatio = 'square',
  className,
}: ImageGalleryProps) {
  const columnsMap = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
  };

  const gapMap = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
  };

  return (
    <div className={cn('grid', columnsMap[columns], gapMap[gap], className)}>
      {images.map((image, index) => (
        <PremiumImage
          key={index}
          src={image.src}
          alt={image.alt}
          aspectRatio={aspectRatio}
          hoverZoom
          rounded="lg"
        />
      ))}
    </div>
  );
}

// =============================================================================
// EXPORTS
// =============================================================================

export default PremiumImage;
