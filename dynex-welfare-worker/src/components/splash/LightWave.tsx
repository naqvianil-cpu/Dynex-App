import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface LightWaveProps {
  // expo-linear-gradient requires at least two colors.
  colors: readonly [string, string, ...string[]];
  size: number;
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
  rotation: string;
  reduceMotion: boolean;
  driftDelayMs?: number;
}

// One large, very softly-edged band of gradient light, rotated and bled
// off a corner of the screen. Two of these (see AnimatedBackground) stand
// in for the brief's "curved light waves" -- built from a plain gradient
// plus an oversized borderRadius rather than an SVG path, so no drawing
// library is needed.
export default function LightWave({
  colors,
  size,
  top,
  bottom,
  left,
  right,
  rotation,
  reduceMotion,
  driftDelayMs = 0,
}: LightWaveProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const drift = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 1100,
      delay: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(drift, {
          toValue: 1,
          duration: 6000,
          delay: driftDelayMs,
          useNativeDriver: true,
        }),
        Animated.timing(drift, {
          toValue: 0,
          duration: 6000,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [reduceMotion]);

  const translateY = drift.interpolate({ inputRange: [0, 1], outputRange: [0, 24] });
  const translateX = drift.interpolate({ inputRange: [0, 1], outputRange: [0, -16] });
  const scale = drift.interpolate({ inputRange: [0, 1], outputRange: [1, 1.08] });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.wave,
        {
          width: size,
          height: size * 1.7,
          borderRadius: size,
          top,
          bottom,
          left,
          right,
          opacity,
          transform: [{ rotate: rotation }, { translateX }, { translateY }, { scale }],
        },
      ]}
    >
      <LinearGradient
        colors={colors}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wave: {
    position: 'absolute',
    overflow: 'hidden',
  },
});
