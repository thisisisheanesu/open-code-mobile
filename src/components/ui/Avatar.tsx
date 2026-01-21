import React from 'react';
import { View, Image, Text, type ViewProps } from 'react-native';
import { cn } from '@/lib/utils';

interface AvatarProps extends ViewProps {
  size?: 'sm' | 'default' | 'lg';
  src?: string;
  fallback?: string;
}

export function Avatar({
  size = 'default',
  src,
  fallback,
  className,
  ...props
}: AvatarProps) {
  const sizes = {
    sm: 'h-8 w-8',
    default: 'h-10 w-10',
    lg: 'h-12 w-12',
  };

  const textSizes = {
    sm: 'text-xs',
    default: 'text-sm',
    lg: 'text-base',
  };

  return (
    <View
      className={cn(
        'items-center justify-center overflow-hidden rounded-full bg-muted',
        sizes[size],
        className
      )}
      {...props}
    >
      {src ? (
        <Image source={{ uri: src }} className="h-full w-full" />
      ) : (
        <Text className={cn('font-semibold text-muted-foreground', textSizes[size])}>
          {fallback?.slice(0, 2).toUpperCase() || '?'}
        </Text>
      )}
    </View>
  );
}
