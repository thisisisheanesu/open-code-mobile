import React from 'react';
import { Switch as RNSwitch, View, Text, type SwitchProps } from 'react-native';
import { cn } from '@/lib/utils';

interface CustomSwitchProps extends SwitchProps {
  label?: string;
  description?: string;
  containerClassName?: string;
}

export function Switch({
  label,
  description,
  containerClassName,
  ...props
}: CustomSwitchProps) {
  return (
    <View className={cn('flex-row items-center justify-between', containerClassName)}>
      {(label || description) && (
        <View className="flex-1 mr-4">
          {label && (
            <Text className="text-base font-medium text-foreground">{label}</Text>
          )}
          {description && (
            <Text className="text-sm text-muted-foreground">{description}</Text>
          )}
        </View>
      )}
      <RNSwitch
        trackColor={{ false: '#71717a', true: '#18181b' }}
        thumbColor="#fff"
        ios_backgroundColor="#71717a"
        {...props}
      />
    </View>
  );
}
