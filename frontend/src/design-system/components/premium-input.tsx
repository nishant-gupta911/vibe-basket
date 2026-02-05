'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle, Eye, EyeOff, Loader2 } from 'lucide-react';

// =============================================================================
// PREMIUM INPUT COMPONENT
// With floating labels, focus glow, validation states, and animations
// =============================================================================

export interface PremiumInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  helperText?: string;
  error?: string;
  success?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  showPasswordToggle?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled' | 'flushed';
  loading?: boolean;
}

const PremiumInput = React.forwardRef<HTMLInputElement, PremiumInputProps>(
  (
    {
      className,
      type = 'text',
      label,
      helperText,
      error,
      success,
      leftIcon,
      rightIcon,
      showPasswordToggle,
      size = 'md',
      variant = 'default',
      loading = false,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [isFocused, setIsFocused] = React.useState(false);
    const [hasValue, setHasValue] = React.useState(false);
    const inputId = id || React.useId();

    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;

    const hasError = !!error;
    const hasSuccess = !!success && !hasError;

    // Size variants
    const sizeStyles = {
      sm: 'h-10 text-sm',
      md: 'h-12 text-base',
      lg: 'h-14 text-lg',
    };

    const labelSizeStyles = {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
    };

    // Variant styles
    const variantStyles = {
      default: cn(
        'rounded-xl border bg-background',
        'border-border hover:border-foreground/20',
        'focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20',
        hasError && 'border-destructive focus-within:border-destructive focus-within:ring-destructive/20',
        hasSuccess && 'border-green-500 focus-within:border-green-500 focus-within:ring-green-500/20'
      ),
      filled: cn(
        'rounded-xl border-0 bg-secondary/50',
        'hover:bg-secondary/70',
        'focus-within:bg-secondary focus-within:ring-2 focus-within:ring-primary/20',
        hasError && 'bg-destructive/10 focus-within:ring-destructive/20',
        hasSuccess && 'bg-green-500/10 focus-within:ring-green-500/20'
      ),
      flushed: cn(
        'rounded-none border-0 border-b-2 bg-transparent',
        'border-border hover:border-foreground/30',
        'focus-within:border-primary',
        hasError && 'border-destructive',
        hasSuccess && 'border-green-500'
      ),
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(e.target.value.length > 0);
      props.onChange?.(e);
    };

    return (
      <div className={cn('relative w-full', className)}>
        {/* Input Container */}
        <div
          className={cn(
            'relative flex items-center transition-all duration-300',
            sizeStyles[size],
            variantStyles[variant],
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          {/* Left Icon */}
          {leftIcon && (
            <span className="absolute left-4 text-muted-foreground pointer-events-none">
              {leftIcon}
            </span>
          )}

          {/* Input Field */}
          <input
            ref={ref}
            id={inputId}
            type={inputType}
            disabled={disabled || loading}
            className={cn(
              'w-full h-full bg-transparent outline-none',
              'placeholder:text-muted-foreground/50',
              'disabled:cursor-not-allowed',
              'transition-colors duration-200',
              leftIcon ? 'pl-12' : 'pl-4',
              (rightIcon || showPasswordToggle || loading) ? 'pr-12' : 'pr-4',
              label && 'pt-4'
            )}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            onChange={handleChange}
            {...props}
          />

          {/* Floating Label */}
          {label && (
            <label
              htmlFor={inputId}
              className={cn(
                'absolute left-4 pointer-events-none',
                'transition-all duration-200 ease-out',
                'text-muted-foreground',
                leftIcon && 'left-12',
                isFocused || hasValue || props.value || props.defaultValue
                  ? cn('top-2 text-xs', isFocused && 'text-primary')
                  : cn('top-1/2 -translate-y-1/2', labelSizeStyles[size]),
                hasError && isFocused && 'text-destructive',
                hasSuccess && isFocused && 'text-green-500'
              )}
            >
              {label}
            </label>
          )}

          {/* Right Content */}
          <div className="absolute right-4 flex items-center gap-2">
            {/* Loading Spinner */}
            {loading && (
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
            )}

            {/* Password Toggle */}
            {showPasswordToggle && isPassword && !loading && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            )}

            {/* Custom Right Icon */}
            {rightIcon && !loading && !showPasswordToggle && (
              <span className="text-muted-foreground">{rightIcon}</span>
            )}

            {/* Status Icons */}
            {hasError && !loading && (
              <AlertCircle className="w-4 h-4 text-destructive" />
            )}
            {hasSuccess && !loading && !hasError && (
              <CheckCircle className="w-4 h-4 text-green-500" />
            )}
          </div>
        </div>

        {/* Helper/Error Text */}
        {(helperText || error || success) && (
          <p
            className={cn(
              'mt-2 text-sm transition-all duration-200',
              'animate-in slide-in-from-top-1 fade-in-0',
              hasError ? 'text-destructive' : hasSuccess ? 'text-green-500' : 'text-muted-foreground'
            )}
          >
            {error || success || helperText}
          </p>
        )}
      </div>
    );
  }
);

PremiumInput.displayName = 'PremiumInput';

// =============================================================================
// PREMIUM TEXTAREA
// =============================================================================

export interface PremiumTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
  success?: string;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

const PremiumTextarea = React.forwardRef<HTMLTextAreaElement, PremiumTextareaProps>(
  (
    {
      className,
      label,
      helperText,
      error,
      success,
      resize = 'vertical',
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const [hasValue, setHasValue] = React.useState(false);
    const textareaId = id || React.useId();

    const hasError = !!error;
    const hasSuccess = !!success && !hasError;

    const resizeStyles = {
      none: 'resize-none',
      vertical: 'resize-y',
      horizontal: 'resize-x',
      both: 'resize',
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setHasValue(e.target.value.length > 0);
      props.onChange?.(e);
    };

    return (
      <div className={cn('relative w-full', className)}>
        {/* Textarea Container */}
        <div
          className={cn(
            'relative transition-all duration-300',
            'rounded-xl border bg-background',
            'border-border hover:border-foreground/20',
            'focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20',
            hasError && 'border-destructive focus-within:border-destructive focus-within:ring-destructive/20',
            hasSuccess && 'border-green-500 focus-within:border-green-500 focus-within:ring-green-500/20',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          <textarea
            ref={ref}
            id={textareaId}
            disabled={disabled}
            className={cn(
              'w-full min-h-[120px] p-4 bg-transparent outline-none',
              'placeholder:text-muted-foreground/50',
              'disabled:cursor-not-allowed',
              label && 'pt-6',
              resizeStyles[resize]
            )}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            onChange={handleChange}
            {...props}
          />

          {/* Floating Label */}
          {label && (
            <label
              htmlFor={textareaId}
              className={cn(
                'absolute left-4 pointer-events-none',
                'transition-all duration-200 ease-out',
                'text-muted-foreground',
                isFocused || hasValue || props.value || props.defaultValue
                  ? cn('top-2 text-xs', isFocused && 'text-primary')
                  : 'top-4 text-base',
                hasError && isFocused && 'text-destructive',
                hasSuccess && isFocused && 'text-green-500'
              )}
            >
              {label}
            </label>
          )}
        </div>

        {/* Helper/Error Text */}
        {(helperText || error || success) && (
          <p
            className={cn(
              'mt-2 text-sm',
              hasError ? 'text-destructive' : hasSuccess ? 'text-green-500' : 'text-muted-foreground'
            )}
          >
            {error || success || helperText}
          </p>
        )}
      </div>
    );
  }
);

PremiumTextarea.displayName = 'PremiumTextarea';

// =============================================================================
// PREMIUM SELECT
// =============================================================================

export interface PremiumSelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  helperText?: string;
  error?: string;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  size?: 'sm' | 'md' | 'lg';
  placeholder?: string;
}

const PremiumSelect = React.forwardRef<HTMLSelectElement, PremiumSelectProps>(
  (
    {
      className,
      label,
      helperText,
      error,
      options,
      size = 'md',
      placeholder,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const selectId = id || React.useId();
    const hasError = !!error;

    const sizeStyles = {
      sm: 'h-10 text-sm',
      md: 'h-12 text-base',
      lg: 'h-14 text-lg',
    };

    return (
      <div className={cn('relative w-full', className)}>
        {/* Label */}
        {label && (
          <label
            htmlFor={selectId}
            className="block mb-2 text-sm font-medium text-foreground"
          >
            {label}
          </label>
        )}

        {/* Select Container */}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            className={cn(
              'w-full appearance-none cursor-pointer',
              'rounded-xl border bg-background px-4 pr-10',
              'border-border hover:border-foreground/20',
              'focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'transition-all duration-300',
              hasError && 'border-destructive focus:border-destructive focus:ring-destructive/20',
              sizeStyles[size]
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>

          {/* Chevron Icon */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg
              className="w-4 h-4 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        {/* Helper/Error Text */}
        {(helperText || error) && (
          <p
            className={cn(
              'mt-2 text-sm',
              hasError ? 'text-destructive' : 'text-muted-foreground'
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

PremiumSelect.displayName = 'PremiumSelect';

// =============================================================================
// PREMIUM CHECKBOX
// =============================================================================

export interface PremiumCheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
}

const PremiumCheckbox = React.forwardRef<HTMLInputElement, PremiumCheckboxProps>(
  ({ className, label, description, size = 'md', id, ...props }, ref) => {
    const checkboxId = id || React.useId();

    const sizeStyles = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
    };

    return (
      <label
        htmlFor={checkboxId}
        className={cn(
          'flex items-start gap-3 cursor-pointer group',
          props.disabled && 'cursor-not-allowed opacity-50',
          className
        )}
      >
        <div className="relative flex items-center justify-center">
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            className="sr-only peer"
            {...props}
          />
          <div
            className={cn(
              'rounded-md border-2 border-border',
              'bg-background transition-all duration-200',
              'peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2',
              'peer-checked:bg-primary peer-checked:border-primary',
              'group-hover:border-primary/50',
              sizeStyles[size]
            )}
          >
            <svg
              className={cn(
                'absolute inset-0 text-primary-foreground',
                'opacity-0 scale-50 transition-all duration-200',
                'peer-checked:opacity-100 peer-checked:scale-100'
              )}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
        {(label || description) && (
          <div className="flex flex-col">
            {label && (
              <span className="text-sm font-medium text-foreground">
                {label}
              </span>
            )}
            {description && (
              <span className="text-xs text-muted-foreground">
                {description}
              </span>
            )}
          </div>
        )}
      </label>
    );
  }
);

PremiumCheckbox.displayName = 'PremiumCheckbox';

// =============================================================================
// EXPORTS
// =============================================================================

export { PremiumInput, PremiumTextarea, PremiumSelect, PremiumCheckbox };
export default PremiumInput;
