import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { splashColors } from '../../theme';

// Must match DynexSplashScreen's `STAGE_SIZE` -- both this and
// OrbitalRings center their contents inside a shared square "stage" so
// the halo, rings and logo all share one exact center point.
const STAGE_SIZE = 340;

// A soft radial glow, faked with a handful of stacked, decreasingly-
// opaque circles rather than an actual radial-gradient (React Native has
// no built-in one, and pulling in a drawing library just for this felt
// like overkill). Cheap, GPU-friendly (opacity + scale only), and reads
// convincingly at this scale.
const LAYERS = [
  { size: 340, color: splashColors.cobalt, opacity: 0.09 },
  { size: 260, color: '#7C8CE0', opacity: 0.13 },
  { size: 190, color: splashColors.white, opacity: 0.1 },
  { size: 120, color: splashColors.champagneSoft, opacity: 0.06 },
];

export default function LogoGlow({ reduceMotion }: { reduceMotion: boolean }) {
  const entrance = useRef(new Animated.Value(0)).current;
  const breathe = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(entrance, {
      toValue: 1,
      duration: 900,
      delay: 150,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    // Starts around the 1.5s mark, once the entrance has settled, per the
    // brief's "1500ms onward: very subtle breathing/glow effect".
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(breathe, { toValue: 1, duration: 1900, delay: 1500, useNativeDriver: true }),
        Animated.timing(breathe, { toValue: 0, duration: 1900, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [reduceMotion]);

  const scale = breathe.interpolate({ inputRange: [0, 1], outputRange: [1, 1.1] });

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.container, { opacity: entrance, transform: [{ scale }] }]}
    >
      {LAYERS.map((layer, i) => (
        <View
          key={i}
          style={{
            position: 'absolute',
            top: (STAGE_SIZE - layer.size) / 2,
            left: (STAGE_SIZE - layer.size) / 2,
            width: layer.size,
            height: layer.size,
            borderRadius: layer.size / 2,
            backgroundColor: layer.color,
            opacity: layer.opacity,
          }}
        />
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
