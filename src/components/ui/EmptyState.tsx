import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cn } from '@/lib/utils';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon = 'folder-open-outline',
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <View className={cn('flex-1 items-center justify-center px-8', className)}>
      <View className="mb-4 rounded-full bg-muted p-4">
        <Ionicons name={icon} size={48} color="#71717a" />
      </View>
      <Text className="mb-2 text-center text-lg font-semibold text-foreground">
        {title}
      </Text>
      {description && (
        <Text className="mb-6 text-center text-sm text-muted-foreground">
          {description}
        </Text>
      )}
      {actionLabel && onAction && (
        <Button onPress={onAction}>{actionLabel}</Button>
      )}
    </View>
  );
}
