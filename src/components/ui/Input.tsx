import React from 'react';
import { TextInput, View, Text, type TextInputProps } from 'react-native';
import { cn } from '@/lib/utils';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerClassName?: string;
}

export function Input({
  label,
  error,
  containerClassName,
  className,
  ...props
}: InputProps) {
  return (
    <View className={cn('w-full', containerClassName)}>
      {label && (
        <Text className="mb-1.5 text-sm font-medium text-foreground">
          {label}
        </Text>
      )}
      <TextInput
        className={cn(
          'h-12 rounded-lg border border-input bg-background px-4 text-base text-foreground',
          'placeholder:text-muted-foreground',
          error && 'border-destructive',
          className
        )}
        placeholderTextColor="#71717a"
        {...props}
      />
      {error && (
        <Text className="mt-1 text-sm text-destructive">{error}</Text>
      )}
    </View>
  );
}

interface TextAreaProps extends TextInputProps {
  label?: string;
  error?: string;
  containerClassName?: string;
}

export function TextArea({
  label,
  error,
  containerClassName,
  className,
  ...props
}: TextAreaProps) {
  return (
    <View className={cn('w-full', containerClassName)}>
      {label && (
        <Text className="mb-1.5 text-sm font-medium text-foreground">
          {label}
        </Text>
      )}
      <TextInput
        className={cn(
          'min-h-[100px] rounded-lg border border-input bg-background p-4 text-base text-foreground',
          'placeholder:text-muted-foreground',
          error && 'border-destructive',
          className
        )}
        placeholderTextColor="#71717a"
        multiline
        textAlignVertical="top"
        {...props}
      />
      {error && (
        <Text className="mt-1 text-sm text-destructive">{error}</Text>
      )}
    </View>
  );
}
