'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { iconSizes } from '@/design-system/tokens';

// =============================================================================
// ICON WRAPPER COMPONENT
// Premium icon system with consistent sizing and animations
// =============================================================================

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';

interface PremiumIconProps {
  icon: React.ComponentType<{ className?: string; size?: number }>;
  size?: IconSize;
  className?: string;
  animate?: 'none' | 'pulse' | 'spin' | 'bounce' | 'ping';
  hoverScale?: boolean;
  hoverRotate?: boolean;
  color?: 'current' | 'primary' | 'muted' | 'success' | 'warning' | 'error';
}

const sizeMap: Record<IconSize, number> = {
  xs: iconSizes.xs,
  sm: iconSizes.sm,
  md: iconSizes.md,
  lg: iconSizes.lg,
  xl: iconSizes.xl,
  '2xl': iconSizes['2xl'],
  '3xl': iconSizes['3xl'],
};

const colorMap: Record<string, string> = {
  current: 'text-current',
  primary: 'text-primary',
  muted: 'text-muted-foreground',
  success: 'text-green-500',
  warning: 'text-amber-500',
  error: 'text-red-500',
};

const animationMap: Record<string, string> = {
  none: '',
  pulse: 'animate-pulse',
  spin: 'animate-spin',
  bounce: 'animate-bounce',
  ping: 'animate-ping',
};

export function PremiumIcon({
  icon: Icon,
  size = 'md',
  className,
  animate = 'none',
  hoverScale = false,
  hoverRotate = false,
  color = 'current',
}: PremiumIconProps) {
  const pixelSize = sizeMap[size];

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center shrink-0',
        'transition-transform duration-300',
        colorMap[color],
        animationMap[animate],
        hoverScale && 'hover:scale-110',
        hoverRotate && 'hover:rotate-12',
        className
      )}
      style={{ width: pixelSize, height: pixelSize }}
    >
      <Icon size={pixelSize} className="w-full h-full" />
    </span>
  );
}

// =============================================================================
// ICON BUTTON WITH RIPPLE/GLOW
// =============================================================================

interface IconButtonBaseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ComponentType<{ className?: string; size?: number }>;
  size?: IconSize;
  variant?: 'default' | 'ghost' | 'outline' | 'glow';
  'aria-label': string;
}

export function IconButtonBase({
  icon: Icon,
  size = 'md',
  variant = 'default',
  className,
  ...props
}: IconButtonBaseProps) {
  const pixelSize = sizeMap[size];
  const buttonSize = pixelSize + 16; // Add padding

  const variantStyles: Record<string, string> = {
    default: 'bg-secondary hover:bg-secondary/80 text-foreground',
    ghost: 'bg-transparent hover:bg-secondary/50 text-foreground/80 hover:text-foreground',
    outline: 'border border-border hover:border-primary hover:text-primary bg-transparent',
    glow: [
      'bg-primary/10 text-primary',
      'hover:bg-primary hover:text-primary-foreground',
      'hover:shadow-lg hover:shadow-primary/30',
    ].join(' '),
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-full',
        'transition-all duration-300',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:pointer-events-none',
        'active:scale-95',
        variantStyles[variant],
        className
      )}
      style={{ width: buttonSize, height: buttonSize }}
      {...props}
    >
      <Icon size={pixelSize} />
    </button>
  );
}

// =============================================================================
// COMMON ICONS RE-EXPORT WITH CONSISTENT NAMING
// Using lucide-react as the single icon library
// =============================================================================

export {
  // Navigation
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  
  // Actions
  Search,
  Plus,
  Minus,
  Check,
  Copy,
  Edit,
  Trash2,
  Download,
  Upload,
  Share2,
  RefreshCw,
  MoreHorizontal,
  MoreVertical,
  
  // E-commerce
  ShoppingBag,
  ShoppingCart,
  Heart,
  Star,
  Package,
  Truck,
  CreditCard,
  Receipt,
  Tag,
  Percent,
  
  // User
  User,
  UserPlus,
  LogIn,
  LogOut,
  Settings,
  Bell,
  Mail,
  
  // Media
  Image,
  Camera,
  Play,
  Pause,
  Volume2,
  VolumeX,
  
  // UI
  Sun,
  Moon,
  Monitor,
  Eye,
  EyeOff,
  Filter,
  SlidersHorizontal,
  Grid,
  List,
  LayoutGrid,
  
  // Status
  AlertCircle,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  HelpCircle,
  Loader2,
  
  // Social
  MessageCircle,
  Send,
  ThumbsUp,
  ThumbsDown,
  
  // AI Features
  Sparkles,
  Wand2,
  Bot,
  Brain,
  Zap,
  
  // Misc
  Home,
  MapPin,
  Calendar,
  Clock,
  Gift,
  Bookmark,
} from 'lucide-react';

export default PremiumIcon;
