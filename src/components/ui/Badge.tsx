import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@/lib/utils';

interface BadgeProps extends ViewProps {
  variant?: 'default' | 'secondary' | 'destructive' | 'success' | 'warning' | 'outline';
  children: React.ReactNode;
}

export function Badge({
  variant = 'default',
  children,
  className,
  ...props
}: BadgeProps) {
  const variants = {
    default: 'bg-primary',
    secondary: 'bg-secondary',
    destructive: 'bg-destructive',
    success: 'bg-success',
    warning: 'bg-warning',
    outline: 'bg-transparent border border-border',
  };

  const textVariants = {
    default: 'text-primary-foreground',
    secondary: 'text-secondary-foreground',
    destructive: 'text-destructive-foreground',
    success: 'text-success-foreground',
    warning: 'text-warning-foreground',
    outline: 'text-foreground',
  };

  return (
    <View
      className={cn(
        'rounded-full px-2.5 py-0.5',
        variants[variant],
        className
      )}
      {...props}
    >
      <Text className={cn('text-xs font-semibold', textVariants[variant])}>
        {children}
      </Text>
    </View>
  );
}
