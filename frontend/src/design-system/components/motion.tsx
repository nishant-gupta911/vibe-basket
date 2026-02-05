'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { motion as motionTokens } from '@/design-system/tokens';

// =============================================================================
// MOTION SYSTEM
// Consistent animations and transitions across the app
// =============================================================================

// =============================================================================
// FADE ANIMATIONS
// =============================================================================

interface FadeProps {
  children: React.ReactNode;
  show?: boolean;
  duration?: 'fast' | 'normal' | 'slow';
  className?: string;
}

export function Fade({ children, show = true, duration = 'normal', className }: FadeProps) {
  const durations = {
    fast: 'duration-150',
    normal: 'duration-300',
    slow: 'duration-500',
  };

  return (
    <div
      className={cn(
        'transition-opacity',
        durations[duration],
        show ? 'opacity-100' : 'opacity-0 pointer-events-none',
        className
      )}
      style={{ transitionTimingFunction: motionTokens.easing.easeOutExpo }}
    >
      {children}
    </div>
  );
}

// =============================================================================
// SLIDE ANIMATIONS
// =============================================================================

interface SlideProps {
  children: React.ReactNode;
  show?: boolean;
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: 'sm' | 'md' | 'lg';
  duration?: 'fast' | 'normal' | 'slow';
  className?: string;
}

export function Slide({
  children,
  show = true,
  direction = 'up',
  distance = 'md',
  duration = 'normal',
  className,
}: SlideProps) {
  const distances = {
    sm: 8,
    md: 16,
    lg: 32,
  };

  const durations = {
    fast: 'duration-150',
    normal: 'duration-300',
    slow: 'duration-500',
  };

  const translateMap = {
    up: show ? 'translate-y-0' : `translate-y-[${distances[distance]}px]`,
    down: show ? 'translate-y-0' : `translate-y-[-${distances[distance]}px]`,
    left: show ? 'translate-x-0' : `translate-x-[${distances[distance]}px]`,
    right: show ? 'translate-x-0' : `translate-x-[-${distances[distance]}px]`,
  };

  return (
    <div
      className={cn(
        'transition-all',
        durations[duration],
        show ? 'opacity-100' : 'opacity-0',
        translateMap[direction],
        className
      )}
      style={{ transitionTimingFunction: motionTokens.easing.easeOutExpo }}
    >
      {children}
    </div>
  );
}

// =============================================================================
// SCALE ANIMATIONS
// =============================================================================

interface ScaleProps {
  children: React.ReactNode;
  show?: boolean;
  origin?: 'center' | 'top' | 'bottom' | 'left' | 'right';
  duration?: 'fast' | 'normal' | 'slow';
  className?: string;
}

export function Scale({
  children,
  show = true,
  origin = 'center',
  duration = 'normal',
  className,
}: ScaleProps) {
  const durations = {
    fast: 'duration-150',
    normal: 'duration-300',
    slow: 'duration-500',
  };

  const origins = {
    center: 'origin-center',
    top: 'origin-top',
    bottom: 'origin-bottom',
    left: 'origin-left',
    right: 'origin-right',
  };

  return (
    <div
      className={cn(
        'transition-all',
        durations[duration],
        origins[origin],
        show ? 'scale-100 opacity-100' : 'scale-95 opacity-0',
        className
      )}
      style={{ transitionTimingFunction: motionTokens.easing.easeOutExpo }}
    >
      {children}
    </div>
  );
}

// =============================================================================
// STAGGER CONTAINER
// =============================================================================

interface StaggerContainerProps {
  children: React.ReactNode;
  show?: boolean;
  staggerDelay?: number;
  className?: string;
}

export function StaggerContainer({
  children,
  show = true,
  staggerDelay = 50,
  className,
}: StaggerContainerProps) {
  return (
    <div className={cn(show && 'stagger-reveal', className)}>
      {React.Children.map(children, (child, index) => (
        <div
          className={cn(
            'transition-all duration-500',
            show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          )}
          style={{
            transitionDelay: show ? `${index * staggerDelay}ms` : '0ms',
            transitionTimingFunction: motionTokens.easing.easeOutExpo,
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}

// =============================================================================
// REVEAL ON SCROLL HOOK
// =============================================================================

interface UseRevealOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function useReveal(options: UseRevealOptions = {}) {
  const { threshold = 0.15, rootMargin = '0px', triggerOnce = true } = options;
  const ref = React.useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = React.useState(false);

  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsRevealed(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce]);

  return { ref, isRevealed };
}

// =============================================================================
// REVEAL COMPONENT
// =============================================================================

interface RevealProps {
  children: React.ReactNode;
  animation?: 'fade' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'scale' | 'blur';
  delay?: number;
  duration?: 'fast' | 'normal' | 'slow';
  threshold?: number;
  className?: string;
}

export function Reveal({
  children,
  animation = 'slide-up',
  delay = 0,
  duration = 'normal',
  threshold = 0.15,
  className,
}: RevealProps) {
  const { ref, isRevealed } = useReveal({ threshold });

  const durations = {
    fast: 'duration-300',
    normal: 'duration-500',
    slow: 'duration-700',
  };

  const animationClasses = {
    'fade': isRevealed ? 'opacity-100' : 'opacity-0',
    'slide-up': isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
    'slide-down': isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8',
    'slide-left': isRevealed ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8',
    'slide-right': isRevealed ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8',
    'scale': isRevealed ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
    'blur': isRevealed ? 'opacity-100 blur-0' : 'opacity-0 blur-sm',
  };

  return (
    <div
      ref={ref}
      className={cn('transition-all', durations[duration], animationClasses[animation], className)}
      style={{
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: motionTokens.easing.easeOutExpo,
      }}
    >
      {children}
    </div>
  );
}

// =============================================================================
// PARALLAX HOOK
// =============================================================================

interface UseParallaxOptions {
  speed?: number;
  direction?: 'up' | 'down';
}

export function useParallax(options: UseParallaxOptions = {}) {
  const { speed = 0.3, direction = 'up' } = options;
  const ref = React.useRef<HTMLDivElement>(null);
  const [offset, setOffset] = React.useState(0);

  React.useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const scrolled = window.innerHeight - rect.top;
      const newOffset = scrolled * speed * (direction === 'up' ? -1 : 1);
      setOffset(newOffset);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed, direction]);

  return { ref, offset };
}

// =============================================================================
// HOVER LIFT COMPONENT
// =============================================================================

interface HoverLiftProps {
  children: React.ReactNode;
  lift?: number | 'sm' | 'md' | 'lg';
  amount?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function HoverLift({ children, lift, amount = 'md', className }: HoverLiftProps) {
  // Support both lift (number) and amount (preset) props
  const liftValue = lift ?? amount;
  
  const amounts: Record<string, string> = {
    sm: 'hover:-translate-y-1',
    md: 'hover:-translate-y-2',
    lg: 'hover:-translate-y-3',
  };

  // If numeric lift is provided, use custom transform
  if (typeof liftValue === 'number') {
    return (
      <div
        className={cn(
          'transition-transform duration-300 hover:-translate-y-[var(--lift)]',
          className
        )}
        style={{ 
          '--lift': `${liftValue}px`,
          transitionTimingFunction: motionTokens.easing.easeOutExpo 
        } as React.CSSProperties}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'transition-transform duration-300',
        amounts[liftValue],
        className
      )}
      style={{ transitionTimingFunction: motionTokens.easing.easeOutExpo }}
    >
      {children}
    </div>
  );
}

// =============================================================================
// MAGNETIC BUTTON EFFECT HOOK
// =============================================================================

export function useMagnetic(strength: number = 0.3) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });

  const handleMouseMove = React.useCallback((e: MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = (e.clientX - centerX) * strength;
    const y = (e.clientY - centerY) * strength;
    setPosition({ x, y });
  }, [strength]);

  const handleMouseLeave = React.useCallback(() => {
    setPosition({ x: 0, y: 0 });
  }, []);

  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);

  return { ref, position };
}

// =============================================================================
// PRESS SCALE COMPONENT
// =============================================================================

interface PressScaleProps {
  children: React.ReactNode;
  scale?: number;
  className?: string;
}

export function PressScale({ children, scale = 0.97, className }: PressScaleProps) {
  return (
    <div
      className={cn('transition-transform duration-150 active:scale-[var(--press-scale)]', className)}
      style={{ '--press-scale': scale } as React.CSSProperties}
    >
      {children}
    </div>
  );
}

// =============================================================================
// MOTION PRESETS (CSS Classes)
// =============================================================================

export const motionPresets = {
  // Hover effects
  hoverLift: 'transition-transform duration-300 hover:-translate-y-1',
  hoverScale: 'transition-transform duration-300 hover:scale-105',
  hoverGlow: 'transition-shadow duration-300 hover:shadow-lg hover:shadow-primary/20',
  
  // Click effects
  pressScale: 'transition-transform duration-150 active:scale-95',
  
  // Reveal effects
  fadeIn: 'animate-fade-in',
  fadeInUp: 'animate-fade-in-up',
  slideIn: 'animate-slide-in',
  scaleIn: 'animate-scale-in',
  blurIn: 'animate-blur-in',
  
  // Continuous effects
  float: 'animate-float',
  pulse: 'animate-pulse-gentle',
  shimmer: 'animate-shimmer',
};

// =============================================================================
// EXPORTS
// =============================================================================

export default Reveal;
