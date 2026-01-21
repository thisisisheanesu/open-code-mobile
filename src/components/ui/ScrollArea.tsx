import React from 'react';
import { ScrollView, type ScrollViewProps } from 'react-native';
import { cn } from '@/lib/utils';

interface ScrollAreaProps extends ScrollViewProps {
  children: React.ReactNode;
}

export function ScrollArea({ children, className, ...props }: ScrollAreaProps) {
  return (
    <ScrollView
      className={cn('flex-1', className)}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      {...props}
    >
      {children}
    </ScrollView>
  );
}
