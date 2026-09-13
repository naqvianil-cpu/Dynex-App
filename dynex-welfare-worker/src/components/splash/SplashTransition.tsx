import React, { useEffect, useRef } from 'react';
import { Animated, StyleProp, ViewStyle } from 'react-native';

interface SplashTransitionProps {
  visible: boolean;
  onHidden?: () => void;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

// Generic fade + subtle scale wrapper used to hand off from the launch
// screen to the app's real navigation tree. Deliberately generic (no
// splash-specific logic) so it can be reused anywhere else a similarly
// soft crossfade is useful later.
export default function SplashTransition({ visible, onHidden, style, children }: SplashTransitionProps) {
  const progress = useRef(new Animated.Value(visible ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: visible ? 1 : 0,
      duration: 420,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished && !visible) onHidden?.();
    });
  }, [visible]);

  const scale = progress.interpolate({ inputRange: [0, 1], outputRange: [1.03, 1] });

  return (
    <Animated.View
      pointerEvents={visible ? 'auto' : 'none'}
      style={[{ flex: 1, opacity: progress, transform: [{ scale }] }, style]}
    >
      {children}
    </Animated.View>
  );
}
