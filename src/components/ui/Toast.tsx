import React, { useEffect, useRef } from 'react';
import { Animated, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cn } from '@/lib/utils';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ToastProps {
  visible: boolean;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
  onHide: () => void;
}

export function Toast({
  visible,
  message,
  type = 'info',
  duration = 3000,
  onHide,
}: ToastProps) {
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        hideToast();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -100,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => onHide());
  };

  const icons = {
    info: 'information-circle',
    success: 'checkmark-circle',
    warning: 'warning',
    error: 'close-circle',
  } as const;

  const colors = {
    info: 'bg-primary',
    success: 'bg-success',
    warning: 'bg-warning',
    error: 'bg-destructive',
  };

  if (!visible) return null;

  return (
    <Animated.View
      className="absolute left-4 right-4 z-50"
      style={{
        top: insets.top + 8,
        transform: [{ translateY }],
        opacity,
      }}
    >
      <View
        className={cn(
          'flex-row items-center rounded-lg p-4',
          colors[type]
        )}
      >
        <Ionicons name={icons[type]} size={20} color="#fff" />
        <Text className="ml-3 flex-1 text-sm font-medium text-white">
          {message}
        </Text>
        <TouchableOpacity onPress={hideToast}>
          <Ionicons name="close" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}
