'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useTheme as useNextTheme } from 'next-themes';

// =============================================================================
// THEME TYPES
// =============================================================================

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeContextValue {
  theme: ThemeMode;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  isDark: boolean;
  isLight: boolean;
  isSystem: boolean;
  mounted: boolean;
}

// =============================================================================
// THEME CONTEXT
// =============================================================================

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// =============================================================================
// THEME PROVIDER
// =============================================================================

export function PremiumThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, setTheme, resolvedTheme, systemTheme } = useNextTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = useCallback(() => {
    if (resolvedTheme === 'dark') {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  }, [resolvedTheme, setTheme]);

  const value: ThemeContextValue = {
    theme: (theme as ThemeMode) || 'system',
    resolvedTheme: (resolvedTheme as 'light' | 'dark') || 'light',
    setTheme: (newTheme: ThemeMode) => setTheme(newTheme),
    toggleTheme,
    isDark: resolvedTheme === 'dark',
    isLight: resolvedTheme === 'light',
    isSystem: theme === 'system',
    mounted,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// =============================================================================
// USE PREMIUM THEME HOOK
// =============================================================================

export function usePremiumTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    // Fallback for when used outside provider (SSR safety)
    return {
      theme: 'system',
      resolvedTheme: 'light',
      setTheme: () => {},
      toggleTheme: () => {},
      isDark: false,
      isLight: true,
      isSystem: true,
      mounted: false,
    };
  }

  return context;
}

// =============================================================================
// THEME-AWARE UTILITIES
// =============================================================================

/**
 * Returns the appropriate value based on current theme
 */
export function useThemeValue<T>(lightValue: T, darkValue: T): T {
  const { isDark, mounted } = usePremiumTheme();
  
  // Return light value during SSR to avoid hydration mismatch
  if (!mounted) return lightValue;
  
  return isDark ? darkValue : lightValue;
}

/**
 * Returns shadow based on current theme
 */
export function useThemeShadow(
  lightShadow: string,
  darkShadow: string
): string {
  return useThemeValue(lightShadow, darkShadow);
}

// =============================================================================
// THEME TOGGLE BUTTON COMPONENT
// =============================================================================

import { Moon, Sun, Monitor } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from '@/design-system/tokens';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
  variant?: 'icon' | 'switch' | 'select';
}

export function ThemeToggle({ 
  className, 
  showLabel = false,
  variant = 'icon' 
}: ThemeToggleProps) {
  const { theme, setTheme, toggleTheme, isDark, mounted } = usePremiumTheme();

  // Prevent flash during hydration
  if (!mounted) {
    return (
      <button 
        className={cn(
          'w-10 h-10 rounded-full flex items-center justify-center',
          'bg-secondary/50 animate-pulse',
          className
        )}
        aria-label="Toggle theme"
      />
    );
  }

  if (variant === 'switch') {
    return (
      <button
        onClick={toggleTheme}
        className={cn(
          'relative w-16 h-8 rounded-full p-1 transition-colors duration-300',
          isDark ? 'bg-primary/20' : 'bg-secondary',
          className
        )}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      >
        <span
          className={cn(
            'absolute top-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center',
            'transition-transform duration-300 ease-out-expo',
            isDark ? 'translate-x-8' : 'translate-x-0'
          )}
          style={{ transitionTimingFunction: motion.easing.easeOutExpo }}
        >
          {isDark ? (
            <Moon className="w-3.5 h-3.5 text-primary-foreground" />
          ) : (
            <Sun className="w-3.5 h-3.5 text-primary-foreground" />
          )}
        </span>
      </button>
    );
  }

  if (variant === 'select') {
    return (
      <div className={cn('flex items-center gap-1 p-1 rounded-full bg-secondary/50', className)}>
        {[
          { value: 'light', icon: Sun, label: 'Light' },
          { value: 'dark', icon: Moon, label: 'Dark' },
          { value: 'system', icon: Monitor, label: 'System' },
        ].map(({ value, icon: Icon, label }) => (
          <button
            key={value}
            onClick={() => setTheme(value as ThemeMode)}
            className={cn(
              'relative w-9 h-9 rounded-full flex items-center justify-center',
              'transition-all duration-300',
              theme === value
                ? 'bg-background shadow-sm text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
            aria-label={`Use ${label} theme`}
            title={label}
          >
            <Icon className="w-4 h-4" />
          </button>
        ))}
      </div>
    );
  }

  // Default: icon variant
  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'relative w-10 h-10 rounded-full flex items-center justify-center',
        'bg-secondary/0 hover:bg-secondary transition-all duration-300',
        'text-foreground/80 hover:text-foreground',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
        className
      )}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <span className="relative">
        {/* Sun icon */}
        <Sun
          className={cn(
            'w-5 h-5 absolute inset-0 transition-all duration-500',
            isDark ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'
          )}
          style={{ transitionTimingFunction: motion.easing.easeOutExpo }}
        />
        {/* Moon icon */}
        <Moon
          className={cn(
            'w-5 h-5 transition-all duration-500',
            isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'
          )}
          style={{ transitionTimingFunction: motion.easing.easeOutExpo }}
        />
      </span>
    </button>
  );
}

export default ThemeToggle;
