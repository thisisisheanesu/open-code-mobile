import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  type TouchableOpacityProps,
} from 'react-native';
import { cn } from '@/lib/utils';

interface ButtonProps extends TouchableOpacityProps {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  loading?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'default',
  size = 'default',
  loading = false,
  children,
  disabled,
  className,
  ...props
}: ButtonProps) {
  const baseStyles = 'flex-row items-center justify-center rounded-lg';

  const variants = {
    default: 'bg-primary',
    secondary: 'bg-secondary',
    destructive: 'bg-destructive',
    outline: 'border border-border bg-transparent',
    ghost: 'bg-transparent',
  };

  const sizes = {
    default: 'h-12 px-4 py-2',
    sm: 'h-9 px-3',
    lg: 'h-14 px-8',
    icon: 'h-10 w-10',
  };

  const textVariants = {
    default: 'text-primary-foreground',
    secondary: 'text-secondary-foreground',
    destructive: 'text-destructive-foreground',
    outline: 'text-foreground',
    ghost: 'text-foreground',
  };

  const textSizes = {
    default: 'text-base',
    sm: 'text-sm',
    lg: 'text-lg',
    icon: 'text-base',
  };

  return (
    <TouchableOpacity
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        disabled && 'opacity-50',
        className
      )}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'default' ? '#fff' : '#000'}
          size="small"
        />
      ) : typeof children === 'string' ? (
        <Text
          className={cn(
            'font-semibold',
            textVariants[variant],
            textSizes[size]
          )}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
}
