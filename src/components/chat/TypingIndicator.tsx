import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';

interface TypingIndicatorProps {
  visible: boolean;
}

export function TypingIndicator({ visible }: TypingIndicatorProps) {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) return;

    const animate = (dot: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ])
      );
    };

    const animation1 = animate(dot1, 0);
    const animation2 = animate(dot2, 150);
    const animation3 = animate(dot3, 300);

    animation1.start();
    animation2.start();
    animation3.start();

    return () => {
      animation1.stop();
      animation2.stop();
      animation3.stop();
    };
  }, [visible, dot1, dot2, dot3]);

  if (!visible) return null;

  const createDotStyle = (dot: Animated.Value) => ({
    transform: [
      {
        translateY: dot.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -4],
        }),
      },
    ],
    opacity: dot.interpolate({
      inputRange: [0, 1],
      outputRange: [0.4, 1],
    }),
  });

  return (
    <View className="flex-row items-center px-4 mb-4">
      <View className="flex-row items-center bg-secondary rounded-2xl rounded-bl-sm px-4 py-3">
        <Animated.View
          className="w-2 h-2 rounded-full bg-muted-foreground mr-1"
          style={createDotStyle(dot1)}
        />
        <Animated.View
          className="w-2 h-2 rounded-full bg-muted-foreground mr-1"
          style={createDotStyle(dot2)}
        />
        <Animated.View
          className="w-2 h-2 rounded-full bg-muted-foreground"
          style={createDotStyle(dot3)}
        />
      </View>
    </View>
  );
}
